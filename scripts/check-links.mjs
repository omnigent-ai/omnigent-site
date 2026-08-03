#!/usr/bin/env node
// @ts-check
/**
 * Site link checker for the Omnigent website (Next.js App Router).
 *
 * Deterministic, dependency-free link auditor that runs under plain Node or Bun
 * (no transpile step). It scans the App Router pages, layouts, and shared
 * components — `.js` / `.jsx` / `.ts` / `.tsx` and any `.md` / `.mdx` — and
 * validates four link kinds:
 *
 *   - internal   `/path` links            -> must resolve to a real route or public asset
 *   - anchor     `#frag` / `/path#frag`   -> path is checked; the fragment is reported
 *                                            `skipped` (JSX headings get no static ids)
 *   - relative   `deploy/README.md`, `./x`-> flagged: resolves in the repo, not the site
 *   - external   `https?://...`           -> network-checked only with --external
 *
 * The valid-route set is re-derived from the filesystem using Next.js App Router
 * conventions (`app/**​/page.{js,jsx,ts,tsx,md,mdx}`), with route groups `(group)`,
 * parallel slots `@slot`, and private `_folders` handled the way Next does, plus
 * `[param]` / `[...catch-all]` dynamic-segment matching. Static assets under
 * `public/` are treated as valid targets.
 *
 * Output: human summary (default) or JSON (--json). Exit code: 0 = no broken
 * links, 1 = at least one broken link, 2 = usage/internal error.
 *
 * Usage:
 *   node scripts/check-links.mjs [--external] [--internal-only] [--json]
 *                                [--ignore <pattern>]... [--quiet]
 */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(SCRIPT_DIR);

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

function usageError(msg) {
  process.stderr.write(`check-links: ${msg}\n`);
  process.stderr.write(
    `Run \`node scripts/check-links.mjs --help\` for usage.\n`,
  );
  process.exit(2);
}

function printHelp() {
  process.stdout.write(
    [
      "Usage: node scripts/check-links.mjs [options]",
      "",
      "  --external        Also network-check external http(s) URLs (off by default).",
      "  --internal-only   Force internal/anchor/relative only (overrides --external).",
      "  --json            Emit machine-readable JSON to stdout.",
      "  --ignore <pat>    Skip external URLs containing <pat> (repeatable).",
      "  --quiet           Only print problems + summary (suppress per-file OK lines).",
      "  -h, --help        Show this help.",
      "",
      "Exit: 0 = no broken links, 1 = broken links found, 2 = usage error.",
      "",
    ].join("\n"),
  );
}

function parseArgs(argv) {
  const opts = {
    external: false,
    json: false,
    quiet: false,
    ignore: [],
    timeout: 10000,
  };
  let forceInternal = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--external") opts.external = true;
    else if (a === "--internal-only") forceInternal = true;
    else if (a === "--json") opts.json = true;
    else if (a === "--quiet") opts.quiet = true;
    else if (a === "--ignore") {
      const v = argv[++i];
      if (v === undefined) usageError("--ignore requires a value");
      opts.ignore.push(v);
    } else if (a === "--help" || a === "-h") {
      printHelp();
      process.exit(0);
    } else {
      usageError(`unknown argument "${a}"`);
    }
  }
  if (forceInternal) opts.external = false;
  return opts;
}

// ---------------------------------------------------------------------------
// Filesystem helpers
// ---------------------------------------------------------------------------

/** Recursively collect files under `dir`, skipping dotdirs and node_modules. */
function walk(dir, acc = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc; // missing dir -> nothing
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name.startsWith(".")) continue;
      walk(full, acc);
    } else if (e.isFile()) {
      acc.push(full);
    }
  }
  return acc;
}

const toPosix = (p) => p.split(sep).join("/");
const repoRel = (abs) => toPosix(relative(ROOT, abs));

// ---------------------------------------------------------------------------
// Valid-target model (Next.js App Router routes + public assets)
// ---------------------------------------------------------------------------

const PAGE_FILE_RE = /\/page\.(jsx?|tsx?|mdx?)$/;

/**
 * Map an `app/**​/page.*` file (relative to `app/`) to its URL, following Next's
 * App Router rules: drop the `page.*` leaf, strip route groups `(group)` and
 * parallel slots `@slot`, treat a private `_folder` as non-routable, and keep
 * `[param]` / `[...catch-all]` segments for dynamic matching.
 *
 * Returns `{ url }` for a static route, `{ url, dynamic: true }` for a route
 * with a dynamic segment, or `{ url: null }` when the file is not routable.
 */
