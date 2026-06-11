"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGES = [
  { href: "/quickstart/install", label: "Install Omnigent" },
  { href: "/quickstart/debby", label: "Tutorial: Try Debby" },
  { href: "/quickstart/coding-agent", label: "Tutorial: Coding Agent" },
  { href: "/quickstart/polly", label: "Tutorial: Try Polly" },
  { href: "/quickstart/collaborate", label: "Tutorial: Collaborate" },
  { href: "/quickstart/policies", label: "Tutorial: Contextual Policies" },
];

export default function DocsSidebar() {
  const path = usePathname();
  return (
    <aside className="docs-side">
      <h4>Quickstart</h4>
      <ul>
        {PAGES.map((p) => (
          <li key={p.href}>
            <Link href={p.href} className={path === p.href ? "active" : ""}>
              {p.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
