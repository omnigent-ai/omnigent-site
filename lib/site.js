// Canonicals must identify production, even when social previews use a tunnel.
export const productionSiteUrl = "https://omnigent.ai";

// Base URL for social metadata and assets. Override with NEXT_PUBLIC_SITE_URL
// when testing share previews through a tunnel (e.g. cloudflared) so scrapers
// can reach the og:image. This override must not affect canonical URLs.
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || productionSiteUrl;
