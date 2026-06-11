import Link from "next/link";
import { GitHubIcon, DiscordIcon } from "./icons";
import { GITHUB_URL, DISCORD_URL } from "./links";

export default function Nav() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="" width={26} height={26} />
          omnigent
        </Link>
        <nav className="nav-links">
          <Link href="/quickstart/installing" className="nav-link hide-sm">Quickstart</Link>
          <a href={DISCORD_URL} className="btn" target="_blank" rel="noreferrer">
            <DiscordIcon /> Discord
          </a>
          <a href={GITHUB_URL} className="btn btn-primary" target="_blank" rel="noreferrer">
            <GitHubIcon /> GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
