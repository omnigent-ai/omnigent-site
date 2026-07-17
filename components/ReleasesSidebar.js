"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Mirrors the docs sidebar styling (.docs-side) but lists release versions,
// which are discovered at build time and passed in from the layout.
export default function ReleasesSidebar({ releases }) {
  const path = usePathname();
  return (
    <aside className="docs-side">
      <h4>Releases</h4>
      <ul>
        {releases.map((release) => (
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
    </aside>
  );
}
