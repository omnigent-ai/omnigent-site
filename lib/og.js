import { siteUrl } from "./site";

// Card design version. The generated /og image is cached immutably by the CDN,
// keyed by its URL. Page text changes bust the cache on their own (the text is
// in the URL), but DESIGN changes (app/og/route.js, background, fonts, colors)
// do not — so BUMP THIS whenever you change how the card looks to force every
// card to re-render with the new design.
const OG_VERSION = "1";

// Build the absolute URL to the dynamically-generated social card for a page.
// The card is referenced by PATH only (not free-form text): the /og route
// looks the text up in the generated manifest, so the endpoint can't be abused
// to render arbitrary words on the branded card.
export function ogImageUrl(path) {
  const params = new URLSearchParams();
  params.set("path", path || "/");
  params.set("v", OG_VERSION);
  return `${siteUrl}/og?${params.toString()}`;
}

// Metadata factory for content pages. Keeps the page title + description inline
// at the call site while wiring up a per-page social card and Twitter image.
// `path` is the route this page serves; it keys the card in the manifest.
export function pageMeta(
  title,
  description,
  { eyebrow, path, absoluteTitle = false } = {},
) {
  // og:/twitter: titles match the document <title> template ("%s · Omnigent").
  // The image itself keeps the bare title (the logo lockup carries the brand).
  const image = ogImageUrl(path);
  const pageUrl = new URL(path || "/", `${siteUrl}/`).toString();
  const socialTitle = absoluteTitle ? title : `${title} · Omnigent`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    openGraph: {
      title: socialTitle,
      description,
      url: pageUrl,
      siteName: "Omnigent",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image],
    },
  };
}
