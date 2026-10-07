import { expect, mock, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

// Nav/Footer need a mounted App Router; they carry no page headings we test.
mock.module("@/components/Nav", () => ({ default: () => null }));
mock.module("@/components/Footer", () => ({ default: () => null }));

const { default: Home } = await import("../app/page.js");
const { default: Faq } = await import("../app/faq/page.js");

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
  for (const [, alt] of h1.matchAll(/<img\b[^>]*\balt="([^"]*)"/g)) {
    expect(alt).toBe("");
  }
});

test("FAQ has one H1 and its questions are h2s with no skipped levels", () => {
  const hs = headings(renderToStaticMarkup(<Faq />));
  expect(hs.filter((h) => h.level === 1).map((h) => h.text)).toEqual(["FAQ"]);
  expect(hs.filter((h) => h.level === 2).length).toBeGreaterThan(0);
  expect(hs.some((h) => h.level === 3)).toBe(false);
  expect(skippedLevels(hs)).toEqual([]);
});
