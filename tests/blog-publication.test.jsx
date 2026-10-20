import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import fs from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import BlogIndex, { metadata } from "../app/blog/page";
import FeatureNotesIndex, {
  metadata as notesMetadata,
} from "../app/feature-notes/page";
import BlogPostHeader from "../components/BlogPostHeader";
import { getBlogPosts, getReadingMinutes } from "../lib/blog";
import {
  ARTICLE_SLUGS,
  FEATURE_NOTE_SLUGS,
  getBlogFormat,
} from "../lib/blog-formats";
import { blogPosting } from "../lib/structured-data";
import { getAuthorProfile } from "../lib/authors";

const kinds = ["article", "feature-note"];
const renderIndex = (kind = "") =>
  renderToStaticMarkup(
    kind === "feature-note" ? <FeatureNotesIndex /> : <BlogIndex />,
  );

function postLinks(html) {
  // Teaser cards are intentional cross-links, not membership of the primary index.
  html = html.split('<section class="publication-preview"')[0];
  return [...html.matchAll(/href="(\/blog\/[^"#?]+)"/g)]
    .map((match) => match[1])
    .filter((href) => href !== "/blog/rss.xml");
}

function diskPostSlugs() {
  const blogDir = path.join(process.cwd(), "app", "blog");
  return fs
    .readdirSync(blogDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        fs.existsSync(path.join(blogDir, entry.name, "page.mdx")),
    )
    .map((entry) => entry.name);
}

function expectExactlyOnce(slugs, html) {
  const links = postLinks(html);
  expect(links.toSorted()).toEqual(slugs.map((s) => `/blog/${s}`).toSorted());
  expect(new Set(links).size).toBe(links.length);
}

test("two primary indexes partition every on-disk post exactly once", () => {
  const articleHtml = renderIndex();
  const noteHtml = renderIndex("feature-note");
  const links = [...postLinks(articleHtml), ...postLinks(noteHtml)];
  expect(links.toSorted()).toEqual(
    diskPostSlugs()
      .map((s) => `/blog/${s}`)
      .toSorted(),
  );
  expect(new Set(links).size).toBe(links.length);
  for (const kind of kinds) {
    expectExactlyOnce(
      getBlogPosts()
        .filter((p) => getBlogFormat(p.slug).kind === kind)
        .map((p) => p.slug),
      renderIndex(kind),
    );
  }
});

test("production classes, artwork and three latest note previews without explanatory furniture", () => {
  const html = renderIndex();
  expect(html).toContain('class="blog-index"');
  expect(html).toContain('class="blog-featured"');
  expect(html).toContain('class="blog-grid"');
  expect(html).toContain(
    "Product updates and feature deep-dives from the Omnigent team.",
  );
  const teaser = html.split('<section class="publication-preview"')[1];
  const notes = getBlogPosts()
    .filter((p) => getBlogFormat(p.slug).kind === "feature-note")
    .slice(0, 3);
  expectExactlyOnce(
    notes.map((p) => p.slug),
    teaser,
  );
  for (const post of notes) expect(teaser).toContain(`src="${post.heroArt}"`);
  expect(html).toContain('<h2 id="feature-notes-heading">Feature notes</h2>');
  expect(html).toContain("See all feature notes →");
  for (const text of [
    "In focus",
    "The latest",
    "Featured article, then newest first",
    "Articles: ideas",
    "Article</span>",
    "Feature note</span>",
    "sf-",
    "↗",
    "?view=",
    ">All<",
  ])
    expect(html).not.toContain(text);
  expect(renderIndex("feature-note")).not.toContain(
    'class="publication-preview"',
  );
});

test("only titles are links in featured and grid cards on both indexes", () => {
  for (const kind of kinds) {
    const html = renderIndex(kind);
    const cards = [
      ...html.matchAll(
        /<article class="blog-(?:featured|card)">([\s\S]*?)<\/article>/g,
      ),
    ];
    expect(cards.length).toBeGreaterThan(0);
    for (const [, card] of cards) {
      const links = [...card.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/g)];
      expect(links).toHaveLength(1);
      expect(card).toMatch(
        /<h[23]><a class="blog-title-link" href="\/blog\/[^"<>]+">[^<>]+<\/a><\/h[23]>/,
      );
      expect(links[0][1]).not.toMatch(/<(p|img|span|a|div)\b/);
      expect(card).toContain('class="blog-card-meta"');
      expect(card).toContain("<p>");
      expect(card).toContain('class="blog-thumb"');
    }
  }
});

