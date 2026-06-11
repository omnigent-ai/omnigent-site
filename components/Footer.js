import Link from "next/link";
import { GitHubIcon, DiscordIcon } from "./icons";
import { GITHUB_URL, DISCORD_URL, DATABRICKS_URL, NEON_URL } from "./links";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <span>
          Built by the{" "}
          <a href={DATABRICKS_URL} target="_blank" rel="noreferrer">Databricks AI team</a>{" "}
          and <a href={NEON_URL} target="_blank" rel="noreferrer">Neon</a>.
        </span>
        <span className="spacer" />
        <Link href="/quickstart/install">Quickstart</Link>
        <a href={DISCORD_URL} target="_blank" rel="noreferrer">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <DiscordIcon size={15} /> Discord
          </span>
        </a>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <GitHubIcon size={15} /> GitHub
          </span>
        </a>
        <span className="muted">Apache 2.0 · Alpha</span>
      </div>
    </footer>
  );
}
