# Omnigent website

A minimal marketing + docs site for [Omnigent](https://github.com/Omnigent/Omnigent),
built with Next.js (App Router).

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build

```bash
npm run build
npm run start
```

## Structure

- `app/page.js` — homepage (hero, architecture, the three pillars, quick start).
- `app/docs/*` — six docs pages: installing, coding, custom-agent, policies,
  sandboxes, deploying.
- `components/` — nav, footer, copyable command, docs sidebar, icons, links.
- `public/images/` — `architecture.png`, `sandbox.png`, `logo.png`, `hero.png`.

Edit the GitHub / Discord / package links in `components/links.js`.

## Deploy

Push to a Git repo and import it into Vercel — it auto-detects Next.js, no
configuration needed.
