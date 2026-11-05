import fs from "fs";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";

// Release posts are one MDX file per version under app/releases/<x.y.z>/.
// The automation (omnigent's publish-changelog.yml) targets one version per
// run. Older pages persist unless that same version is explicitly republished.
// Discover pages at build time so the index and sidebar never need editing.

const RELEASES_DIR = path.join(process.cwd(), "app", "releases");
const VERSION_RE = /^\d+\.\d+\.\d+$/;

function compareVersionsDesc(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i += 1) {
    if (pa[i] !== pb[i]) return pb[i] - pa[i];
  }
  return 0;
}

const markdownParser = unified().use(remarkParse);

function plainText(node) {
  // Keep link labels, emphasis and inline code, not HTML tags or image URLs.
  if (node.type === "text" || node.type === "inlineCode") return node.value;
  if (node.type === "break") return " ";
  return (node.children ?? []).map(plainText).join("");
}

// One rule for page metadata, RSS and llms.txt. Release automation supplies a
// byline followed by a summary paragraph; do not mistake a section heading or
// the community footer for that summary when an older release has no lede.
export function getReleaseDescription(source, version) {
  const metadata = source.match(
    /pageMeta\(\s*(?:"(?:[^"\\]|\\.)*"|[\w.]+)\s*,\s*("(?:[^"\\]|\\.)*")/,
  );
  const description = metadata ? JSON.parse(metadata[1]).trim() : "";
  if (
    description &&
    !/^What's new in Omnigent v\d+\.\d+\.\d+ — release highlights, improvements, and fixes\.$/.test(
      description,
    )
  ) {
    return description;
  }

  const byline = source.match(/^_Released\s+\d{4}-\d{2}-\d{2}_[^\n]*(?:\n|$)/m);
  if (byline) {
    const body = source.slice(byline.index + byline[0].length).trimStart();
    const firstBlock = body.split(/\r?\n\s*\r?\n/, 1)[0];
    const node = markdownParser.parse(firstBlock).children[0];
    if (node?.type === "paragraph") {
      const summary = plainText(node).replace(/\s+/g, " ").trim();
      if (summary) return summary;
    }
  }
  // No invented highlights or build-time date if the publisher omits a lede.
  return `Release notes for Omnigent v${version}.`;
}

function extractMeta(version) {
  let date = null;
  let description = `Release notes for Omnigent v${version}.`;
  try {
    const src = fs.readFileSync(
      path.join(RELEASES_DIR, version, "page.mdx"),
      "utf8",
    );
    const dateMatch = src.match(/_Released\s+(\d{4}-\d{2}-\d{2})_/);
    if (dateMatch) date = dateMatch[1];
    description = getReleaseDescription(src, version);
  } catch {
    // Missing/unreadable page — skip its metadata.
  }
  return { date, description };
}

export function getReleases() {
  let versions = [];
  try {
    versions = fs
      .readdirSync(RELEASES_DIR, { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isDirectory() &&
          VERSION_RE.test(entry.name) &&
          fs.existsSync(path.join(RELEASES_DIR, entry.name, "page.mdx")),
      )
      .map((entry) => entry.name);
  } catch {
    versions = [];
  }
  versions.sort(compareVersionsDesc);
  return versions.map((version) => ({
    version,
    href: `/releases/${version}`,
    ...extractMeta(version),
  }));
}
