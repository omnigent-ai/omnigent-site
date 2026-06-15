// Builds the Pagefind search index from the statically prerendered docs HTML.
//
// Runs after `next build`. The site is server-rendered on Vercel (the
// redirects/rewrites in next.config.mjs rule out a full static export), but all
// docs and quickstart routes are prerendered to HTML under .next/server/app, so
// we feed those files to Pagefind's Node indexing API and write the resulting
// index into public/pagefind, where it is served as a static asset.
//
// Only the article content is indexed: the docs/quickstart layouts mark their
// <article> with data-pagefind-body, so nav, sidebar, and search UI are skipped.

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import * as pagefind from "pagefind";

const APP_DIR = path.join(".next", "server", "app");
// Route prefixes whose prerendered HTML should be searchable.
const SEARCH_PREFIXES = ["docs", "quickstart"];
const OUTPUT_DIR = path.join("public", "pagefind");

async function htmlFilesUnder(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out; // prefix not present in this build
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await htmlFilesUnder(full)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

// .next/server/app/docs/collaborate.html -> /docs/collaborate
function fileToUrl(file) {
  const rel = path.relative(APP_DIR, file).replace(/\\/g, "/");
  return "/" + rel.replace(/\.html$/, "").replace(/\/index$/, "");
}

async function main() {
  const files = (
    await Promise.all(
      SEARCH_PREFIXES.map((p) => htmlFilesUnder(path.join(APP_DIR, p)))
    )
  ).flat();

  if (files.length === 0) {
    console.error(
      "search index: no prerendered HTML found under " +
        APP_DIR +
        " — run `next build` first."
    );
    process.exit(1);
  }

  const { index } = await pagefind.createIndex();

  for (const file of files) {
    const content = await readFile(file, "utf8");
    await index.addHTMLFile({ url: fileToUrl(file), content });
  }

  await index.writeFiles({ outputPath: OUTPUT_DIR });
  await pagefind.close();

  console.log(`search index: indexed ${files.length} pages -> ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error("search index: failed", err);
  process.exit(1);
});
