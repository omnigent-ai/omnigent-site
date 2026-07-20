"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { groupReleasesByMonth } from "@/lib/group-releases";

// Mirrors the docs sidebar styling (.docs-side) but lists release versions,
// which are discovered at build time and passed in from the layout. Versions
// are grouped under "Month Year" headings derived from each release's date.
export default function ReleasesSidebar({ releases }) {
  const path = usePathname();
  const groups = groupReleasesByMonth(releases);
  return (
    <aside className="docs-side">
      <h4>Releases</h4>
      <ul>
        <li>
          <Link
            href="/releases"
            className={path === "/releases" ? "active" : ""}
          >
            All releases
          </Link>
        </li>
      </ul>
      {groups.map((group) => (
        <div key={group.label} className="releases-group">
          <h5>{group.label}</h5>
          <ul>
            {group.releases.map((release) => (
              <li key={release.version}>
                <Link
                  href={release.href}
                  className={path === release.href ? "active" : ""}
                >
                  v{release.version}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
