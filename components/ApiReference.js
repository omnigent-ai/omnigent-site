"use client";

// Scalar's stylesheet. The component imports this internally, but that
// side-effect import is invisible to Next's CSS pipeline when the
// component is pulled in through a next/dynamic `.then()` factory
// (below) — so the styles never get bundled and the reference renders
// unstyled. Importing it explicitly here, in a Client Component that's
// statically reachable from the /reference route, makes Next emit it
// into that route's CSS chunk (and only that route's).
import "@scalar/api-reference-react/style.css";

// Scalar API reference, embedded as a client-only island. Scalar's
// renderer is a Vue app under the hood and its SSR path is untested, so
// we load it via next/dynamic with `ssr: false` (allowed here because
// this file is a Client Component). It owns its own three-panel layout
// and endpoint sidebar; the surrounding site chrome (Nav/Footer) comes
// from app/reference/layout.js.
import dynamic from "next/dynamic";

const ApiReferenceReact = dynamic(
  () => import("@scalar/api-reference-react").then((m) => m.ApiReferenceReact),
  { ssr: false },
);

// Map the site's brand tokens (app/globals.css) onto Scalar's
// `--scalar-*` variables. We define them under `.light-mode` and
// `.dark-mode` — the same selectors Scalar toggles — so the reference
// follows the OS color scheme exactly like the rest of the site (which
// is driven by `prefers-color-scheme`). `theme: "none"` below disables
// Scalar's preset themes so these values win.
const BRAND_CSS = `
.light-mode {
  --scalar-color-1: #15131a;
  --scalar-color-2: #5c5765;
  --scalar-color-3: #8c8694;
  --scalar-color-accent: #ed1c9c;
  --scalar-background-1: #ffffff;
  --scalar-background-2: #faf7f9;
  --scalar-background-3: #f6f3f7;
  --scalar-background-accent: #fce6f4;
  --scalar-border-color: #ece8ee;

  --scalar-sidebar-background-1: #faf7f9;
  --scalar-sidebar-color-1: #15131a;
  --scalar-sidebar-color-2: #5c5765;
  --scalar-sidebar-border-color: #ece8ee;
  --scalar-sidebar-item-hover-background: #f6f3f7;
  --scalar-sidebar-item-hover-color: #15131a;
  --scalar-sidebar-item-active-background: #fce6f4;
  --scalar-sidebar-color-active: #ad0c72;
  --scalar-sidebar-search-background: #ffffff;
  --scalar-sidebar-search-border-color: #ece8ee;
}
.dark-mode {
  --scalar-color-1: #f4eef2;
  --scalar-color-2: #a59faf;
  --scalar-color-3: #7c7686;
  --scalar-color-accent: #ff4fb3;
  --scalar-background-1: #15131a;
  --scalar-background-2: #1f1b27;
  --scalar-background-3: #221d2b;
  --scalar-background-accent: #3a1f30;
  --scalar-border-color: #322c3b;

  --scalar-sidebar-background-1: #1f1b27;
  --scalar-sidebar-color-1: #f4eef2;
  --scalar-sidebar-color-2: #a59faf;
  --scalar-sidebar-border-color: #322c3b;
  --scalar-sidebar-item-hover-background: #221d2b;
  --scalar-sidebar-item-hover-color: #f4eef2;
  --scalar-sidebar-item-active-background: #3a1f30;
  --scalar-sidebar-color-active: #ff8acb;
  --scalar-sidebar-search-background: #15131a;
  --scalar-sidebar-search-border-color: #322c3b;
}
.light-mode, .dark-mode {
  --scalar-font: system-ui, sans-serif;
  --scalar-radius: 10px;
}
`;

export default function ApiReference() {
  return (
    <ApiReferenceReact
      configuration={{
        // Fetched client-side from the committed static asset
        // (public/openapi.json), kept in sync with the omnigent repo
        // by the sync-openapi-to-site CI workflow.
        url: "/openapi.json",
        theme: "none",
        layout: "modern",
        // Read-only reference: no live "Try it" client (the server is
        // self-hosted with cookie/proxy auth, so cross-origin requests
        // from a public docs site would mostly fail). Per-language code
        // samples still render. This also hides the auth panel.
        hideTestRequestButton: true,
        // The rest of the site has no manual theme switch — it follows
        // the OS scheme — so hide Scalar's toggle to match.
        hideDarkModeToggle: true,
        // Disable Scalar's hosted "Ask AI" agent and the "Generate MCP"
        // install button. Both default to on for local URLs (which is why
        // they appear in local dev), and "Ask AI" ships the OpenAPI doc +
        // the question to Scalar's hosted service — not something we want
        // on a self-hosted, read-only reference.
        agent: { disabled: true },
        mcp: { disabled: true },
        // Hide the "Open API Client" launcher — it opens client.scalar.com
        // with this spec URL (another hosted surface we don't need).
        hideClientButton: true,
        // The "Developer Tools / Configure / Share / Deploy" toolbar
        // defaults to rendering only on local URLs (isLocalUrl), so it
        // would show on localhost dev/preview. The code ships in the
        // bundle regardless — it's runtime-gated, not build-stripped — so
        // force it off everywhere to be explicit.
        showDeveloperTools: "never",
        customCss: BRAND_CSS,
      }}
    />
  );
}
