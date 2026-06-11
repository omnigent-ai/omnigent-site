import Link from "next/link";
import { GitHubIcon, DiscordIcon } from "./icons";
import { GITHUB_URL, DISCORD_URL } from "./links";

export default function Nav() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.svg" alt="Omnigent" height={28} width={145} />
        </Link>
        <nav className="nav-links">
          <Link href="/quickstart/install" className="nav-link hide-sm">Get Started</Link>
          <Link href="/docs" className="nav-link hide-sm">Docs</Link>
          <a href={GITHUB_URL} className="nav-icon" target="_blank" rel="noreferrer" aria-label="GitHub">
            <GitHubIcon size={20} />
          </a>
          <a href={DISCORD_URL} className="nav-icon" target="_blank" rel="noreferrer" aria-label="Discord">
            <DiscordIcon size={20} />
          </a>
        </nav>
      </div>
    </header>
  );
}
