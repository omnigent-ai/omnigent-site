// Base URL for absolute metadata URLs. Override with NEXT_PUBLIC_SITE_URL when
// testing share previews through a tunnel (e.g. cloudflared) so scrapers can
// reach the og:image. Falls back to production.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://omnigent.ai";
