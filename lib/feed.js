import { getBlogPosts } from "./blog";
import { productionSiteUrl } from "./site";

// RSS 2.0 feed for the blog, served at /blog/rss.xml (app/blog/rss.xml/route.js)
// and linked from every page's <head> (app/layout.js) for feed autodiscovery.
// Built from the same filesystem scan as the /blog index, so new posts appear
// without edits here. URLs always use productionSiteUrl (same rule as canonical
// URLs and the sitemap). Dates come only from each post's meta.date; the feed
// never uses build time, so rebuilding doesn't make old posts look new.

export const FEED_PATH = "/blog/rss.xml";
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

// meta.date is a calendar date (YYYY-MM-DD); publish it as midnight UTC in the
// RFC 822 format RSS requires.
function rfc822(date) {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

function creator(author) {
  if (!author || author.trim().toLowerCase() === "omnigent") return "Omnigent";
  return author;
}

export function blogFeedXml(posts = getBlogPosts()) {
  const blogUrl = `${productionSiteUrl}/blog`;
  const newest = posts.find((post) => post.date);
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
    `    <title>${FEED_TITLE}</title>`,
    `    <link>${blogUrl}</link>`,
    `    <description>${FEED_DESCRIPTION}</description>`,
    "    <language>en</language>",
    `    <atom:link href="${productionSiteUrl}${FEED_PATH}" rel="self" type="application/rss+xml" />`,
    newest ? `    <lastBuildDate>${rfc822(newest.date)}</lastBuildDate>` : null,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ]
    .filter((line) => line !== null)
    .join("\n");
}
