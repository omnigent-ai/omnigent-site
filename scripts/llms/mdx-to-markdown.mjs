// Converts one page.mdx into plain Markdown for llms-full.txt.
//
// The MDX is parsed with the same toolchain Next uses (remark-parse + remark-mdx
// + remark-gfm) and the output is built by slicing the ORIGINAL source by AST
// position. Only nodes that are not Markdown (imports/exports, JSX, `{}`
// expressions) are rewritten, so prose, fenced code and inline code are
// preserved byte-for-byte, including literal placeholders like `<path>`.
//
// This is deliberately not a React renderer. JSX is handled in three tiers:
//   1. Known site components are expanded from their own data modules.
//   2. A handful of HTML tags (a, img, video, table, ...) map to Markdown.
//   3. Everything else is a presentational wrapper: tags dropped, text kept.

import path from "node:path";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import remarkGfm from "remark-gfm";
import {
  cliTabs,
  gateways,
  providerKeys,
} from "../../lib/docs-component-data.js";
import {
  MACOS_DOWNLOAD_URL,
  MACOS_X64_DOWNLOAD_URL,
} from "../../components/links.js";

const ROOT = path.resolve(import.meta.dirname, "../..");
const FLOW_TYPES = new Set([
  "mdxjsEsm",
  "mdxFlowExpression",
  "mdxJsxFlowElement",
]);

export class MdxConversionError extends Error {}

const parser = unified().use(remarkParse).use(remarkMdx).use(remarkGfm);

// ---- estree helpers (page metadata lives in `export const` statements) -----

function evalExpr(node, scope) {
  if (!node) return undefined;
  switch (node.type) {
    case "Literal":
      return node.value;
    case "TemplateLiteral":
      return node.expressions.length === 0
        ? node.quasis.map((q) => q.value.cooked).join("")
        : undefined;
    case "Identifier":
      return scope.has(node.name) ? scope.get(node.name) : undefined;
    case "MemberExpression": {
      const obj = evalExpr(node.object, scope);
      const key = node.computed
        ? evalExpr(node.property, scope)
        : node.property.name;
      return obj && typeof obj === "object" ? obj[key] : undefined;
    }
    case "ObjectExpression": {
      const out = {};
      for (const prop of node.properties) {
        if (prop.type !== "Property") continue;
        const key = prop.key.name ?? prop.key.value;
        out[key] = evalExpr(prop.value, scope);
      }
      return out;
    }
    default:
      return undefined;
  }
}

function findCall(node, name) {
  if (!node || typeof node !== "object") return null;
  if (
    node.type === "CallExpression" &&
    node.callee.type === "Identifier" &&
    node.callee.name === name
  ) {
    return node;
  }
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        const found = findCall(item, name);
        if (found) return found;
      }
    } else if (value && typeof value === "object" && value.type) {
      const found = findCall(value, name);
      if (found) return found;
    }
  }
  return null;
}

function readEsm(tree) {
  const scope = new Map();
  const imports = new Map(); // local name -> { source, imported }
  let pageMeta = null;
  for (const node of tree.children) {
    if (node.type !== "mdxjsEsm") continue;
    for (const stmt of node.data?.estree?.body ?? []) {
      if (stmt.type === "ImportDeclaration") {
        for (const spec of stmt.specifiers) {
          imports.set(spec.local.name, {
            source: stmt.source.value,
            imported:
              spec.type === "ImportDefaultSpecifier"
                ? "default"
                : spec.imported?.name,
          });
        }
      } else if (
        stmt.type === "ExportNamedDeclaration" &&
        stmt.declaration?.type === "VariableDeclaration"
      ) {
        for (const decl of stmt.declaration.declarations) {
          if (decl.id.type !== "Identifier") continue;
          scope.set(decl.id.name, evalExpr(decl.init, scope));
        }
      }
    }
  }
  // Second pass: pageMeta(title, description, ...) may reference `meta`.
  for (const node of tree.children) {
    if (node.type !== "mdxjsEsm") continue;
    const call = findCall(node.data?.estree, "pageMeta");
    if (call && !pageMeta) {
      const [title, description] = call.arguments.map((arg) =>
        evalExpr(arg, scope),
      );
      pageMeta = {
        title: typeof title === "string" ? title : null,
        description: typeof description === "string" ? description : null,
      };
    }
  }
  return { imports, pageMeta };
}

