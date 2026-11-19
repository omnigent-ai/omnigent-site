import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { getReleaseDescription, getReleases } from "../lib/releases";
import { releaseFeedXml, RELEASE_FEED_PATH } from "../lib/feed";
import { GET, dynamic } from "../app/releases/rss.xml/route";

const summary =
  'Adds scheduled tasks, a "Project" view, and better model routing.';
const body = `# v9.0.0\n\n_Released 2026-10-01_ · 2 min read · Omnigent maintainers\n\n${summary}\n\n## Improvements\n\nOther details.\n`;

function withDescription(description) {
  return `import { pageMeta } from "@/lib/og";\n\nexport const metadata = pageMeta("Omnigent v9.0.0", ${JSON.stringify(description)}, { path: "/releases/9.0.0" });\n\n${body}`;
}

test("release descriptions prefer explicit metadata, with JSON string escapes decoded", () => {
  const description =
    'A "quoted" highlight with a backslash \\ and an ampersand &.';
  expect(getReleaseDescription(withDescription(description), "9.0.0")).toBe(
    description,
  );
});

test("missing, empty and boilerplate metadata use the opening summary", () => {
  for (const source of [
    body,
    withDescription(""),
    withDescription(
      "What's new in Omnigent v9.0.0 — release highlights, improvements, and fixes.",
    ),
  ]) {
    expect(getReleaseDescription(source, "9.0.0")).toBe(summary);
  }
});

test("summary is plain text, keeping link labels, inline code and escaped punctuation", () => {
  const source = body.replace(
    summary,
    "Adds **tasks**, [routing](/docs), and `copy_on_write`\nwith escaped \\{paths\\} & better defaults.",
  );
  expect(getReleaseDescription(source, "9.0.0")).toBe(
    "Adds tasks, routing, and copy_on_write with escaped {paths} & better defaults.",
  );
});

test("missing summary falls back without using headings, code or footer prose", () => {
  for (const source of [
    "# v9.0.0\n\n## Bug fixes\n\nA fix.",
    withDescription(
      "What's new in Omnigent v9.0.0 — release highlights, improvements, and fixes.",
    ).replace(summary, ""),
    "# v9.0.0\n\n_Released 2026-10-01_\n\n## Bug fixes\n\nA fix.\n\nThanks to our community.",
    "# v9.0.0\n\n_Released 2026-10-01_\n\n```bash\nuv tool install omnigent\n```",
  ]) {
    expect(getReleaseDescription(source, "9.0.0")).toBe(
      "Release notes for Omnigent v9.0.0.",
    );
  }
});

test("every current release appears once, with its own date and a description", () => {
  const releases = getReleases();
  expect(releases.length).toBeGreaterThan(0);
  expect(releases.map(({ version }) => version)).not.toContain("rss.xml");
  const xml = releaseFeedXml(releases);
  expect(xml.match(/<item>/g)).toHaveLength(releases.length);
  expect(xml).toContain(
    `<atom:link href="https://omnigent.ai${RELEASE_FEED_PATH}" rel="self" type="application/rss+xml" />`,
  );
  for (const release of releases) {
    expect(release.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(Date.parse(release.date))).toBe(false);
    // A neutral fallback is valid; description quality must not gate a release.
    expect(release.description.trim().length).toBeGreaterThan(0);
    const item = xml
      .split("<item>")
      .find((item) =>
        item.includes(`<title>Omnigent v${release.version}</title>`),
      );
    expect(item).toBeDefined();
    expect(item).toContain(
      `<guid isPermaLink="true">https://omnigent.ai${release.href}</guid>`,
    );
    expect(item).toContain(
      `<pubDate>${new Date(`${release.date}T00:00:00Z`).toUTCString()}</pubDate>`,
    );
    expect(item).toContain("<description>");
  }
});

test("releases sort by publication date without mutating input or using build time", () => {
  const releases = [
    { version: "1.0.0", href: "/releases/1.0.0", date: "2026-10-01" },
    { version: "0.5.2", href: "/releases/0.5.2", date: "2026-10-03" },
    { version: "2.0.0", href: "/releases/2.0.0", date: null },
  ];
  const xml = releaseFeedXml(releases);
  expect(xml.indexOf("<title>Omnigent v0.5.2</title>")).toBeLessThan(
    xml.indexOf("<title>Omnigent v1.0.0</title>"),
  );
  expect(xml.indexOf("<title>Omnigent v1.0.0</title>")).toBeLessThan(
    xml.indexOf("<title>Omnigent v2.0.0</title>"),
  );
  expect(xml).toContain(
    "<lastBuildDate>Sat, 03 Oct 2026 00:00:00 GMT</lastBuildDate>",
  );
  expect(xml.match(/<pubDate>/g)).toHaveLength(2);
  expect(releases.map(({ version }) => version)).toEqual([
    "1.0.0",
    "0.5.2",
    "2.0.0",
  ]);
  expect(releaseFeedXml([])).not.toContain("lastBuildDate");
});