function routeFromAppFile(relFromApp) {
  const parts = relFromApp.split("/");
  parts.pop(); // drop the page.* leaf
  const out = [];
  let dynamic = false;
  for (const seg of parts) {
    if (seg === "") continue;
    if (seg.startsWith("(") && seg.endsWith(")")) continue; // route group / intercepting
    if (seg.startsWith("@")) continue; // parallel route slot — no own URL
    if (seg.startsWith("_")) return { url: null }; // private folder — not routable
    if (/^\[\[?\.\.\..+\]\]?$/.test(seg)) {
      dynamic = true; // [...slug] / [[...slug]] catch-all
      out.push(seg);
    } else if (/^\[.+\]$/.test(seg)) {
      dynamic = true; // [slug] dynamic
      out.push(seg);
    } else {
      out.push(seg);
    }
  }
  const joined = "/" + out.join("/");
  const url = joined === "/" ? "/" : joined.replace(/\/+$/, "");
  return { url, dynamic };
}

/** Compile a dynamic route URL (with `[param]`/`[...slug]`) into a matcher. */
function routeRegex(template) {
  const segs = template.split("/").filter((s, i) => !(i === 0 && s === ""));
  let re = "^";
  for (const seg of segs) {
    if (/^\[\[?\.\.\..+\]\]?$/.test(seg))
      re += "(?:/.+)?"; // catch-all (optionally empty)
    else if (/^\[.+\]$/.test(seg))
      re += "/[^/]+"; // single dynamic segment
    else re += "/" + seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  re += "/?$";
  return new RegExp(re);
}

function buildModel() {
  const appDir = join(ROOT, "app");
  const validPaths = new Set();
  const dynamicRoutes = []; // { regex, template }

  for (const f of walk(appDir)) {
    const posix = toPosix(f);
    if (!PAGE_FILE_RE.test(posix)) continue;
    const { url, dynamic } = routeFromAppFile(toPosix(relative(appDir, f)));
    if (url === null) continue;
    if (dynamic) dynamicRoutes.push({ regex: routeRegex(url), template: url });
    else validPaths.add(url);
  }

  const publicAssets = new Set();
  for (const f of walk(join(ROOT, "public"))) {
    publicAssets.add("/" + repoRel(f).replace(/^public\//, ""));
  }

  return { validPaths, dynamicRoutes, publicAssets };
}

// ---------------------------------------------------------------------------
// Markdown scanning: fenced-code ranges + link extraction (fence-aware)
// ---------------------------------------------------------------------------

function computeLineStarts(text) {
  const starts = [0];
  for (let i = 0; i < text.length; i++)
    if (text[i] === "\n") starts.push(i + 1);
  return starts;
}

function lineColFromOffset(lineStarts, offset) {
  let lo = 0;
  let hi = lineStarts.length - 1;
  let line = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (lineStarts[mid] <= offset) {
      line = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return { line: line + 1, column: offset - lineStarts[line] + 1 };
}

/** Returns line starts and fenced-code char ranges in a markdown document. */
function scanMarkdown(text) {
  const lineStarts = computeLineStarts(text);
  const lines = text.split("\n");
  const fenced = []; // [startOffset, endOffset)
  let inFence = false;
  let fenceChar = "";
  let fenceLen = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const start = lineStarts[i];
    const open = line.match(/^(\s*)(`{3,}|~{3,})/);
    if (!inFence) {
      if (open) {
        inFence = true;
        fenceChar = open[2][0];
        fenceLen = open[2].length;
        fenced.push([start, text.length]); // closed below if a closing fence is found
      }
    } else {
      const close = line.match(/^(\s*)(`{3,}|~{3,})[ \t]*$/);
      if (close && close[2][0] === fenceChar && close[2].length >= fenceLen) {
        inFence = false;
        fenced[fenced.length - 1][1] = start + line.length;
      }
    }
  }
  return { lineStarts, fenced };
}

/** Blank out the given char ranges (keep newlines so offsets stay aligned). */
function blankRanges(text, ranges) {
  if (ranges.length === 0) return text;
  const arr = [...text];
  for (const [s, e] of ranges) {
    for (let i = s; i < e && i < arr.length; i++) {
      if (arr[i] !== "\n") arr[i] = " ";
    }
  }
  return arr.join("");
}

/** Mask inline `code` spans (offset-preserving). */
function maskInline(text) {
  return text.replace(/(`+)[\s\S]*?\1/g, (m) => m.replace(/[^\n]/g, " "));
}

/** Find `[text](target)` links (robust to nested parens). Returns image flag too. */
function findMarkdownLinks(s) {
  const out = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== "[") continue;
    const isImage = i > 0 && s[i - 1] === "!";
    let j = i + 1;
    let depth = 1;
    while (j < s.length && depth > 0) {
      if (s[j] === "[") depth++;
      else if (s[j] === "]") depth--;
      j++;
    }
    if (depth !== 0 || s[j] !== "(") continue;
    let k = j + 1;
    let pdepth = 1;
    while (k < s.length && pdepth > 0) {
      if (s[k] === "(") pdepth++;
      else if (s[k] === ")") pdepth--;
      k++;
    }
    if (pdepth !== 0) continue;
    out.push({ isImage, inner: s.slice(j + 1, k - 1), innerOffset: j + 1 });
    i = k - 1;
  }
  return out;
}

/** Pull the URL out of a markdown link target (drops a trailing "title"). */
function parseLinkTarget(inner) {
  const t = inner.trim();
  if (t.startsWith("<")) {
    const close = t.indexOf(">");
    if (close !== -1) return t.slice(1, close).trim();
  }
  const titled = t.match(/^(\S+)\s+["'(][\s\S]*$/);
  return (titled ? titled[1] : t).trim();
}

const BARE_URL_RE = /\bhttps?:\/\/[^\s<>"'`)\]}]+/g;
const TRAILING_PUNCT_RE = /[.,;:!?)\]}>]+$/;

