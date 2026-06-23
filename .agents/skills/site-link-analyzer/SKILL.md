---
name: site-link-analyzer
description: >-
  Audit every link in the site (App Router pages, layouts, shared components,
  link constants, and any MDX) for broken internal routes, missing public
  assets, relative/external targets, and unverifiable anchors, then auto-apply
  the confident fixes and report the rest. Use when asked to check links, find
  broken links, validate docs navigation, or before publishing or merging
  content changes.
---

# Analyze site links

Find and fix broken links across the site. The work splits in two:

- **`scripts/check-links.mjs`** (run via `bun run lint:links`) is the deterministic
  source of truth. It extracts links and validates them, prints a report, and
  exits non-zero when any link is **broken**. It never edits files.
- **You** are the judgment layer: read the checker's JSON, apply the _confident_
  fixes, leave the ambiguous ones for the human, and **re-run the checker to
  confirm green** before you call the job done.

The checker re-derives the valid route set from the filesystem using Next.js App
Router conventions (`app/**/page.{js,jsx,ts,tsx,md,mdx}`, with route groups,
parallel slots, private folders, and `[param]`/`[...catch-all]` segments) and
treats files under `public/` as valid assets, so its results match what the site
actually serves. It has no dependencies — it runs on plain Node or Bun.

## Before you start: branch

Per `.agents/rules/branching-rule.mdc`, never commit to `main`. If the current
branch is `main`, create a branch first (offer a suggested name such as
`fix/broken-links` and a "provide your own" option) before editing any files.

## Workflow

```
- [ ] 1. Run `bun run lint:links -- --json` and read the findings.
- [ ] 2. Triage each finding by status + category.
- [ ] 3. Apply the CONFIDENT auto-fixes (rules below). Leave report-only items.
- [ ] 4. Re-run `bun run lint:links` and confirm it exits 0 (no broken links).
- [ ] 5. Summarize: what you fixed, what needs a human decision, coverage gaps.
- [ ] 6. (Optional) External sweep: `bun run lint:links -- --external` — report only.
```

## How to run

| Command                                | What it does                                                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `bun run lint:links`                   | Internal + anchor + relative checks (no network). This is the deterministic gate; exit 1 on any broken link. |
| `bun run lint:links -- --json`         | Same checks, machine-readable JSON to stdout — use this to drive fixes.                                      |
| `bun run lint:links -- --quiet`        | Suppress the per-file `ok` lines; show only problems + summary.                                              |
| `bun run lint:links -- --external`     | **Also** network-check external `http(s)` URLs. Slow + flaky — advisory only, never a gate.                  |
| `bun run lint:links -- --ignore <pat>` | Skip external URLs containing `<pat>` (repeatable).                                                          |

Exit codes: `0` = no broken links, `1` = broken links found, `2` = usage/internal error.

External checking is **off by default and never gates CI** (rate limits, transient
outages, and CI-IP blocking make it non-deterministic). The deterministic
internal/anchor/relative checks are the gate; the scheduled
`.github/workflows/link-check-external.yml` runs the `--external` sweep weekly,
non-blocking.

## Reading the JSON

```jsonc
{
  "summary": { "filesScanned", "linksChecked", "ok", "broken", "warning", "skipped", "byCategory", "external" },
  "findings": [
    {
      "file": "app/docs/installing/page.js",
      "line": 65, "column": 27,
      "rawLink": "/docs/codin",
      "category": "internal",        // internal | anchor | relative | external | dynamic-skipped | malformed
      "status": "broken",            // ok | broken | warning | skipped
      "reason": "no route resolves \"/docs/codin\"",
      "suggestion": "/docs/coding",
      "suggestionConfidence": "high" // high | medium | low | none — drives the fix decision
    }
  ]
}
```

`suggestionConfidence` is the signal for whether to auto-fix. Only `broken`
findings fail the gate; `warning` and `skipped` never do.

## Auto-fix decision rules

**Confident — apply the `suggestion`, then re-run to confirm:**

- `category: "malformed"` (link target wrapped in backticks) — strip the backticks.
- `category: "internal"`, `status: "broken"`, `suggestionConfidence: "high"` with a
  single unambiguous match (including trailing-slash / case normalization, or an
  obvious typo like `/docs/codin` → `/docs/coding`).

**Report-only — never auto-edit; surface for a human:**

- `category: "external"`, `status: "broken"` — could be the remote's fault or a
  transient outage; confirm before touching content.
- `category: "relative"` — points at a repo file (e.g. `deploy/README.md`); intended
  for GitHub, not the site. Leave it unless the human says otherwise.
- `suggestionConfidence: "medium" | "low" | "none"`, or multiple tied candidates —
  present the options and ask.
- `category: "dynamic-skipped"` and `category: "anchor"` — nothing to fix; the
  checker can't verify these (see Coverage).

## Re-run to verify

After applying fixes, run `bun run lint:links` again and show the result. Do not
declare success until it exits 0, or until every remaining finding is a deliberate
`warning`/`skipped` you've explained. Never claim green without the re-run.

## Coverage & limits

- **Dynamic links are skipped by design.** `href={expr}` / `src={expr}` expressions
  (including the shared link constants used as `href={GITHUB_URL}`) can't be
  statically resolved and are reported as `dynamic-skipped`. The URLs _behind_ those
  constants are still checked separately: the checker reads external URL string
  literals (e.g. `export const GITHUB_URL = "https://…"` in `components/links.js`),
  so the `--external` sweep covers them. Coverage is intentionally partial — check
  the `dynamic-skipped` count so nobody assumes 100%.
- **Anchors are not statically verifiable.** App Router JSX/MDX headings get no
  auto-generated `id`s (there is no rehype-slug step), so a `#fragment` is reported
  `skipped`. The path portion of `/path#fragment` is still validated.
- **Dynamic routes** (`app/blog/[slug]/page.js`, `[...catch-all]`) are recognized as
  valid route templates; concrete `/blog/<slug>` links match them. A path that
  matches no static route and no template still fails.
- **Static assets** under `public/` (e.g. `/images/logo.png`, `/favicon.ico`) are
  treated as valid.
- Only `href`/`src` string-literal attributes, external URL string literals, and
  markdown links are scanned. Other string literals (class names, metadata keys,
  etc.) are intentionally ignored to avoid false positives.

## Maintaining the checker

When routing or asset conventions change (a new App Router segment style, a new
content directory, a new link-constant convention), update `scripts/check-links.mjs`:
the valid-target model is built in `buildModel()` / `routeFromAppFile()`, link
extraction lives in `scanCodeFile` / `scanMarkdownFile`, and classification in
`validateTarget`. Keep route derivation in sync with Next.js App Router rules.

When you add or change this skill, update the Skills table in `AGENTS.md`.
