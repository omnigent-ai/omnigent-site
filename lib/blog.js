import fs from "fs";
import path from "path";

// Blog posts are one MDX file per slug under app/blog/<slug>/page.mdx, each
// exporting a `meta` object (title, date, category, author, heroArt) and a
// pageMeta() description. This helper discovers them at build time so the index
// and sidebar never need editing — mirrors lib/releases.js.

const BLOG_DIR = path.join(process.cwd(), "app", "blog");

function extractMeta(slug) {
  let title = slug;
  let date = null;
  let category = null;
  let heroArt = null;
  let author = null;
  let description = null;
  try {
    const src = fs.readFileSync(path.join(BLOG_DIR, slug, "page.mdx"), "utf8");
    const titleMatch = src.match(/title:\s*"([^"]+)"/);
    if (titleMatch) title = titleMatch[1];
    const dateMatch = src.match(/date:\s*"(\d{4}-\d{2}-\d{2})"/);
    if (dateMatch) date = dateMatch[1];
    const categoryMatch = src.match(/category:\s*"([^"]+)"/);
    if (categoryMatch) category = categoryMatch[1];
    const heroMatch = src.match(/heroArt:\s*"([^"]+)"/);
    if (heroMatch) heroArt = heroMatch[1];
    const authorMatch = src.match(/author:\s*"([^"]+)"/);
    if (authorMatch) author = authorMatch[1];
    // The card excerpt is the second positional arg to pageMeta(title, desc, …).
    const descMatch = src.match(/pageMeta\(\s*[^,]+,\s*"((?:[^"\\]|\\.)*)"/);
    if (descMatch) description = descMatch[1].replace(/\\"/g, '"');
  } catch {
    // Missing/unreadable page — skip its metadata.
  }
  return { title, date, category, heroArt, author, description };
}

// Metadata for a single post (used by the in-post header component).
export function getBlogPost(slug) {
  return { slug, href: `/blog/${slug}`, ...extractMeta(slug) };
}

// Estimate reading time for a post from its MDX body, for the post header.
// Strips the exported metadata/imports and MDX/HTML syntax so the count is
// roughly the prose a reader sees, then divides by an average reading speed.
// Returns a whole number of minutes (minimum 1). Runs at build time only.
const WORDS_PER_MINUTE = 220;

export function getReadingMinutes(slug) {
  let src = "";
  try {
    src = fs.readFileSync(path.join(BLOG_DIR, slug, "page.mdx"), "utf8");
  } catch {
    return 1;
  }
  const prose = src
    .replace(/^import\s.*$/gm, "") // import lines
    .replace(/export\s+const\s+\w+\s*=\s*[\s\S]*?;\s*$/gm, "") // exported metadata objects
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "") // MDX comments
    .replace(/```[\s\S]*?```/g, "") // fenced code blocks
    .replace(/<[^>]+>/g, " ") // JSX/HTML tags
    .replace(/[#*_`>|-]/g, " "); // markdown punctuation
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function getBlogPosts() {
  let slugs = [];
  try {
    slugs = fs
      .readdirSync(BLOG_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch {
    slugs = [];
  }
  const posts = slugs.map((slug) => ({
    slug,
    href: `/blog/${slug}`,
    ...extractMeta(slug),
  }));
  // Newest first; undated posts sort last.
  posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  return posts;
}
