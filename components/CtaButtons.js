import Link from "next/link";
import { GitHubIcon, DiscordIcon } from "@/components/icons";
import { GITHUB_URL, DISCORD_URL } from "@/components/links";

// GitHub (white) · Get Started (purple) · Join Discord (white)
export default function CtaButtons() {
  return (
    <div className="hero-cta">
      <a href={GITHUB_URL} className="btn" target="_blank" rel="noreferrer">
        <GitHubIcon /> GitHub
      </a>
      <Link href="/quickstart/install" className="btn btn-primary">
        Get Started
      </Link>
      <a href={DISCORD_URL} className="btn" target="_blank" rel="noreferrer">
        <DiscordIcon /> Join Discord
      </a>
    </div>
  );
}