// ---------------------------------------------------------------------------
// Classification + validation
// ---------------------------------------------------------------------------

const splitFrag = (t) => {
  const i = t.indexOf("#");
  return i === -1 ? [t, null] : [t.slice(0, i), t.slice(i + 1)];
};
const stripQuery = (p) => p.split("?")[0];
const normalizePath = (p) => {
  if (p === "" || p === "/") return "/";
  const n = p.replace(/\/+$/, "");
  return n === "" ? "/" : n;
};

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let cur = new Array(n + 1);
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}

/** Closest candidate by case-insensitive edit distance, with a confidence band. */
function closest(candidates, value) {
  if (candidates.length === 0) return null;
  const lower = value.toLowerCase();
  const ciExact = candidates.find((c) => c.toLowerCase() === lower);
  if (ciExact && ciExact !== value)
    return { value: ciExact, confidence: "high" };
  let best = null;
  let bestD = Infinity;
  let ties = 0;
  for (const c of candidates) {
    const d = levenshtein(lower, c.toLowerCase());
    if (d < bestD) {
      bestD = d;
      best = c;
      ties = 1;
    } else if (d === bestD) {
      ties++;
    }
  }
  if (best === null) return null;
  const norm = bestD / Math.max(value.length, best.length, 1);
  let confidence = "none";
  if (ties === 1 && norm <= 0.15) confidence = "high";
  else if (ties === 1 && norm <= 0.34) confidence = "medium";
  else confidence = "low";
  return { value: best, confidence };
}

/** Suggest a route for a broken internal path (basename hint, then edit distance). */
function suggestInternal(norm, validPaths) {
  const candidates = [...validPaths];
  const base = norm.split("/").pop();
  const baseMatches = candidates.filter((c) => c.split("/").pop() === base);
  if (baseMatches.length === 1 && baseMatches[0] !== norm) {
    return { value: baseMatches[0], confidence: "medium" };
  }
  return closest(candidates, norm);
}

const DEFAULT_EXTERNAL_IGNORE = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  ".local",
  "192.168.",
  "10.0.",
  "example.com",
  "example.org",
  "your-host",
  "your-domain",
  ".internal",
  "<",
];

function isIgnoredExternal(url, userIgnore) {
  const all = [...DEFAULT_EXTERNAL_IGNORE, ...userIgnore];
  return all.some((p) => url.includes(p));
}

function matchesDynamic(norm, model) {
  return model.dynamicRoutes.some((r) => r.regex.test(norm));
}

/**
 * Classify + (statically) validate a single link target. `pageUrl` is the URL
 * the source file renders as, or null when it cannot be determined.
 */
