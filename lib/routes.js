import fs from "fs";
import path from "path";

// Filesystem route discovery shared by app/sitemap.js and
// scripts/generate-llms-files.mjs: every app/**/page.{js,jsx,md,mdx} becomes a
// route, so new pages never need a hand-maintained list.

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

// Returns [{ route, file }] sorted by route; `file` is relative to the repo root
// (posix separators).
export function discoverPages(root = process.cwd()) {
  const appDir = path.join(root, "app");
  const pages = [];
  function walk(dir, segments) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), [...segments, entry.name]);
      } else if (entry.isFile() && PAGE_FILE_RE.test(entry.name)) {
        const route = routeFromSegments(segments);
        if (route) {
          pages.push({
            route,
            file: ["app", ...segments, entry.name].join("/"),
          });
        }
      }
    }
  }
  walk(appDir, []);
  return pages.sort((a, b) =>
    a.route < b.route ? -1 : a.route > b.route ? 1 : 0,
  );
}