test("release feed escapes descriptions and gracefully omits missing dates", () => {
  const xml = releaseFeedXml([
    {
      version: "9.0.0",
      href: "/releases/9.0.0",
      description: 'Tom\'s "tasks" & <defaults>',
    },
  ]);
  expect(xml).toContain(
    "<description>Tom&apos;s &quot;tasks&quot; &amp; &lt;defaults&gt;</description>",
  );
  expect(xml).not.toContain("<pubDate>");
  expect(xml).not.toContain("<lastBuildDate>");
});

test("release route is static and responds with RSS content type", async () => {
  expect(dynamic).toBe("force-static");
  const response = GET();
  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toBe(
    "application/rss+xml; charset=utf-8",
  );
  expect(await response.text()).toBe(releaseFeedXml());
});

test("preview URL overrides cannot change release feed identity", () => {
  const run = spawnSync(
    process.execPath,
    [
      "-e",
      'import { releaseFeedXml } from "./lib/feed.js"; console.log(releaseFeedXml());',
    ],
    {
      cwd: process.cwd(),
      env: { ...process.env, NEXT_PUBLIC_SITE_URL: "https://preview.example" },
      encoding: "utf8",
    },
  );
  expect(run.status).toBe(0);
  expect(run.stdout).not.toContain("preview.example");
  expect(run.stdout).toContain("https://omnigent.ai/releases/rss.xml");
});

test("a release without a summary still generates metadata, RSS and LLM files", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "release-fallback-"));
  const script = path.resolve("scripts/gen-og-manifest.mjs");
  const feedModule = path.resolve("lib/feed.js");
  const llmsModule = path.resolve("scripts/generate-llms-files.mjs");
  const fallback = "Release notes for Omnigent v9.0.0.";
  try {
    mkdirSync(path.join(dir, "lib"));
    const folder = path.join(dir, "app/releases/9.0.0");
    mkdirSync(folder, { recursive: true });
    writeFileSync(
      path.join(folder, "page.mdx"),
      "# v9.0.0\n\n_Released 2026-10-01_\n\n## Bug fixes\n\nA fix.\n",
    );
    const generation = spawnSync("node", [script], {
      cwd: dir,
      encoding: "utf8",
    });
    expect(generation.status).toBe(0);
    const manifest = JSON.parse(
      readFileSync(path.join(dir, "lib/og-manifest.json"), "utf8"),
    );
    expect(manifest["/releases/9.0.0"].description).toBe(fallback);
    const output = spawnSync(
      process.execPath,
      [
        "-e",
        `import { releaseFeedXml } from ${JSON.stringify(feedModule)};
         import { buildLlmsFiles } from ${JSON.stringify(llmsModule)};
         const { llmsTxt, llmsFullTxt } = await buildLlmsFiles();
         console.log(JSON.stringify({ xml: releaseFeedXml(), llmsTxt, llmsFullTxt }));`,
      ],
      { cwd: dir, encoding: "utf8" },
    );
    expect(output.status).toBe(0);
    const { xml, llmsTxt, llmsFullTxt } = JSON.parse(output.stdout);
    expect(xml).toContain(`<description>${fallback}</description>`);
    expect(xml).toContain("https://omnigent.ai/releases/9.0.0");
    expect(llmsTxt).toContain(fallback);
    expect(llmsFullTxt).toContain("## https://omnigent.ai/releases/9.0.0");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("build metadata injection uses the same summary and preserves explicit descriptions", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "release-metadata-"));
  const script = path.resolve("scripts/gen-og-manifest.mjs");
  try {
    mkdirSync(path.join(dir, "lib"));
    for (const [version, source] of [
      ["9.0.0", body],
      ["9.0.1", withDescription("A custom release description.")],
    ]) {
      const folder = path.join(dir, "app/releases", version);
      mkdirSync(folder, { recursive: true });
      writeFileSync(path.join(folder, "page.mdx"), source);
    }
    const run = spawnSync("node", [script], { cwd: dir, encoding: "utf8" });
    expect(run.status).toBe(0);
    const manifest = JSON.parse(
      readFileSync(path.join(dir, "lib/og-manifest.json"), "utf8"),
    );
    expect(manifest["/releases/9.0.0"].description).toBe(summary);
    expect(manifest["/releases/9.0.1"].description).toBe(
      "A custom release description.",
    );
    const generated = readFileSync(
      path.join(dir, "app/releases/9.0.0/page.mdx"),
      "utf8",
    );
    expect(generated).toContain(JSON.stringify(summary));
    expect(getReleaseDescription(generated, "9.0.0")).toBe(summary);
    const rerun = spawnSync("node", [script], { cwd: dir, encoding: "utf8" });
    expect(rerun.status).toBe(0);
    expect(
      readFileSync(path.join(dir, "app/releases/9.0.0/page.mdx"), "utf8"),
    ).toBe(generated);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
