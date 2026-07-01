import fs from "fs";
import path from "path";

// Release posts are one MDX file per version under app/releases/<x.y.z>/.
// The automation (omnigent's publish-changelog.yml) only ever ADDS one such
// file per release; this helper discovers them at build time so the index and
// sidebar never need editing.

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

function extractMeta(version) {
  let date = null;
  let blurb = "";
  try {
    const src = fs.readFileSync(path.join(RELEASES_DIR, version, "page.mdx"), "utf8");
    const dateMatch = src.match(/_Released\s+(\d{4}-\d{2}-\d{2})_/);
    if (dateMatch) date = dateMatch[1];
    // First plain-text line (not a heading, list, comment, or the _Released_
    // line) makes a reasonable one-line blurb. Best-effort: many releases jump
    // straight into headings, in which case there's no blurb.
    for (const raw of src.split("\n")) {
      const line = raw.trim();
      if (!line) continue;
      if (/^[#>*\-_{]/.test(line)) continue;
      blurb = line;
      break;
    }
  } catch {
    // Missing/unreadable page — skip its metadata.
  }
  return { date, blurb };
}

export function getReleases() {
  let versions = [];
  try {
    versions = fs
      .readdirSync(RELEASES_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && VERSION_RE.test(entry.name))
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
