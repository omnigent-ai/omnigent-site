import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import Footer, { FOOTER_PROFILE_LINKS } from "../components/Footer";
import { siteGraph, softwareApplication } from "../lib/structured-data";

const expected = [
  ["https://x.com/omnigent_ai", "Omnigent on X"],
  ["https://www.linkedin.com/company/omnigent-ai/", "Omnigent on LinkedIn"],
  ["https://www.youtube.com/@omnigent_ai", "Omnigent on YouTube"],
  ["https://pypi.org/project/omnigent/", "Omnigent on PyPI"],
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
  const software = softwareApplication({ version: "0.17.0" });
  const footerHrefs = FOOTER_PROFILE_LINKS.map(({ href }) => href);
  expect(footerHrefs).toEqual(expected.map(([href]) => href));
  // X, LinkedIn and YouTube are Organization profiles; PyPI lists the software.
  for (const href of footerHrefs.slice(0, 3)) {
    expect(org.sameAs).toContain(href);
  }
  expect(software.sameAs).toContain(footerHrefs[3]);
});
