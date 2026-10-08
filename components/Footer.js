import Link from "next/link";
import {
  GitHubIcon,
  DiscordIcon,
  XIcon,
  LinkedInIcon,
  YouTubeIcon,
  PyPIIcon,
} from "./icons";
import {
  GITHUB_URL,
  DISCORD_URL,
  X_URL,
  LINKEDIN_URL,
  YOUTUBE_URL,
  PYPI_URL,
} from "./links";

// Icon-only profile links, shown after GitHub and Discord. Their URLs are the
// same constants the JSON-LD `sameAs` lists use (lib/structured-data.js).
export const FOOTER_PROFILE_LINKS = [
  { href: X_URL, label: "Omnigent on X", Icon: XIcon },
  { href: LINKEDIN_URL, label: "Omnigent on LinkedIn", Icon: LinkedInIcon },
  { href: YOUTUBE_URL, label: "Omnigent on YouTube", Icon: YouTubeIcon },
  { href: PYPI_URL, label: "Omnigent on PyPI", Icon: PyPIIcon },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap-wide footer-inner">
        <span>
          Built by the Databricks AI team, Neon and the Omnigent Contributors.
        </span>
        <span className="spacer" />
        <Link href="/quickstart/install">Get Started</Link>
        <Link href="/docs/use/coding-agents">Docs</Link>
        <Link href="/privacy">Privacy</Link>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          <span className="footer-icon-link">
            <GitHubIcon size={15} /> GitHub
          </span>
        </a>
        <a href={DISCORD_URL} target="_blank" rel="noreferrer">
          <span className="footer-icon-link">
            <DiscordIcon size={15} /> Discord
          </span>
        </a>
        <span className="footer-profiles">
          {FOOTER_PROFILE_LINKS.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              title={label}
            >
              <Icon size={15} />
            </a>
          ))}
        </span>
        <span className="muted">Apache 2.0</span>
      </div>
    </footer>
  );
}
