# Omnigent website

A minimal marketing + docs site for [Omnigent](https://github.com/Omnigent/Omnigent),
built with Next.js (App Router).

## Develop

This project uses [Bun](https://bun.sh) as its package manager and runner.

```bash
bun install
bun run dev      # http://localhost:3000
```

## Build

```bash
bun run build
bun run start
```

## Before Pushing to Github
> Note: This will help maintain good developer hygiene
```bash
bun run lint
bun run strip-lock-proxy && bun run strip-lock-proxy:check
bun run lint:links
```

## Structure

- `app/page.js` — homepage (hero, architecture, the three pillars, quick start).
- `app/quickstart/*` — six quickstart pages: installing, coding, custom-agent, policies,
  sandboxes, deploying.
- `components/` — nav, footer, copyable command, quickstart sidebar, icons, links.
- `public/images/` — `architecture.png`, `sandbox.png`, `logo.png`, `hero.png`.

Edit the GitHub / Discord / package links in `components/links.js`.

## Deploy

Push to a Git repo and import it into Vercel — it auto-detects Next.js, no
configuration needed.
