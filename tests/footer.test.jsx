import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import Footer, { FOOTER_PROFILE_LINKS } from "../components/Footer";
import { siteGraph } from "../lib/structured-data";

const expected = [
  ["https://x.com/omnigent_ai", "Omnigent on X"],
  ["https://www.linkedin.com/company/omnigent-ai/", "Omnigent on LinkedIn"],
  ["https://www.youtube.com/@omnigent_ai", "Omnigent on YouTube"],
];

test("footer renders the official profile links with accessible names", () => {
  const html = renderToStaticMarkup(<Footer />);
  for (const [href, label] of expected) {
    const link = new RegExp(
      `<a href="${href.replace(/[.?/]/g, "\\$&")}" target="_blank" rel="noreferrer" aria-label="${label}" title="${label}"><svg[^>]*aria-hidden="true"`,
    );
    expect(html).toMatch(link);
  }
});

test("footer profile links match the JSON-LD identity links", () => {
  const org = siteGraph()["@graph"].find(
    (node) => node["@type"] === "Organization",
  );
  const footerHrefs = FOOTER_PROFILE_LINKS.map(({ href }) => href);
  expect(footerHrefs).toEqual(expected.map(([href]) => href));
  for (const href of footerHrefs) {
    expect(org.sameAs).toContain(href);
  }
});
