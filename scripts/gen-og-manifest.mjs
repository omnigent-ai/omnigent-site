// Generates lib/og-manifest.json: a path -> { title, description, eyebrow } map
// the /og route uses to render social cards. The cards are referenced by path
// only, so the endpoint never renders free-form query text.
//
// Source of truth is the inline pageMeta(...) call in each page/layout. This
// script injects default metadata into generated release pages and adds the
// route `path` to any pageMeta call missing it, so it is both the one-time
// migrator and the ongoing generator. Idempotent.
//
// Run via the predev/prebuild npm hooks, or manually: node scripts/gen-og-manifest.mjs
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const releaseVersions = readdirSync("app/releases", { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^\d+\.\d+\.\d+$/.test(entry.name))
  .map((entry) => entry.name)
  .sort();
const releaseRoutes = releaseVersions.map((version) => `/releases/${version}`);
let releaseMetadataInjected = 0;

// Release MDX is generated in the omnigent repo and may arrive without Next.js
// metadata. Add a stable fallback here so future release pages get a document
// title, description, canonical OG URL, and social card without manual edits.
for (const version of releaseVersions) {
  const file = `app/releases/${version}/page.mdx`;
  let src = readFileSync(file, "utf8");
  if (src.includes("pageMeta(")) continue;

  const title = `Omnigent v${version}`;
  const description = `What's new in ${title} — release highlights, improvements, and fixes.`;
  const metadata = `import { pageMeta } from "@/lib/og";\n\nexport const metadata = pageMeta(\n  ${JSON.stringify(
    title,
  )},\n  ${JSON.stringify(description)},\n  {\n    eyebrow: "Release",\n    path: ${JSON.stringify(
    `/releases/${version}`,
  )},\n    absoluteTitle: true,\n  },\n);\n\n`;
  const firstParagraphEnd = src.indexOf("\n\n");
  const insertAt =
    src.startsWith("{/*") && firstParagraphEnd >= 0 ? firstParagraphEnd + 2 : 0;
  src = src.slice(0, insertAt) + metadata + src.slice(insertAt);
  writeFileSync(file, src);
  releaseMetadataInjected++;
}

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
let pathsInjected = 0;

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
    pathsInjected++;
  }
}

const releasesMissingMetadata = releaseRoutes.filter(
  (route) => !manifest[route],
);

if (releasesMissingMetadata.length) {
  throw new Error(
    `Release pages missing parseable pageMeta metadata: ${releasesMissingMetadata.join(
      ", ",
    )}`,
  );
}

writeFileSync("lib/og-manifest.json", JSON.stringify(manifest, null, 2) + "\n");

console.log(
  `og manifest: ${Object.keys(manifest).length} pages` +
    (releaseMetadataInjected
      ? `, injected metadata into ${releaseMetadataInjected} release page(s)`
      : "") +
    (pathsInjected ? `, injected path into ${pathsInjected} call(s)` : ""),
);
