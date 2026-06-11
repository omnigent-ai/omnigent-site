import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://omnigent.ai"),
  title: {
    default: "Omnigent — a meta-harness for building and running AI agents",
    template: "%s · Omnigent",
  },
  description:
    "Omnigent is an open-source meta-harness: a common layer for composing, governing, and collaborating on AI agents — coding and otherwise — on top of the harnesses you already use.",
  openGraph: {
    title: "Omnigent",
    description:
      "An open-source meta-harness for building and running AI agents. Compose harnesses, govern them with policies, and share live sessions.",
    type: "website",
  },
  icons: {
    icon: "/images/favicon.svg",
  },
};

// Runs before first paint to set the saved theme on <html>, preventing a
// flash of the wrong theme. Default is light when the user has never chosen
// (only an explicit "auto" follows the OS via the prefers-color-scheme query).
const themeInit = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',(t==='light'||t==='dark'||t==='auto')?t:'light');}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