test("plain feature note introductions describe the teaser and archive without pagination", () => {
  expect(renderIndex()).toContain(
    '<h2 id="feature-notes-heading">Feature notes</h2><p>Short posts spotlighting individual Omnigent features.</p><ul class="blog-grid">',
  );
  expect(renderIndex("feature-note")).toContain(
    "<h1>Feature notes</h1><p>Short posts spotlighting individual Omnigent features.</p>",
  );
  expect(renderIndex("feature-note")).not.toContain(
    "Most recent feature notes",
  );
  for (const kind of kinds)
    expect(renderIndex(kind)).not.toMatch(/pagination|[?&]page=/i);
});

test("M2 shelf is the only Blog h2; featured Article is h3, notes archive unchanged", () => {
  const html = renderIndex();
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(
    ([, text]) => text,
  );
  expect(h2s).toEqual(["Feature notes"]);
  const featured = html.match(
    /<article class="blog-featured">([\s\S]*?)<\/article>/,
  )[1];
  expect(featured).toContain('<h3><a class="blog-title-link"');
  expect(html).not.toContain("Most recent feature notes");
  expect(html).not.toContain("Focused feature walkthroughs");
  const notesFeatured = renderIndex("feature-note").match(
    /<article class="blog-featured">([\s\S]*?)<\/article>/,
  )[1];
  expect(notesFeatured).toContain('<h2><a class="blog-title-link"');
});

test("separate destinations are canonical and obsolete filters/views do not change Blog", () => {
  expect(renderToStaticMarkup(<BlogIndex />)).toBe(renderIndex());
  expect(
    renderToStaticMarkup(
      <BlogIndex searchParams={{ view: "timeline", kind: "feature-note" }} />,
    ),
  ).toBe(renderIndex());
  expect(renderIndex("feature-note")).toMatch(
    /<a(?=[^>]*href="\/feature-notes")(?=[^>]*aria-current="page")[^>]*>Feature notes<\/a>/,
  );
  expect(renderIndex()).toContain('href="/feature-notes"');
  expect(metadata.alternates.canonical).toBe("https://omnigent.ai/blog");
  expect(notesMetadata.alternates.canonical).toBe(
    "https://omnigent.ai/feature-notes",
  );
  expect(metadata.description).toBe(
    "Product updates and feature deep-dives from the Omnigent team.",
  );
});

test("post headers preserve category, bylines and JSON-LD without format badges", () => {
  for (const post of getBlogPosts()) {
    const html = renderToStaticMarkup(<BlogPostHeader slug={post.slug} />);
    expect(html).not.toContain("blog-post-section");
    expect(html).not.toContain("blog-post-format");
    expect(html).toContain(`class="blog-card-cat">${post.category}</span>`);
    expect(html).toContain(post.author);
    expect(html).toContain(`${getReadingMinutes(post.slug)} min read`);
    const json = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    )[1];
    expect(JSON.parse(json)).toEqual(
      blogPosting({ ...post, authorProfile: getAuthorProfile(post.author) }),
    );
  }
});

