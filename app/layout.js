import { Lato, Playfair_Display } from "next/font/google";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${lato.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
