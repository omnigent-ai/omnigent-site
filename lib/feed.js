import { getBlogPosts } from "./blog";
import { getReleases } from "./releases";
import { productionSiteUrl } from "./site";

// Separate RSS 2.0 feeds for blog posts and releases, discovered from the same
// filesystem scans as their indexes. Production URLs and publication dates
// only: a preview or rebuild must not change item identity or make old posts new.

export const FEED_PATH = "/blog/rss.xml";
export const RELEASE_FEED_PATH = "/releases/rss.xml";
const FEED_TITLE = "Omnigent blog";
const FEED_DESCRIPTION =
  "Product updates and feature deep-dives from the Omnigent team.";

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// A publication date is a calendar date (YYYY-MM-DD); publish it as midnight UTC in the
// RFC 822 format RSS requires.
function rfc822(date) {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

function creator(author) {
  if (!author || author.trim().toLowerCase() === "omnigent") return "Omnigent";
  return author;
}

function feedXml({ posts, feedPath, title, description, indexPath }) {
  const indexUrl = `${productionSiteUrl}${indexPath}`;
  const newest = posts
    .filter((post) => post.date)
    .reduce(
      (latest, post) => (!latest || post.date > latest.date ? post : latest),
      null,
    );
  const items = posts.map((post) => {
    const url = `${productionSiteUrl}${post.href}`;
    return [
      "    <item>",
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      post.date ? `      <pubDate>${rfc822(post.date)}</pubDate>` : null,
      `      <dc:creator>${escapeXml(creator(post.author))}</dc:creator>`,
      post.category
        ? `      <category>${escapeXml(post.category)}</category>`
        : null,
      post.description
        ? `      <description>${escapeXml(post.description)}</description>`
        : null,
      "    </item>",
    ]
      .filter(Boolean)
      .join("\n");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    "  <channel>",
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(indexUrl)}</link>`,
    `    <description>${escapeXml(description)}</description>`,
    "    <language>en</language>",
    `    <atom:link href="${productionSiteUrl}${feedPath}" rel="self" type="application/rss+xml" />`,
    newest ? `    <lastBuildDate>${rfc822(newest.date)}</lastBuildDate>` : null,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function blogFeedXml(posts = getBlogPosts()) {
  return feedXml({
    posts,
    feedPath: FEED_PATH,
    title: FEED_TITLE,
    description: FEED_DESCRIPTION,
    indexPath: "/blog",
  });
}

export function releaseFeedXml(releases = getReleases()) {
  // Sort by publication date, not version: an older maintenance line can ship
  // after a newer minor. Stable ties retain getReleases()'s version order.
  const posts = [...releases]
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .map((release) => ({ ...release, title: `Omnigent v${release.version}` }));
  return feedXml({
    posts,
    feedPath: RELEASE_FEED_PATH,
    title: "Omnigent releases",
    description:
      "Release highlights, improvements, and fixes from the Omnigent team.",
    indexPath: "/releases",
  });
}