test("on-disk literal meta.format wins over legacy slugs in the feed and headers; extraction never evaluates MDX", () => {
  const root = fs.mkdtempSync(path.join(tmpdir(), "publication-format-meta-"));
  const samples = [
    ["new-explicit-article", 'format: "article",', "article"],
    [ARTICLE_SLUGS[0], 'format: "feature-note",', "feature-note"],
    [ARTICLE_SLUGS[1], 'format: "invalid",', "article"],
    [
      ARTICLE_SLUGS[2],
      'format: (() => { globalThis.formatCodeRan = true; return "feature-note"; })(),',
      "article",
    ],
    [ARTICLE_SLUGS[3], "", "article"],
    ["new-explicit-note", "format: 'feature-note',", "feature-note"],
    ["quoted-key", "'format': 'article',", "article"],
    ["invalid-reader-format", 'format: "Article",', "feature-note"],
    ["missing-format", "", "feature-note"],
    ["nested-example", 'nested: { format: "article" },', "feature-note"],
    ["comment-example", '/* format: "article", */', "feature-note"],
    ["string-example", 'example: "format: article",', "feature-note"],
    ["computed-example", '["format"]: "article",', "feature-note"],
    ["spread-example", '...{ format: "article" },', "feature-note"],
    [
      "duplicate-example",
      'format: "article", format: "feature-note",',
      "feature-note",
    ],
    [
      "fenced-example",
      "",
      "feature-note",
      '\n\n```js\nexport const meta = {format: "article"};\n```',
    ],
    [
      "prose-example",
      "",
      "feature-note",
      '\n\nHere is `export const meta = {format: "article"}`.',
    ],
    [
      "other-export",
      "",
      "feature-note",
      '\n\nexport const metadata = { format: "article" };',
    ],
  ];
  try {
    const expected = new Map();
    for (const slug of diskPostSlugs()) {
      const dir = path.join(root, "app", "blog", slug);
      fs.mkdirSync(dir, { recursive: true });
      fs.copyFileSync(
        path.join(process.cwd(), "app", "blog", slug, "page.mdx"),
        path.join(dir, "page.mdx"),
      );
      expected.set(slug, getBlogFormat(slug).kind);
    }
    for (const [slug, field, kind, body = ""] of samples) {
      const dir = path.join(root, "app", "blog", slug);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(
        path.join(dir, "page.mdx"),
        `export const meta = {
        title: "Fixture ${slug}", date: "2026-10-19", author: "omnigent",
        category: "Test", heroArt: "/fixture.svg", ${field}
      };${body}`,
      );
      expected.set(slug, kind);
    }
    const result = Bun.spawnSync(
      [
        process.execPath,
        "--eval",
        `
      import fs from "node:fs";
      import { createElement as h } from ${JSON.stringify(import.meta.resolve("react"))};
      import { renderToStaticMarkup as render } from ${JSON.stringify(import.meta.resolve("react-dom/server"))};
      import Blog from ${JSON.stringify(new URL("../app/blog/page.js", import.meta.url).href)};
      import Notes from ${JSON.stringify(new URL("../app/feature-notes/page.js", import.meta.url).href)};
      import Header from ${JSON.stringify(new URL("../components/BlogPostHeader.js", import.meta.url).href)};
      import { getBlogFormat } from ${JSON.stringify(new URL("../lib/blog-formats.js", import.meta.url).href)};
      const states = ${JSON.stringify(kinds)}.map(kind => ({kind,html:render(h(kind === "feature-note" ? Notes : Blog))}));
      const formats = ${JSON.stringify([...expected.keys()])}.map(slug => [slug,getBlogFormat(slug).kind]);
      const headers = ["new-explicit-article",${JSON.stringify(ARTICLE_SLUGS[0])}].map(slug => ({slug,html:render(h(Header,{slug}))}));
      // Content-aware cache must notice edits, including changes to an existing slug.
      const file = "app/blog/new-explicit-article/page.mdx";
      fs.writeFileSync(file, fs.readFileSync(file,"utf8").replace('format: "article"','format: "feature-note"'));
      const afterEdit = getBlogFormat("new-explicit-article").kind;
      console.log(JSON.stringify({states,formats,headers,afterEdit,codeRan:!!globalThis.formatCodeRan}));
    `,
      ],
      { cwd: root },
    );
    if (result.exitCode !== 0) throw new Error(result.stderr.toString());
    const output = JSON.parse(result.stdout.toString());
    expect(new Map(output.formats)).toEqual(expected);
    expect(output.codeRan).toBe(false);
    expect(output.afterEdit).toBe("feature-note");
    for (const { kind, html } of output.states) {
      const slugs = [...expected]
        .filter(
          ([, value]) => value === (kind === "feature-note" ? kind : "article"),
        )
        .map(([slug]) => slug);
      expectExactlyOnce(slugs, html);
      for (const [slug, entryKind] of [
        ["new-explicit-article", "article"],
        [ARTICLE_SLUGS[0], "feature-note"],
      ]) {
        if ((kind === "feature-note" ? kind : "article") !== entryKind)
          continue;
        const tag = html.match(
          new RegExp(`<a(?=[^>]*href="/blog/${slug}")[^>]*>`),
        )?.[0];
        expect(tag).toContain('class="blog-title-link"');
      }
    }
    for (const { slug, html } of output.headers) {
      const article = expected.get(slug) === "article";
      expect(html).not.toContain('class="blog-post-format"');
      expect(html).not.toContain("blog-post-section");
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("migration slugs and unknown defaults retain the classification policy", () => {
  for (const slug of ARTICLE_SLUGS)
    expect(getBlogFormat(slug).kind).toBe("article");
  for (const slug of [
    ...FEATURE_NOTE_SLUGS,
    "unknown",
    "",
    "toString",
    "constructor",
    "future-article",
    "github-pr-review-in-session",
  ])
    expect(getBlogFormat(slug).kind).toBe("feature-note");
});
