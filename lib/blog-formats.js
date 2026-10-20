import fs from "node:fs";
import path from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";

// A literal meta.format wins; named Articles are a migration fallback.
// This format policy makes no authorship or AI-assistance claim.
export const ARTICLE_SLUGS = Object.freeze([
  "declarative-agent-configuration",
  "meta-harness-missing-layer",
  "omnigent-policies",
  "stop-surprise-llm-bills",
]);
export const FEATURE_NOTE_SLUGS = Object.freeze([
  "any-acp-agent-with-tools-and-governance",
  "first-class-projects-with-defaults",
  "nimble-web-research-extract-builtins",
  "queue-and-steer-messages-while-agents-work",
]);

const FORMATS = Object.freeze({
  article: Object.freeze({
    kind: "article",
    label: "Article",
    archiveLabel: "Articles",
    sectionLabel: "Blog",
    sectionHref: "/blog",
  }),
  "feature-note": Object.freeze({
    kind: "feature-note",
    label: "Feature note",
    archiveLabel: "Feature notes",
    sectionLabel: "Blog / Feature notes",
    sectionHref: "/feature-notes",
  }),
});
const KIND_BY_SLUG = new Map([
  ...ARTICLE_SLUGS.map((slug) => [slug, "article"]),
  ...FEATURE_NOTE_SLUGS.map((slug) => [slug, "feature-note"]),
]);

const BLOG_DIR = path.join(process.cwd(), "app", "blog");
const parser = unified().use(remarkParse).use(remarkMdx);
const formatCache = new Map();

function readMetaFormat(slug) {
  // Only post slugs, never paths supplied by a caller.
  if (typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    return;
  try {
    const source = fs.readFileSync(
      path.join(BLOG_DIR, slug, "page.mdx"),
      "utf8",
    );
    const cached = formatCache.get(slug);
    if (cached?.source === source) return cached.format;
    let format;
    // Parse MDX/ESM without importing or evaluating the post. Restrict lookup to
    // the top-level exported const meta object, not examples, comments, nested
    // properties, metadata/pageMeta, or other exports. Existing parser deps only.
    for (const node of parser.parse(source).children) {
      if (node.type !== "mdxjsEsm") continue;
      for (const statement of node.data.estree.body) {
        if (
          statement.type !== "ExportNamedDeclaration" ||
          statement.declaration?.kind !== "const"
        )
          continue;
        const meta = statement.declaration.declarations.find(
          (declaration) =>
            declaration.id.type === "Identifier" &&
            declaration.id.name === "meta",
        );
        if (meta?.init?.type !== "ObjectExpression") continue;
        const properties = meta.init.properties;
        // Spreads/computed keys could replace format; do not try to execute them.
        if (
          properties.some(
            (property) => property.type !== "Property" || property.computed,
          )
        )
          continue;
        const property = properties.findLast(
          (property) => (property.key.name ?? property.key.value) === "format",
        );
        if (property?.kind === "init" && property.value.type === "Literal")
          format = property.value.value;
      }
    }
    formatCache.set(slug, { source, format });
    return format;
  } catch {
    // Missing/unreadable/unsupported metadata retains the migration/default policy.
  }
}

export function getBlogFormat(slug) {
  const explicit = readMetaFormat(slug);
  const kind =
    explicit === "article" || explicit === "feature-note"
      ? explicit
      : KIND_BY_SLUG.get(slug) || "feature-note";
  return FORMATS[kind];
}
