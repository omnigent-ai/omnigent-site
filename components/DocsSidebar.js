"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGES = [
  { href: "/quickstart/intro", label: "Introduction" },
  { href: "/quickstart/install", label: "Install Omnigent" },
  { href: "/quickstart/coding-agent", label: "Coding Agent Quickstart" },
  { href: "/quickstart/custom-omnigent", label: "Custom Omnigent Quickstart" },
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