// ---- small AST helpers ------------------------------------------------------

function plainText(node) {
  if (typeof node.value === "string" && !node.children) return node.value;
  return (node.children ?? []).map(plainText).join("");
}

function attr(node, name) {
  const found = node.attributes?.find(
    (a) => a.type === "mdxJsxAttribute" && a.name === name,
  );
  if (!found) return undefined;
  if (typeof found.value === "string") return found.value;
  if (found.value && typeof found.value === "object") return found.value;
  return true;
}

function attrString(node, name) {
  const value = attr(node, name);
  return typeof value === "string" ? value : undefined;
}

function absoluteUrl(url, siteUrl) {
  return url.startsWith("/") && !url.startsWith("//")
    ? new URL(url, `${siteUrl}/`).toString()
    : url;
}

function dedent(text, columns) {
  if (!columns) return text;
  const re = new RegExp(`^[ \\t]{1,${columns}}`);
  return text
    .split("\n")
    .map((line, i) => (i === 0 ? line : line.replace(re, "")))
    .join("\n");
}

function escapeCell(text) {
  return text.replace(/\|/g, "\\|").replace(/\s*\n\s*/g, " ");
}

function gfmTable(header, rows) {
  const line = (cells) => `| ${cells.join(" | ")} |`;
  return [line(header), line(header.map(() => "---")), ...rows.map(line)].join(
    "\n",
  );
}

function location(file, node) {
  const p = node.position?.start;
  return p ? `${file}:${p.line}:${p.column}` : file;
}

// ---- converter ---------------------------------------------------------------

async function resolveBindings(tree, imports, file) {
  // MermaidDiagram's `chart={identifier}` refers to a string exported from a
  // lib module; load just those modules so the diagram source is preserved.
  const bindings = new Map();
  const names = new Set();
  (function walk(node) {
    if (node.type?.startsWith("mdxJsx") && node.name === "MermaidDiagram") {
      const chart = attr(node, "chart");
      if (chart && typeof chart === "object") names.add(chart.value.trim());
    }
    node.children?.forEach(walk);
  })(tree);
  for (const name of names) {
    const info = imports.get(name);
    if (!info) {
      throw new MdxConversionError(
        `${file}: MermaidDiagram chart={${name}} is not an imported binding`,
      );
    }
    const target = info.source.startsWith("@/")
      ? path.join(ROOT, info.source.slice(2))
      : path.resolve(path.dirname(path.join(ROOT, file)), info.source);
    const mod = await import(
      pathToFileURL(path.extname(target) ? target : `${target}.js`).href
    );
    bindings.set(name, mod[info.imported]);
  }
  return bindings;
}

/**
 * @param {{ source: string, file: string, siteUrl: string }} input
 * @returns {Promise<{ markdown: string, title: string|null, description: string|null, h1: string|null, firstParagraph: string|null, warnings: string[] }>}
 */
