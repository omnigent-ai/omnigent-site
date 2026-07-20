"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  filterRecentReleases,
  groupReleasesByMonth,
} from "@/lib/group-releases";
import TableOfContents from "@/components/TableOfContents";

// Must match the slug logic in HeadingAnchors so the ToC links resolve to the
// per-release <h1> ids it assigns (e.g. "v0.5.0" -> "v050").
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// On the /releases feed the ToC lists every release (grouped by month) linking
// to that post; on an individual /releases/<version> page it falls back to the
// shared heading-scanning ToC so readers get the post's section outline.
export default function ReleasesToc({ releases }) {
  const pathname = usePathname();
  const isFeed = pathname === "/releases";
  const [activeId, setActiveId] = useState(null);

  // Mirror the feed page: only the last 6 months of releases are stacked there,
  // so the ToC lists exactly those. (The sidebar still shows every version.)
  const feedReleases = filterRecentReleases(releases);
  const groups = groupReleasesByMonth(
    feedReleases.map((r) => ({ ...r, slug: slugify(`v${r.version}`) })),
  );

  useEffect(() => {
    if (!isFeed) return;
    const ids = feedReleases.map((r) => slugify(`v${r.version}`));

    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveId(ids[ids.length - 1]);
        return;
      }
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        // 96px ≈ sticky nav plus the headings' 5rem scroll-margin-top
        if (el && el.getBoundingClientRect().top <= 96) current = id;
      }
      setActiveId(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isFeed, releases]);

  if (!isFeed) return <TableOfContents />;
  if (releases.length === 0) return null;

  return (
    <nav className="docs-toc" aria-label="On this page">
      <ul>
        {groups.map((group) => (
          <li key={group.label} className="toc-group">
            <span className="toc-group-label">{group.label}</span>
            <ul>
              {group.releases.map((release) => (
                <li key={release.version}>
                  <a
                    href={`#${release.slug}`}
                    className={release.slug === activeId ? "active" : undefined}
                  >
                    v{release.version}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
