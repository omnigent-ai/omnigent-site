import fs from "fs";
import path from "path";
import { getBlogPosts } from "../lib/blog";
import { getReleases } from "../lib/releases";
import { productionSiteUrl } from "../lib/site";

// Served by Next at /sitemap.xml and generated at build time from the
// filesystem: every app/**/page.{js,jsx,md,mdx} becomes an entry, so new docs,
// blog posts, and releases appear without editing a route list. Redirect
// sources in next.config.mjs (which have no page file) and non-page routes
// such as app/og/route.js are left out.
//
// URLs always use productionSiteUrl so preview/tunnel overrides of siteUrl
// never leak into the sitemap (same rule as canonical URLs).
//
// lastModified is only emitted where the repo records a true content date:
// blog posts (meta.date), releases (_Released YYYY-MM-DD_), and their index
// pages (newest child). Everything else omits it rather than guessing from
// build time or git history. changefreq/priority are omitted because Google
// ignores them.

const APP_DIR = path.join(process.cwd(), "app");
const PAGE_FILE_RE = /^page\.(jsx?|mdx?)$/;

function routeFromSegments(segments) {
  const out = [];
  for (const seg of segments) {
    if (seg.startsWith("(") && seg.endsWith(")")) continue; // route group
    if (seg.startsWith("@")) continue; // parallel route slot
    if (seg.startsWith("_")) return null; // private folder
    if (seg.startsWith("[")) return null; // dynamic segment: no concrete URL
    out.push(seg);
  }
  return "/" + out.join("/");
}

function discoverRoutes(dir = APP_DIR, segments = []) {
  const routes = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      routes.push(
        ...discoverRoutes(path.join(dir, entry.name), [
          ...segments,
          entry.name,
        ]),
      );
    } else if (entry.isFile() && PAGE_FILE_RE.test(entry.name)) {
      const route = routeFromSegments(segments);
      if (route) routes.push(route);
    }
  }
  return routes;
}

function newest(dates) {
  return dates.filter(Boolean).sort().at(-1);
}

export default function sitemap() {
  const lastModified = new Map();
  const posts = getBlogPosts();
  const releases = getReleases();
  for (const post of posts) lastModified.set(post.href, post.date);
  for (const release of releases) lastModified.set(release.href, release.date);
  lastModified.set("/blog", newest(posts.map((post) => post.date)));
  lastModified.set("/releases", newest(releases.map((r) => r.date)));

  return [...new Set(discoverRoutes())].sort().map((route) => {
    // Same URL form as the canonical in lib/og.js (homepage keeps its slash).
    const entry = { url: new URL(route, `${productionSiteUrl}/`).toString() };
    const date = lastModified.get(route);
    if (date) entry.lastModified = date;
    return entry;
  });
}
