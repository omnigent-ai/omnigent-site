import Link from "next/link";
import { getReleases } from "@/lib/releases";

export const metadata = {
  title: "Releases",
  description:
    "What's new in each version of Omnigent — release highlights, version by version.",
};

export default function ReleasesIndex() {
  const releases = getReleases();
  return (
    <>
      <h1>Releases</h1>
      <p>
        Highlights for each version of Omnigent. For the granular, per-change
        log see{" "}
        <a href="https://github.com/omnigent-ai/omnigent/blob/main/CHANGELOG.md">
          CHANGELOG.md
        </a>
        .
      </p>
      {releases.length === 0 ? (
        <p>No releases published yet.</p>
      ) : (
        <ul className="releases-list">
          {releases.map((release) => (
            <li key={release.version} style={{ marginBottom: "1rem" }}>
              <Link href={release.href}>
                <strong>v{release.version}</strong>
              </Link>
              {release.date ? (
                <span style={{ opacity: 0.6 }}> — {release.date}</span>
              ) : null}
              {release.blurb ? (
                <div style={{ opacity: 0.8 }}>{release.blurb}</div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
