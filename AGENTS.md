# AGENTS.md

Guidance for AI coding agents working in this repository. Read this at the start of every session.

## Project

Omnigent website — a minimal marketing + docs site built with Next.js (App Router). See `README.md` for develop/build/deploy details and the directory layout.

This project uses [Bun](https://bun.sh) as its package manager and runner — use `bun install` / `bun run <script>` rather than `npm`. The `bun.lock` lockfile is committed.

## Rules

All rules in `.agents/rules/` are part of the working agreement and must be followed for every task. Load and apply them at the start of each session.

- [`.agents/rules/branching-rule.mdc`](.agents/rules/branching-rule.mdc) — **Branching workflow.** All work must happen on a dedicated feature branch; never commit directly to `main`. Before making any change, check the current branch and, if on `main`, create a new branch (`feat/`, `fix/`, `chore/`, `refactor/`, or `test/` prefix) using `git checkout -b`. Offer the user a suggested branch name and the option to provide their own.
- [`.agents/rules/bun-clean-lock-rule.mdc`](.agents/rules/bun-clean-lock-rule.mdc) — **bun.lock proxy stripping.** Before opening any PR, clear private npm registry proxy URLs from the resolution field of `bun.lock` (reset to `""`). Run `bun run strip-lock-proxy` to clean and `bun run strip-lock-proxy:check` to verify. A committed pre-commit hook at `.githooks/pre-commit` (activate via `bun run setup-hooks`) automates this whenever `bun.lock` is staged.

When new rules are added to `.agents/rules/`, treat them as always-on guidance and add a reference here.
