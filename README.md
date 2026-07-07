# Omnigent website

A minimal marketing + docs site for [Omnigent](https://github.com/omnigent-ai/omnigent),
built with Next.js (App Router).

## Develop

This project uses [Bun](https://bun.sh) as its package manager and runner.

```bash
bun install
bun run dev      # http://localhost:3000
```

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

- `RESEND_API_KEY` — used by `app/api/waitlist/route.js` to send waitlist
  confirmation emails via [Resend](https://resend.com). Create a key in the
  Resend dashboard, verify the sending domain (`omnigent.ai`) under
  **Domains**, then add the key in the Vercel dashboard (Project Settings →
  Environment Variables) for each deployment environment. No `.env` file is
  committed — env vars are managed entirely through Vercel.

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
- `app/api/waitlist/route.js` — waitlist signup endpoint (sends a confirmation
  email via Resend).
- `public/images/` — `architecture.png`, `sandbox.png`, `logo.png`, `hero.png`.

Edit the GitHub / Discord / package links in `components/links.js`.

## Deploy

Push to a Git repo and import it into Vercel — it auto-detects Next.js, no
configuration needed.
