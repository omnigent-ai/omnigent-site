import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { siteUrl } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Omnigent — a meta-harness for building and running AI agents",
    template: "%s · Omnigent",
  },
  description:
    "Omnigent is an open-source meta-harness: a common layer for composing, governing, and collaborating on AI agents — coding and otherwise — on top of the harnesses you already use.",
  openGraph: {
    // title/description intentionally omitted so they fall back to each page's
    // resolved (templated) title + description, making child-page cards specific.
    url: siteUrl,
    siteName: "Omnigent",
    type: "website",
    images: [
      {
        url: `${siteUrl}/images/omnigent-social-card.png`,
        width: 1200,
        height: 630,
        alt: "Omnigent — a meta-harness for AI agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${siteUrl}/images/omnigent-social-card.png`],
  },
  icons: {
    icon: "/images/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
