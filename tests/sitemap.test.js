import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import nextConfig from "../next.config.mjs";
import { getBlogPosts } from "../lib/blog";
import { getReleases } from "../lib/releases";

// Fresh processes prevent module caching from hiding environment differences.
const probe = `
  import sitemap from "./app/sitemap.js";
  console.log(JSON.stringify(sitemap()));
`;

const redirectSources = (await nextConfig.redirects()).map((r) => r.source);

for (const override of [
  undefined,
  "https://preview.example",
  "https://tunnel.example",
]) {
  test(`sitemap lists production URLs with site URL ${override ?? "unset"}`, () => {
    const env = { ...process.env };
    delete env.NEXT_PUBLIC_SITE_URL;
    if (override) env.NEXT_PUBLIC_SITE_URL = override;
    const result = spawnSync(process.execPath, ["--eval", probe], {
      cwd: new URL("../", import.meta.url),
      env,
      encoding: "utf8",
    });
    expect(result.status, result.stderr).toBe(0);
    const entries = JSON.parse(result.stdout);
    const byPath = new Map(
      entries.map((entry) => [new URL(entry.url).pathname, entry]),
    );

    for (const { url, changeFrequency, priority } of entries) {
      expect(url.startsWith("https://omnigent.ai/")).toBe(true);
      expect(changeFrequency).toBeUndefined();
      expect(priority).toBeUndefined();
    }
    expect(byPath.size).toBe(entries.length);

    // Redirect sources and non-page routes stay out.
    for (const source of redirectSources) {
      expect(byPath.has(source)).toBe(false);
    }
    expect([...byPath.keys()].some((p) => p.startsWith("/og"))).toBe(false);
    // app/docs/page.js and app/quickstart/page.js only call redirect().
    expect(byPath.has("/docs")).toBe(false);
    expect(byPath.has("/quickstart")).toBe(false);

    for (const p of [
      "/",
      "/faq",
      "/privacy",
      "/reference",
      "/blog",
      "/releases",
      "/quickstart/install",
      "/docs/reference/configuration/os-sandbox",
    ]) {
      expect(byPath.has(p)).toBe(true);
    }

    const posts = getBlogPosts();
    const releases = getReleases();
    expect(posts.length).toBeGreaterThan(0);
    expect(releases.length).toBeGreaterThan(0);
    for (const post of posts) {
      expect(byPath.get(post.href)?.lastModified).toBe(post.date);
    }
    for (const release of releases) {
      expect(byPath.get(release.href)?.lastModified).toBe(release.date);
    }
    expect(byPath.get("/blog").lastModified).toBe(posts[0].date);
    expect(byPath.get("/releases").lastModified).toBe(
      releases
        .map((r) => r.date)
        .sort()
        .at(-1),
    );

    // Docs, quickstarts, and static pages carry no lastmod.
    const undated = [...byPath.entries()].filter(
      ([p]) =>
        p.startsWith("/docs") ||
        p.startsWith("/quickstart") ||
        ["/", "/faq", "/privacy", "/reference"].includes(p),
    );
    expect(undated.length).toBeGreaterThan(30);
    for (const [, entry] of undated) {
      expect(entry.lastModified).toBeUndefined();
    }
  });
}
