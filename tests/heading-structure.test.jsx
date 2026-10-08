import { expect, mock, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";

// Nav/Footer need a mounted App Router; they carry no page headings we test.
mock.module("@/components/Nav", () => ({ default: () => null }));
mock.module("@/components/Footer", () => ({ default: () => null }));

const { default: Home } = await import("../app/page.js");
const { default: Faq } = await import("../app/faq/page.js");
const { demotedHeadings } = await import("../lib/release-headings.js");

const headings = (html) =>
  [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map(([, l, t]) => ({
    level: Number(l),
    text: t.replace(/<[^>]+>/g, "").trim(),
  }));

const skippedLevels = (hs) =>
  hs.filter((h, i) => i > 0 && h.level > hs[i - 1].level + 1);

test("homepage has one H1 with real text and decorative logo images", () => {
  const html = renderToStaticMarkup(<Home />);
  const h1s = headings(html).filter((h) => h.level === 1);
  expect(h1s).toEqual([
    { level: 1, text: "Omnigent: a meta-harness for AI agents" },
  ]);
  const h1 = html.match(/<h1\b[\s\S]*?<\/h1>/)[0];
  const imgs = [...h1.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
  expect(imgs.length).toBe(2);
  for (const img of imgs) expect(img).toMatch(/\balt=""/);
  expect(skippedLevels(headings(html))).toEqual([]);
});

test("FAQ has one H1 and its questions are h2s with no skipped levels", () => {
  const hs = headings(renderToStaticMarkup(<Faq />));
  expect(hs.filter((h) => h.level === 1).map((h) => h.text)).toEqual(["FAQ"]);
  expect(hs.filter((h) => h.level === 2).length).toBeGreaterThan(0);
  expect(hs.some((h) => h.level === 3)).toBe(false);
  expect(skippedLevels(hs)).toEqual([]);
});

test("release feed demotes headings two levels and merges classes", () => {
  const { h1, h2, h3, h4, h5, h6 } = demotedHeadings;
  const html = renderToStaticMarkup(
    <>
      {h1({ id: "v1", children: "v1" })}
      {h2({ className: "extra", children: "a" })}
      {h3({ children: "b" })}
      {h4({ children: "c" })}
      {h5({ children: "d" })}
      {h6({ children: "e" })}
    </>,
  );
  expect(headings(html).map((h) => h.level)).toEqual([3, 4, 5, 6, 6, 6]);
  expect(html).toContain('<h3 id="v1" class="release-heading release-title">');
  expect(html).toContain('<h4 class="release-heading release-section extra">');
  expect(html).toContain("<h6>c</h6>");
});

// The feed shifts every post by a fixed two levels, so a post that skips a
// level in its own source (e.g. `#` then `###`) would skip in the feed too.
test("release posts do not skip heading levels in their source", () => {
  const dir = "app/releases";
  const versions = readdirSync(dir).filter((v) => /^\d+\.\d+\.\d+$/.test(v));
  expect(versions.length).toBeGreaterThan(0);
  for (const version of versions) {
    const src = readFileSync(`${dir}/${version}/page.mdx`, "utf8").replace(
      /^```[\s\S]*?^```/gm,
      "",
    );
    const hs = [...src.matchAll(/^(#{1,6}) /gm)].map(([, h]) => ({
      level: h.length,
    }));
    expect({ version, skips: skippedLevels(hs) }).toEqual({
      version,
      skips: [],
    });
  }
});
