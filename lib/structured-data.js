import { productionSiteUrl } from "./site";
import { DISCORD_URL, EVENTS_URL, GITHUB_URL } from "@/components/links";

// schema.org JSON-LD builders. Descriptive claims must match the site's
// content; identity links must be confirmed official profiles.
// Pages reference the shared Organization / WebSite / SoftwareApplication
// entities by @id instead of repeating them. Their URLs always identify
// production, even when social previews use a preview or tunnel host.

export const ORGANIZATION_ID = `${productionSiteUrl}/#organization`;
export const WEBSITE_ID = `${productionSiteUrl}/#website`;
const SOFTWARE_ID = `${productionSiteUrl}/#software`;

const DESCRIPTION =
  "Omnigent is an open-source meta-harness: a common layer for composing, governing, and collaborating on AI agents — coding and otherwise — on top of the harnesses you already use.";

// Official Omnigent profiles (confirmed by the Omnigent team, 2026-10-06).
const ORGANIZATION_PROFILES = [
  "https://github.com/omnigent-ai",
  "https://x.com/omnigent_ai",
  "https://www.linkedin.com/company/omnigent-ai/",
  "https://www.youtube.com/@omnigent_ai",
  DISCORD_URL,
  EVENTS_URL,
];

// Listings that identify the software itself.
const SOFTWARE_LISTINGS = [
  GITHUB_URL,
  "https://pypi.org/project/omnigent/",
  "https://apps.apple.com/us/app/omnigent/id6783102694",
  "https://play.google.com/store/apps/details?id=ai.omnigent.android",
];

export function absoluteUrl(path = "/") {
  return new URL(path, `${productionSiteUrl}/`).toString();
}

// Site-wide entities, rendered once in the root layout.
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: "Omnigent",
        url: absoluteUrl("/"),
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/images/logo.png"),
        },
        sameAs: ORGANIZATION_PROFILES,
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: "Omnigent",
        url: absoluteUrl("/"),
        inLanguage: "en",
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };
}

// The software itself, rendered on the homepage. `version` is the newest
// release folder under app/releases (see lib/releases.js).
export function softwareApplication({ version } = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": SOFTWARE_ID,
    name: "Omnigent",
    description: DESCRIPTION,
    url: absoluteUrl("/"),
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows, iOS, Android",
    ...(version ? { softwareVersion: version } : {}),
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": ORGANIZATION_ID },
    sameAs: SOFTWARE_LISTINGS,
  };
}

// A blog post. `authorProfile` comes from lib/authors.js; posts by "omnigent"
// (or with no author) are credited to the Omnigent organization.
export function blogPosting({
  slug,
  title,
  description,
  date,
  author,
  authorProfile,
  heroArt,
}) {
  const url = absoluteUrl(`/blog/${slug}`);
  const isOrganization = !author || author.trim().toLowerCase() === "omnigent";
  const authorNode = isOrganization
    ? { "@id": ORGANIZATION_ID }
    : {
        "@type": "Person",
        name: author,
        ...(authorProfile?.href ? { url: authorProfile.href } : {}),
      };
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: title,
    ...(description ? { description } : {}),
    url,
    mainEntityOfPage: url,
    ...(date ? { datePublished: date } : {}),
    ...(heroArt ? { image: absoluteUrl(heroArt) } : {}),
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    author: authorNode,
    publisher: { "@id": ORGANIZATION_ID },
  };
}
