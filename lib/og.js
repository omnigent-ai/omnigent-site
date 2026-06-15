import { siteUrl } from "./site";

// Build the absolute URL to the dynamically-generated social card for a page.
// The /og route renders title + description + eyebrow onto the branded card.
export function ogImageUrl({ title, description, eyebrow }) {
  const params = new URLSearchParams();
  if (title) params.set("title", title);
  if (description) params.set("desc", description);
  if (eyebrow) params.set("eyebrow", eyebrow);
  return `${siteUrl}/og?${params.toString()}`;
}

// Metadata factory for content pages. Keeps the page title + description inline
// at the call site while wiring up a per-page social card and Twitter image.
export function pageMeta(title, description, { eyebrow } = {}) {
  // og:/twitter: titles match the document <title> template ("%s · Omnigent").
  // The image itself keeps the bare title (the logo lockup carries the brand).
  const image = ogImageUrl({ title, description, eyebrow });
  const socialTitle = `${title} · Omnigent`;
  return {
    title,
    description,
    openGraph: {
      title: socialTitle,
      description,
      url: siteUrl,
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
