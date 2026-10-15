import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { buildLlmsFiles } from "../scripts/generate-llms-files.mjs";
import { discoverPages } from "../lib/routes";
import { getBlogPosts } from "../lib/blog";
import { getReleases } from "../lib/releases";
import { productionSiteUrl } from "../lib/site";

const { llmsTxt, llmsFullTxt, pages, warnings } = await buildLlmsFiles();

// Everything outside fenced code blocks (``` or longer fences).
function proseOnly(text) {
  const out = [];
  let fence = null;
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*(`{3,})/);
    if (fence) {
      if (match && match[1].length >= fence.length) fence = null;
    } else if (match) {
      fence = match[1];
    } else {
      out.push(line);
    }
  }
  return out.join("\n");
}

const docRoutes = discoverPages()
  .filter(
    ({ route, file }) =>
      file.endsWith(".mdx") &&
      (route.startsWith("/quickstart/") || route.startsWith("/docs/")),
  )
  .map(({ route }) => route);

test("every quickstart and docs page is discovered without a hand-kept list", () => {
  expect(docRoutes.length).toBeGreaterThan(40);
  for (const route of docRoutes) {
    expect(llmsTxt).toContain(`](${productionSiteUrl}${route})`);
    expect(llmsFullTxt).toContain(`\n## ${productionSiteUrl}${route}\n`);
  }
});

test("blog posts and releases are in llms-full.txt, with releases summarized in llms.txt", () => {
  for (const post of getBlogPosts()) {
    expect(llmsTxt).toContain(`](${productionSiteUrl}${post.href})`);
    expect(llmsFullTxt).toContain(`\n## ${productionSiteUrl}${post.href}\n`);
  }
  for (const release of getReleases()) {
    expect(llmsTxt).toContain(`](${productionSiteUrl}${release.href})`);
    expect(llmsFullTxt).toContain(`\n## ${productionSiteUrl}${release.href}\n`);
  }
  expect(pages.length).toBe(
    docRoutes.length + getBlogPosts().length + getReleases().length,
  );
});

test("release summaries use the shared descriptions, including acceptable fallbacks", () => {
  for (const release of getReleases()) {
    const page = pages.find((page) => page.href === release.href);
    expect(page.description).toBe(release.description);
  }
  for (const release of getReleases().slice(0, 5)) {
    const line = llmsTxt
      .split("\n")
      .find((line) => line.includes(`](${productionSiteUrl}${release.href})`));
    expect(line).toContain(release.description.slice(0, 60));
  }
});

test("llms.txt stays short while llms-full.txt carries the full text", () => {
  expect(llmsTxt.length).toBeLessThan(20_000);
  expect(llmsFullTxt.length).toBeGreaterThan(llmsTxt.length * 10);
});

test("current content converts with no unmapped components", () => {
  expect(warnings).toEqual([]);
});

test("code keeps <placeholder> text intact", () => {
  expect(llmsFullTxt).toContain('omni login "<server-url>"');
  expect(llmsFullTxt).toContain('"client_id=<client-id>"');
  // Inline code too, not only fences.
  const source = readFileSync("app/docs/programmatic/page.mdx", "utf8");
  for (const placeholder of ["<server-url>", "<username>", "<host-name>"]) {
    expect(source).toContain(placeholder);
    expect(llmsFullTxt).toContain(placeholder);
  }
});

test("no import/export lines, JSX comments, or JSX tags leak outside code", () => {
  const prose = proseOnly(llmsFullTxt);
  // MDX statements, not prose that happens to wrap onto "import path:".
  expect(prose).not.toMatch(/^import\s+[\w{*"'].*(\sfrom\s|["'];?$)/m);
  expect(prose).not.toMatch(/^export\s+(const|default|function|let|var|\{)/m);
  expect(prose).not.toContain("{/*");
  expect(prose).not.toContain("*/}");
  expect(prose).not.toMatch(/\bpageMeta\(/);
  expect(prose).not.toMatch(/\bexport const meta\b/);
  // Inline code may legitimately contain placeholders like `<NAME>`.
  const withoutInlineCode = prose.replace(/`[^`\n]*`/g, "");
  expect(withoutInlineCode).not.toMatch(
    /<\/?(div|span|table|thead|tbody|tr|td|th|details|summary|figure|video|img|[A-Z][A-Za-z]+)[\s>/]/,
  );
  expect(prose).not.toContain("style={{");
  expect(prose).not.toContain("className=");
});

test("blog posts get a heading and no export const meta block", () => {
  const entry = llmsFullTxt
    .split("\n---\n")
    .find((section) =>
      section.includes(`## ${productionSiteUrl}/blog/omnigent-policies\n`),
    );
  expect(entry).toBeDefined();
  expect(entry).toContain(
    "# Allow, ask, deny: contextual policies in Omnigent",
  );
  expect(entry).not.toContain("heroArt");
});

test("component data is expanded from source rather than dropped", () => {
  expect(llmsFullTxt).toContain(
    "curl -fsSL https://omnigent.ai/install.sh | sh",
  );
  expect(llmsFullTxt).toContain("| Provider | Key source |");
  expect(llmsFullTxt).toContain("```mermaid\nsequenceDiagram");
});

test("output is identical across two runs, including separate processes", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "llms-"));
  const probe = `
    import { writeLlmsFiles } from "./scripts/generate-llms-files.mjs";
    await writeLlmsFiles(${JSON.stringify(dir)});
  `;
  const result = spawnSync(process.execPath, ["--eval", probe], {
    cwd: new URL("../", import.meta.url),
    encoding: "utf8",
  });
  expect(result.status, result.stderr).toBe(0);
  expect(readFileSync(path.join(dir, "llms.txt"), "utf8")).toBe(llmsTxt);
  expect(readFileSync(path.join(dir, "llms-full.txt"), "utf8")).toBe(
    llmsFullTxt,
  );
});

test("every link is absolute and uses the production site URL", () => {
  const prose = proseOnly(llmsTxt) + "\n" + proseOnly(llmsFullTxt);
  // Markdown links/images with a root-relative or site-relative target.
  expect(prose).not.toMatch(/\]\((?!https?:|#|mailto:)[^)\s]*\)/);
  expect(prose).not.toMatch(/\]:\s+\/(?!\/)/);
  expect(llmsTxt).toContain(`(${productionSiteUrl}/llms-full.txt)`);
  expect(llmsTxt).toContain(`(${productionSiteUrl}/sitemap.xml)`);
  expect(llmsFullTxt).toContain(`Source: ${productionSiteUrl}`);
  for (const url of prose.match(
    /https?:\/\/[^\s)>\]]*omnigent\.ai[^\s)>\]]*/g,
  ) ?? []) {
    expect(url.startsWith(productionSiteUrl)).toBe(true);
  }
});
