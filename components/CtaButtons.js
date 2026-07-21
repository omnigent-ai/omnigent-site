import Link from "next/link";
import { RocketIcon, AppleIcon, DiscordIcon } from "@/components/icons";
import { DISCORD_URL } from "@/components/links";

// Get Started (purple, primary) · macOS App (white) · Join Discord (white).
// The macOS button routes into the Get Started flow rather than downloading
// directly, so everyone starts from the same install path.
export default function CtaButtons() {
  return (
    <div className="hero-cta">
      <Link href="/quickstart/install" className="btn btn-primary">
        <RocketIcon size={16} /> Get Started
      </Link>
      <Link href="/quickstart/install#add-the-macos-app" className="btn">
        <AppleIcon size={16} /> macOS App
      </Link>
      <Link href="/docs/interact/mobile#ios-app" className="btn">
        <AppleIcon size={16} /> iOS App
      </Link>
      <a href={DISCORD_URL} className="btn" target="_blank" rel="noreferrer">
        <DiscordIcon /> Join Discord
      </a>
    </div>
  );
}
