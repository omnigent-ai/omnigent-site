# AGENTS.md

Guidance for AI coding agents working in this repository. Read this at the start of every session.

## Project

Omnigent website — a minimal marketing + docs site built with Next.js (App Router). See `README.md` for develop/build/deploy details and the directory layout.

## Rules

All rules in `.agents/rules/` are part of the working agreement and must be followed for every task. Load and apply them at the start of each session.

- [`.agents/rules/branching-rule.mdc`](.agents/rules/branching-rule.mdc) — **Branching workflow.** All work must happen on a dedicated feature branch; never commit directly to `main`. Before making any change, check the current branch and, if on `main`, create a new branch (`feat/`, `fix/`, `chore/`, `refactor/`, or `test/` prefix) using `git checkout -b`. Offer the user a suggested branch name and the option to provide their own.

When new rules are added to `.agents/rules/`, treat them as always-on guidance and add a reference here.
