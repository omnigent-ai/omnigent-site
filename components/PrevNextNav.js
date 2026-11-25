"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsPages } from "@/lib/docs-navigation";

export default function PrevNextNav() {
  const path = usePathname();
  const idx = docsPages.findIndex((p) => p.href === path);
  if (idx === -1) return null;

  const prev = docsPages[idx - 1];
  const next = docsPages[idx + 1];

  return (
    <nav
      className="prev-next-nav"
      aria-label="Documentation pages"
      data-pagefind-ignore
    >
      {prev ? (
        <Link href={prev.href} className="prev-next-link prev-next-link--prev">
          <span className="prev-next-dir">← Previous</span>
          <span className="prev-next-label">
            {prev.section}: {prev.label}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link href={next.href} className="prev-next-link prev-next-link--next">
          <span className="prev-next-dir">Next →</span>
          <span className="prev-next-label">
            {next.section}: {next.label}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