function validateTarget(rawTarget, pageUrl, model) {
  const t = (rawTarget ?? "").trim();

  // Empty target / bare "#" (back-to-top, destructuring defaults) — not a link.
  if (t === "" || t === "#") return null;
  if (t.includes("`")) {
    return {
      category: "malformed",
      status: "broken",
      reason:
        "link target wrapped in backticks; the rendered href contains literal backticks",
      suggestion: t.replace(/`/g, ""),
      suggestionConfidence: "high",
    };
  }
  if (/^(https?:)?\/\//i.test(t)) {
    return {
      category: "external",
      status: "pending",
      _url: t.replace(/^\/\//, "https://"),
    };
  }
  if (/^mailto:/i.test(t))
    return {
      category: "external",
      status: "skipped",
      reason: "mailto: not checked",
    };
  if (/^tel:/i.test(t))
    return {
      category: "external",
      status: "skipped",
      reason: "tel: not checked",
    };
  if (/^[a-z][a-z0-9+.-]*:/i.test(t) && !t.startsWith("/")) {
    return {
      category: "external",
      status: "skipped",
      reason: `${t.split(":")[0]}: scheme not checked`,
    };
  }

  // Anchor (same page) -------------------------------------------------------
  if (t.startsWith("#")) {
    return validateFragment(pageUrl, t.slice(1));
  }

  // Internal absolute path ---------------------------------------------------
  if (t.startsWith("/")) {
    const [rawPath, frag] = splitFrag(t);
    const norm = normalizePath(stripQuery(rawPath));

    if (model.publicAssets.has(norm)) {
      return {
        category: "internal",
        status: "ok",
        reason: `static asset (public${norm})`,
        target: { path: norm, fragment: null },
      };
    }

    if (model.validPaths.has(norm) || matchesDynamic(norm, model)) {
      if (frag) return validateFragment(norm, frag);
      return {
        category: "internal",
        status: "ok",
        reason: `route "${norm}"`,
        target: { path: norm, fragment: null },
      };
    }

    const sugg = suggestInternal(norm, model.validPaths);
    return {
      category: "internal",
      status: "broken",
      reason: `no route resolves "${norm}"`,
      target: { path: norm, fragment: frag },
      ...(sugg
        ? {
            suggestion: frag ? `${sugg.value}#${frag}` : sugg.value,
            suggestionConfidence: sugg.confidence,
          }
        : {}),
    };
  }

  // Relative (repo-relative) -------------------------------------------------
  return {
    category: "relative",
    status: "warning",
    reason: "relative link — resolves in the GitHub repo, not on the site",
    target: { path: t, fragment: null },
  };
}

/**
 * App Router pages render JSX/MDX whose headings get no automatically-generated
 * `id`s (there is no rehype-slug step), so anchor fragments cannot be verified
 * statically. The path is validated by the caller; the fragment is reported
 * `skipped` so it is surfaced without ever failing CI.
 */
function validateFragment(pageUrl, frag) {
  if (frag === "") {
    return {
      category: "anchor",
      status: "skipped",
      reason: "empty fragment",
      target: { path: pageUrl, fragment: "" },
    };
  }
  return {
    category: "anchor",
    status: "skipped",
    reason: pageUrl
      ? `anchor into "${pageUrl}" — heading ids are not statically verifiable`
      : "in-page anchor — heading ids are not statically verifiable",
    target: { path: pageUrl, fragment: frag },
  };
}

// ---------------------------------------------------------------------------
// Per-file scanning
// ---------------------------------------------------------------------------

function pageUrlForSource(absPath, model) {
  const posix = toPosix(absPath);
  if (!PAGE_FILE_RE.test(posix)) return null;
  const appDir = toPosix(join(ROOT, "app"));
  if (!posix.startsWith(appDir + "/")) return null;
  const { url, dynamic } = routeFromAppFile(posix.slice(appDir.length + 1));
  return dynamic ? null : url;
}

function scanMarkdownFile(absPath, model, opts, findings) {
  const text = readFileSync(absPath, "utf8");
  const file = repoRel(absPath);
  const { lineStarts, fenced } = scanMarkdown(text);
  const fenceMasked = blankRanges(text, fenced);
  const pageUrl = pageUrlForSource(absPath, model);
  const mdLinkRanges = [];

  for (const link of findMarkdownLinks(fenceMasked)) {
    if (link.isImage) continue;
    const target = parseLinkTarget(link.inner);
    mdLinkRanges.push([link.innerOffset, link.innerOffset + link.inner.length]);
    const res = validateTarget(target, pageUrl, model);
    pushFinding(findings, file, lineStarts, link.innerOffset, target, res);
  }

  // Bare prose URLs (external), skipping anything already inside a markdown link.
  const bareSource = blankRanges(maskInline(fenceMasked), mdLinkRanges);
  collectBareUrls(bareSource, lineStarts, file, model, findings);
}

