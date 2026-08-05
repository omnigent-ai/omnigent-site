import Link from "next/link";
import {
  RocketIcon,
  AppleIcon,
  AndroidIcon,
  DiscordIcon,
} from "@/components/icons";
import { DISCORD_URL } from "@/components/links";

// Get Started (purple, primary) · macOS App (white) · iOS App (white) · Android App (white) · Join Discord (white).
// The macOS button links to the desktop app reference page (/docs/interact/desktop).
export default function CtaButtons() {
  return (
    <div className="hero-cta">
      <Link href="/quickstart/install" className="btn btn-primary">
        <RocketIcon size={16} /> Get Started
      </Link>
      <Link href="/docs/interact/desktop" className="btn">
        <AppleIcon size={16} /> macOS App
      </Link>
      <Link href="/docs/interact/mobile#ios-app" className="btn">
        <AppleIcon size={16} /> iOS App
      </Link>
      <Link href="/docs/interact/mobile#android-app" className="btn">
        <AndroidIcon size={16} /> Android App
      </Link>
      <a href={DISCORD_URL} className="btn" target="_blank" rel="noreferrer">
        <DiscordIcon /> Join Discord
      </a>
    </div>
  );
}
