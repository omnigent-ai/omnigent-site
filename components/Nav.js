import Link from "next/link";
import { GitHubIcon, DiscordIcon } from "./icons";
import { GITHUB_URL, DISCORD_URL } from "./links";
import DocSearch from "./DocSearch";

export default function Nav({ menuToggle }) {
  return (
    <header className="nav">
      <div className="nav-inner">
        {menuToggle && <div className="nav-menu-toggle">{menuToggle}</div>}
        <Link href="/" className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="theme-light-only"
            src="/images/logo.svg"
            alt="Omnigent"
            height={45}
            width={172}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="theme-dark-only"
            src="/images/logo-dark.svg"
            alt="Omnigent"
            height={45}
            width={172}
          />
        </Link>
        <nav className="nav-links">
          <Link href="/quickstart/install" className="nav-link">
            Get Started
          </Link>
          <Link href="/docs/use/coding-agents" className="nav-link">
            Docs
          </Link>
          <Link href="/reference" className="nav-link">
            API
          </Link>
          <a
            href={GITHUB_URL}
            className="nav-icon"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <GitHubIcon size={20} />
          </a>
          <a
            href={DISCORD_URL}
            className="nav-icon"
            target="_blank"
            rel="noreferrer"
            aria-label="Discord"
          >
            <DiscordIcon size={20} />
          </a>
          <DocSearch />
        </nav>
      </div>
    </header>
  );
}