export async function convertMdx({ source, file, siteUrl }) {
  let tree;
  try {
    tree = parser.parse(source);
  } catch (error) {
    throw new MdxConversionError(`${file}: cannot parse MDX: ${error.message}`);
  }
  const { imports, pageMeta } = readEsm(tree);
  const bindings = await resolveBindings(tree, imports, file);
  const warnings = [];

  const abs = (url) => absoluteUrl(url, siteUrl);

  // Render a node's source range with descendant rewrites applied.
  function splice(start, end, children) {
    let out = "";
    let pos = start;
    for (const child of children) {
      const rendered = renderNode(child);
      if (rendered === "" && FLOW_TYPES.has(child.type)) {
        // Drop removed flow nodes along with the blank line that preceded them.
        pos = child.position.end.offset;
        continue;
      }
      out += source.slice(pos, child.position.start.offset) + rendered;
      pos = child.position.end.offset;
    }
    return out + source.slice(pos, end);
  }

  function renderNode(node) {
    switch (node.type) {
      case "mdxjsEsm":
        return "";
      case "mdxFlowExpression":
      case "mdxTextExpression":
        return renderExpression(node);
      case "mdxJsxFlowElement":
      case "mdxJsxTextElement":
        return renderJsx(node);
      case "link":
      case "image":
      case "definition": {
        const raw = node.children
          ? splice(
              node.position.start.offset,
              node.position.end.offset,
              node.children,
            )
          : source.slice(node.position.start.offset, node.position.end.offset);
        const marker = node.type === "definition" ? "]: " : "](";
        const at = raw.indexOf(`${marker}${node.url}`);
        if (
          at === -1 ||
          !node.url.startsWith("/") ||
          node.url.startsWith("//")
        ) {
          return raw;
        }
        const from = at + marker.length;
        return (
          raw.slice(0, from) + abs(node.url) + raw.slice(from + node.url.length)
        );
      }
      default:
        if (node.children?.length) {
          return splice(
            node.position.start.offset,
            node.position.end.offset,
            node.children,
          );
        }
        return source.slice(
          node.position.start.offset,
          node.position.end.offset,
        );
    }
  }

  function renderExpression(node) {
    const value = node.value.trim();
    if (/^\/\*[\s\S]*\*\/$/.test(value) || value === "") return "";
    const literal = value.match(/^(["'])(.*)\1$/s);
    if (literal) return literal[2];
    throw new MdxConversionError(
      `${location(file, node)}: unsupported MDX expression {${value}} in page body`,
    );
  }

  // Children of a JSX element as Markdown. Flow children are separated by blank
  // lines and de-indented; text children are concatenated as written.
  function renderChildren(node) {
    if (node.type === "mdxJsxTextElement") {
      return splice(
        node.children[0]?.position?.start.offset ?? 0,
        node.children.at(-1)?.position?.end.offset ?? 0,
        node.children,
      );
    }
    return node.children
      .map((child) =>
        dedent(renderNode(child), child.position.start.column - 1).trim(),
      )
      .filter(Boolean)
      .join("\n\n");
  }

  function wrap(node, before, after) {
    const inner = renderChildren(node).trim();
    return inner ? `${before}${inner}${after}` : "";
  }

  function findDescendants(node, names, out = []) {
    for (const child of node.children ?? []) {
      if (child.type?.startsWith("mdxJsx") && names.includes(child.name)) {
        out.push(child);
      } else {
        findDescendants(child, names, out);
      }
    }
    return out;
  }

  function renderHtmlTable(node) {
    const rows = findDescendants(node, ["tr"]).map((tr) =>
      findDescendants(tr, ["th", "td"]).map((cell) => ({
        header: cell.name === "th",
        text: renderChildren(cell).trim(),
      })),
    );
    const headerRow = rows.find((r) => r.length && r.every((c) => c.header));
    const bodyRows = rows.filter((r) => r !== headerRow && r.length);
    if (!bodyRows.length && !headerRow) return "";
    const headers = headerRow?.map((c) => c.text);
    const simple = [headerRow, ...bodyRows]
      .filter(Boolean)
      .every((r) => r.every((c) => !c.text.includes("\n")));
    if (simple) {
      const head = headers ?? bodyRows[0].map(() => "");
      return gfmTable(
        head.map(escapeCell),
        bodyRows.map((r) => r.map((c) => escapeCell(c.text))),
      );
    }
    // Cells hold block content (code fences, lists): a Markdown table can't
    // express that, so emit each row as labelled blocks.
    return bodyRows
      .map((r) =>
        r
          .map((c, i) => {
            const label = headers?.[i];
            if (!label) return c.text;
            return c.text.includes("\n")
              ? `**${label}**\n\n${c.text}`
              : `**${label}:** ${c.text}`;
          })
          .join("\n\n"),
      )
      .join("\n\n");
  }

  function renderJsx(node) {
    const name = node.name;
    switch (name) {
      case "BlogPostHeader":
        return ""; // title/date/category are emitted from metadata instead
      case "InstallCommandTabs":
        return cliTabs(siteUrl)
          .map((t) => `**${t.label}**\n\n\`\`\`sh\n${t.code}\n\`\`\``)
          .join("\n\n");
      case "ProviderKeyTable":
        return gfmTable(
          ["Provider", "Key source"],
          providerKeys.map((p) => [`**${p.name}**`, `[${p.label}](${p.url})`]),
        );
      case "GatewayLogos":
        return `Supported gateways:\n\n${gateways.map((g) => `- ${g.name}`).join("\n")}`;
      case "MacDownloadButton":
        return `[Download for Apple silicon](${abs(MACOS_DOWNLOAD_URL)}) · [Download for Intel](${abs(MACOS_X64_DOWNLOAD_URL)})`;
      case "GithubActionsExample": {
        const exampleFile = attrString(node, "file");
        const source = readFileSync(
          path.join(ROOT, "examples/github-actions", exampleFile),
          "utf8",
        );
        const language = exampleFile.endsWith(".jq") ? "jq" : "yaml";
        return "```" + language + "\n" + source + "```";
      }
      case "MermaidDiagram": {
        const chart = attr(node, "chart");
        const text =
          typeof chart === "string"
            ? chart
            : bindings.get(chart?.value?.trim());
        if (typeof text !== "string") {
          throw new MdxConversionError(
            `${location(file, node)}: cannot resolve MermaidDiagram chart`,
          );
        }
        const label = attrString(node, "label");
        return `${label ? `_Diagram: ${label}_\n\n` : ""}\`\`\`mermaid\n${text.trim()}\n\`\`\``;
      }
      case "ContentTabs": {
        const labels = (() => {
          const value = attr(node, "labels");
          try {
            return value && typeof value === "object"
              ? JSON.parse(value.value)
              : null;
          } catch {
            return null;
          }
        })();
        if (!Array.isArray(labels) || labels.length !== node.children.length) {
          return renderChildren(node);
        }
        return node.children
          .map((child, i) => {
            // JSX children already normalize their own indentation. Dedenting
            // again here would strip meaningful spaces inside fenced YAML.
            const body = renderNode(child).trim();
            return body ? `**${labels[i]}**\n\n${body}` : "";
          })
          .filter(Boolean)
          .join("\n\n");
      }
      case "img": {
        const src = attrString(node, "src");
        return src ? `![${attrString(node, "alt") ?? ""}](${abs(src)})` : "";
      }
      case "video": {
        const src = attrString(node, "src");
        const label = attrString(node, "aria-label");
        return src
          ? `[${label ? `Video: ${label}` : "Video"}](${abs(src)})`
          : "";
      }
      case "a":
      case "Link": {
        const href = attrString(node, "href");
        const text = renderChildren(node).trim();
        return href && text ? `[${text}](${abs(href)})` : text;
      }
      case "table":
        return renderHtmlTable(node);
      case "code":
        return wrap(node, "`", "`");
      case "strong":
      case "b":
        return wrap(node, "**", "**");
      case "em":
      case "i":
        return wrap(node, "_", "_");
      case "summary":
        return wrap(node, "**", "**");
      case "li":
        return wrap(node, "- ", "");
      case "h2":
        return wrap(node, "## ", "");
      case "h3":
        return wrap(node, "### ", "");
      case "h4":
        return wrap(node, "#### ", "");
      case "br":
        return "\n";
      default:
        if (name && /^[A-Z]/.test(name) && name !== "ContentTabsProvider") {
          warnings.push(
            `${location(file, node)}: no text mapping for <${name}>; kept its children only`,
          );
        }
        return renderChildren(node);
    }
  }

  const markdown = splice(0, source.length, tree.children)
    .replace(/^\s+/, "")
    .trimEnd();

  // Metadata for index pages. Only top-level nodes count, so JSX text never
  // masquerades as the page heading or summary.
  const h1Node = tree.children.find(
    (n) => n.type === "heading" && n.depth === 1,
  );
  const paragraph = tree.children.find(
    (n) => n.type === "paragraph" && !/^_Released\b/.test(plainText(n).trim()),
  );

  return {
    markdown,
    title: pageMeta?.title ?? null,
    description: pageMeta?.description ?? null,
    h1: h1Node ? plainText(h1Node).trim() : null,
    firstParagraph: paragraph
      ? plainText(paragraph).replace(/\s+/g, " ").trim()
      : null,
    warnings,
  };
}
