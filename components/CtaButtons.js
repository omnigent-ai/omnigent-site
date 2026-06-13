import Link from "next/link";
import { RocketIcon, DiscordIcon } from "@/components/icons";
import { DISCORD_URL } from "@/components/links";

// Get Started (white) · Download macOS App (purple) · Join Discord (white)
export default function CtaButtons() {
  return (
    <div className="hero-cta">
      <Link href="/quickstart/install" className="btn btn-primary">
        <RocketIcon size={16} /> Get Started
      </Link>
      <a href={DISCORD_URL} className="btn" target="_blank" rel="noreferrer">
        <DiscordIcon /> Join Discord
      </a>
    </div>
  );
}
