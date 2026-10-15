import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";

// Fresh processes prevent module caching from hiding environment differences.
const probe = `
  import { readFileSync } from "node:fs";
  import { pageMeta } from "./lib/og.js";
  import { productionSiteUrl, siteUrl } from "./lib/site.js";
  const pages = {};
  for (const file of ["app/page.js", "app/blog/page.js", "app/reference/page.js", "app/blog/omnigent-policies/page.mdx"]) {
    const source = readFileSync(file, "utf8");
    const match = source.match(/export const metadata = (\\{[\\s\\S]*?\\n\\});/);
    if (!match) throw new Error("Missing metadata in " + file);
    pages[file] = new Function("productionSiteUrl", "pageMeta", "return (" + match[1] + ")")(productionSiteUrl, pageMeta);
  }
  console.log(JSON.stringify({
    siteUrl,
    content: pageMeta("FAQ", "Answers", { path: "/faq" }),
    noPath: pageMeta("No route", "No route"),
    pages
  }));
`;

for (const override of [
  undefined,
  "https://preview.example",
  "https://tunnel.example",
]) {
  test(`canonicals stay on production with site URL ${override ?? "unset"}`, () => {
    const env = { ...process.env };
    delete env.NEXT_PUBLIC_SITE_URL;
    if (override) env.NEXT_PUBLIC_SITE_URL = override;
    const result = spawnSync(process.execPath, ["--eval", probe], {
      cwd: new URL("../", import.meta.url),
      env,
      encoding: "utf8",
    });
    expect(result.status, result.stderr).toBe(0);
    const { siteUrl, content, noPath, pages } = JSON.parse(result.stdout);
    const socialBase = override ?? "https://omnigent.ai";
    expect(siteUrl).toBe(socialBase);
    expect(content.alternates.canonical).toBe("https://omnigent.ai/faq");
    expect(content.openGraph.url).toBe(`${socialBase}/faq`);
    expect(content.openGraph.images[0].url).toBe(
      `${socialBase}/og?path=%2Ffaq&v=1`,
    );
    expect(content.twitter.images[0]).toBe(content.openGraph.images[0].url);
    expect(noPath.alternates).toBeUndefined();
    for (const [file, path] of Object.entries({
      "app/page.js": "/",
      "app/blog/page.js": "/blog",
      "app/reference/page.js": "/reference",
      "app/blog/omnigent-policies/page.mdx": "/blog/omnigent-policies",
    })) {
      expect(pages[file].alternates.canonical).toBe(
        `https://omnigent.ai${path}`,
      );
    }
  });
}
