import { getBlogPosts } from "../lib/blog";
import { getReleases } from "../lib/releases";
import { discoverPages } from "../lib/routes";
import { answers, answerPath, answerCheckedDate } from "../lib/answers";
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
// pages (newest child), and answers (editorial check date). Everything else
// omits it rather than guessing from
// build time or git history. changefreq/priority are omitted because Google
// ignores them.

function newest(dates) {
  return dates.filter(Boolean).sort().at(-1);
}

export default function sitemap() {
  const lastModified = new Map();
  lastModified.set("/answers", answerCheckedDate);
  for (const answer of answers)
    lastModified.set(
      answerPath(answer.id),
      answer.checkedDate ?? answerCheckedDate,
    );
  const posts = getBlogPosts();
  const releases = getReleases();
  for (const post of posts) lastModified.set(post.href, post.date);
  for (const release of releases) lastModified.set(release.href, release.date);
  lastModified.set("/blog", newest(posts.map((post) => post.date)));
  lastModified.set("/releases", newest(releases.map((r) => r.date)));

  return [...new Set(discoverPages().map((page) => page.route))]
    .filter(
      (route) => route !== "/answers/orchestrate-codex-and-claude-code-v1",
    )
    .sort()
    .map((route) => {
      // Same URL form as the canonical in lib/og.js (homepage keeps its slash).
      const entry = { url: new URL(route, `${productionSiteUrl}/`).toString() };
      const date = lastModified.get(route);
      if (date) entry.lastModified = date;
      return entry;
    });
}
