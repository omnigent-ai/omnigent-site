import Link from "next/link";
import { GitHubIcon, DiscordIcon } from "./icons";
import { GITHUB_URL, DISCORD_URL } from "./links";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="theme-light-only" src="/images/logo.svg" alt="Omnigent" height={28} width={145} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="theme-dark-only" src="/images/logo-dark.svg" alt="Omnigent" height={28} width={145} />
        </Link>
        <nav className="nav-links">
          <Link href="/quickstart/install" className="nav-link hide-sm">Docs</Link>
          <a href={GITHUB_URL} className="nav-icon" target="_blank" rel="noreferrer" aria-label="GitHub">
            <GitHubIcon size={20} />
          </a>
          <a href={DISCORD_URL} className="nav-icon" target="_blank" rel="noreferrer" aria-label="Discord">
            <DiscordIcon size={20} />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
