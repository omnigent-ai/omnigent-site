import { GitHubIcon, AppleIcon, DiscordIcon } from "@/components/icons";
import { GITHUB_URL, DISCORD_URL, MACOS_DOWNLOAD_URL } from "@/components/links";

// GitHub (white) · Download macOS App (purple) · Join Discord (white)
export default function CtaButtons() {
  return (
    <div className="hero-cta">
      <a href={GITHUB_URL} className="btn" target="_blank" rel="noreferrer">
        <GitHubIcon /> GitHub
      </a>
      <a href={MACOS_DOWNLOAD_URL} className="btn btn-primary">
        <AppleIcon size={16} /> Download macOS App
      </a>
      <a href={DISCORD_URL} className="btn" target="_blank" rel="noreferrer">
        <DiscordIcon /> Join Discord
      </a>
    </div>
  );
}