function scanCodeFile(absPath, model, opts, findings) {
  const text = readFileSync(absPath, "utf8");
  const file = repoRel(absPath);
  const lineStarts = computeLineStarts(text);
  const pageUrl = pageUrlForSource(absPath, model);
  const capturedRanges = [];

  // String-literal href/src attributes: href="…" / src='…' / href={"…"} / src={'…'}
  const ATTR_RE =
    /\b(href|src)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*"([^"]*)"\s*\}|\{\s*'([^']*)'\s*\})/g;
  for (let m; (m = ATTR_RE.exec(text));) {
    const value = m[2] ?? m[3] ?? m[4] ?? m[5];
    const offset = m.index + m[0].lastIndexOf(value);
    capturedRanges.push([offset, offset + value.length]);
    const res = validateTarget(value, pageUrl, model);
    pushFinding(findings, file, lineStarts, offset, value, res);
  }

  // Dynamic href={expr} / src={expr} — not a string literal, so unverifiable.
  const DYN_RE = /\b(href|src)\s*=\s*\{(?!\s*["'])/g;
  for (let m; (m = DYN_RE.exec(text));) {
    pushFinding(findings, file, lineStarts, m.index, `${m[1]}={…}`, {
      category: "dynamic-skipped",
      status: "skipped",
      reason: "dynamic link expression — not statically verifiable",
    });
  }

  // External URL string literals not already captured as href/src — covers the
  // shared link constants (e.g. `export const GITHUB_URL = "https://…"`).
  const URL_LIT_RE = /(["'])((?:https?:)?\/\/[^"']+)\1/g;
  for (let m; (m = URL_LIT_RE.exec(text));) {
    const offset = m.index + 1;
    if (capturedRanges.some(([s, e]) => offset >= s && offset < e)) continue;
    const res = validateTarget(m[2], null, model);
    pushFinding(findings, file, lineStarts, offset, m[2], res);
  }
}

function collectBareUrls(source, lineStarts, file, model, findings) {
  for (let m; (m = BARE_URL_RE.exec(source));) {
    const raw = m[0].replace(TRAILING_PUNCT_RE, "");
    if (raw.length === 0) continue;
    const res = validateTarget(raw, null, model);
    pushFinding(findings, file, lineStarts, m.index, raw, res);
  }
}

function pushFinding(findings, file, lineStarts, offset, rawLink, res) {
  if (!res) return; // empty/ignored target — not recorded
  const { line, column } = lineColFromOffset(lineStarts, offset);
  const { _url, ...rest } = res;
  findings.push({
    file,
    line,
    column,
    rawLink,
    ...rest,
    ...(_url ? { _url } : {}),
  });
}

// ---------------------------------------------------------------------------
// External probing
// ---------------------------------------------------------------------------

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithTimeout(url, method, timeout) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    return await fetch(url, {
      method,
      redirect: "follow",
      signal: ctrl.signal,
      headers: {
        "User-Agent":
          "omnigent-link-checker/1.0 (+https://github.com/omnigent-ai/omnigent)",
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function probe(url, opts) {
  for (let attempt = 0; attempt <= 2; attempt++) {
    try {
      let res = await fetchWithTimeout(url, "HEAD", opts.timeout);
      if ([403, 405, 501].includes(res.status)) {
        res = await fetchWithTimeout(url, "GET", opts.timeout);
      }
      const s = res.status;
      if (s >= 200 && s < 400) return { status: "ok", reason: `HTTP ${s}` };
      if (s === 404 || s === 410)
        return { status: "broken", reason: `HTTP ${s}` };
      if (s === 401 || s === 403 || s === 429) {
        return {
          status: "skipped",
          reason: `HTTP ${s} (auth/rate-limit/bot-block — uncertain)`,
        };
      }
      if (s >= 500 && attempt < 2) {
        await delay(400 * (attempt + 1));
        continue;
      }
      return { status: "warning", reason: `HTTP ${s}` };
    } catch (e) {
      const code = e?.cause?.code || e?.code || e?.name;
      if (code === "ENOTFOUND" || code === "ERR_INVALID_URL") {
        return { status: "broken", reason: String(code) };
      }
      if (attempt < 2) {
        await delay(400 * (attempt + 1));
        continue;
      }
      return {
        status: "warning",
        reason: `unreachable: ${code || e?.message || "error"}`,
      };
    }
  }
  return { status: "warning", reason: "unreachable" };
}

async function resolveExternal(findings, opts) {
  const external = findings.filter(
    (f) => f.category === "external" && f.status === "pending",
  );
  if (!opts.external) {
    for (const f of external) {
      f.status = "skipped";
      f.reason = "external checks disabled (run with --external)";
      delete f._url;
    }
    return;
  }
  const cache = new Map();
  const queue = [];
  for (const f of external) {
    if (isIgnoredExternal(f._url, opts.ignore)) {
      f.status = "skipped";
      f.reason = "ignored (placeholder/private host or --ignore match)";
      delete f._url;
    } else if (!cache.has(f._url)) {
      cache.set(f._url, null);
      queue.push(f._url);
    }
  }
  const CONCURRENCY = 6;
  const worker = async () => {
    let url;
    while ((url = queue.shift()) !== undefined) {
      cache.set(url, await probe(url, opts));
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, queue.length) }, worker),
  );
  for (const f of external) {
    if (f.status !== "pending") continue;
    const r = cache.get(f._url);
    f.status = r.status;
    f.reason = r.reason;
    delete f._url;
  }
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

const STATUS_GLYPH = {
  ok: "ok  ",
  broken: "FAIL",
  warning: "warn",
  skipped: "skip",
};

function buildSummary(findings, opts, filesScanned) {
  const summary = {
    filesScanned,
    linksChecked: findings.length,
    ok: 0,
    broken: 0,
    warning: 0,
    skipped: 0,
    byCategory: {},
    external: opts.external,
  };
  for (const f of findings) {
    summary[f.status] = (summary[f.status] ?? 0) + 1;
    summary.byCategory[f.category] = (summary.byCategory[f.category] ?? 0) + 1;
  }
  return summary;
}

function printHuman(findings, summary, opts) {
  const out = [];
  const byFile = new Map();
  for (const f of findings) {
    if (!byFile.has(f.file)) byFile.set(f.file, []);
    byFile.get(f.file).push(f);
  }
  for (const file of [...byFile.keys()].sort()) {
    const rows = byFile
      .get(file)
      .filter((f) => !(opts.quiet && f.status === "ok"))
      .sort((a, b) => a.line - b.line || a.column - b.column);
    if (rows.length === 0) continue;
    out.push(file);
    for (const f of rows) {
      const loc = `${f.line}:${f.column}`.padEnd(7);
      const cat = f.category.padEnd(9);
      let line = `  ${STATUS_GLYPH[f.status]} ${loc} ${cat} ${f.rawLink}`;
      if (f.reason) line += `\n        ↳ ${f.reason}`;
      if (f.suggestion)
        line += ` — did you mean ${f.suggestion}? (${f.suggestionConfidence})`;
      out.push(line);
    }
    out.push("");
  }
  out.push(
    `Summary: ${summary.linksChecked} links across ${summary.filesScanned} files | ` +
      `${summary.ok} ok, ${summary.broken} broken, ${summary.warning} warning, ${summary.skipped} skipped` +
      ` (external: ${summary.external ? "checked" : "skipped — use --external"})`,
  );
  if (summary.broken > 0) {
    out.push(`\n${summary.broken} broken link(s) found. Exit 1.`);
  } else {
    out.push(`\nNo broken links. Exit 0.`);
  }
  process.stdout.write(out.join("\n") + "\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const model = buildModel();

  const scanRoots = ["app", "components"].map((d) => join(ROOT, d));
  const files = scanRoots.flatMap((d) => walk(d));
  const findings = [];
  const scanned = new Set();

  for (const abs of files) {
    const p = toPosix(abs);
    if (/\.mdx?$/.test(p)) {
      scanMarkdownFile(abs, model, opts, findings);
      scanned.add(p);
    } else if (/\.(jsx?|tsx?)$/.test(p) && !p.endsWith(".d.ts")) {
      scanCodeFile(abs, model, opts, findings);
      scanned.add(p);
    }
  }

  await resolveExternal(findings, opts);
  for (const f of findings) delete f._url; // drop internal bookkeeping before output

  const summary = buildSummary(findings, opts, scanned.size);

  if (opts.json) {
    process.stdout.write(JSON.stringify({ summary, findings }, null, 2) + "\n");
  } else {
    printHuman(findings, summary, opts);
  }
  process.exit(summary.broken > 0 ? 1 : 0);
}

main().catch((err) => {
  process.stderr.write(`check-links: internal error: ${err?.stack || err}\n`);
  process.exit(2);
});
