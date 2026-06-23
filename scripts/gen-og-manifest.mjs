// Generates lib/og-manifest.json: a path -> { title, description, eyebrow } map
// the /og route uses to render social cards. The cards are referenced by path
// only, so the endpoint never renders free-form query text.
//
// Source of truth is the inline pageMeta(...) call in each page/layout. This
// script also injects the route `path` into any pageMeta call missing it, so it
// is both the one-time migrator and the ongoing generator. Idempotent.
//
// Run via the predev/prebuild npm hooks, or manually: node scripts/gen-og-manifest.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const files = execSync(
  'grep -rl "pageMeta(" app --include=page.js --include=page.mdx --include=layout.js',
)
  .toString()
  .trim()
  .split("\n")
  .filter(Boolean)
  .sort();

// app/docs/deploy/database/page.js -> /docs/deploy/database
const routeFor = (file) =>
  "/" + file.replace(/^app\//, "").replace(/\/(page|layout)\.(js|mdx)$/, "");

// Matches: pageMeta("title", "desc", { ...options }) — tolerates a trailing
// comma after the options object (Prettier adds one when it wraps the call).
const CALL =
  /pageMeta\(\s*("(?:[^"\\]|\\.)*")\s*,\s*("(?:[^"\\]|\\.)*")\s*,\s*\{([\s\S]*?)\}\s*,?\s*\)/;

const manifest = {};
let injected = 0;

for (const file of files) {
  let src = readFileSync(file, "utf8");
  const m = src.match(CALL);
  if (!m) {
    console.warn("WARN: pageMeta present but unparseable:", file);
    continue;
  }
  const [full, titleLit, descLit, opts] = m;
  const title = JSON.parse(titleLit);
  const description = JSON.parse(descLit);
  const eyebrow = opts.match(/eyebrow:\s*"((?:[^"\\]|\\.)*)"/)?.[1] ?? "";
  const path = routeFor(file);

  manifest[path] = { title, description, eyebrow };

  // Ensure the call carries its own path (used to build the og:image URL).
  if (!/\bpath:\s*"/.test(opts)) {
    const rebuilt = `pageMeta(${titleLit}, ${descLit}, {\n  eyebrow: ${JSON.stringify(
      eyebrow,
    )},\n  path: ${JSON.stringify(path)},\n})`;
    src = src.replace(full, rebuilt);
    writeFileSync(file, src);
    injected++;
  }
}

writeFileSync("lib/og-manifest.json", JSON.stringify(manifest, null, 2) + "\n");

console.log(
  `og manifest: ${Object.keys(manifest).length} pages` +
    (injected ? `, injected path into ${injected} call(s)` : ""),
);
