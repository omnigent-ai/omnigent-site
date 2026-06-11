"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGES = [
  { href: "/docs/installing", label: "Installing" },
  { href: "/docs/coding", label: "Running a coding agent" },
  { href: "/docs/custom-agent", label: "Writing a custom agent" },
  { href: "/docs/policies", label: "Policies" },
  { href: "/docs/sandboxes", label: "Sandboxes" },
  { href: "/docs/deploying", label: "Deploying the server" },
];

export default function DocsSidebar() {
  const path = usePathname();
  return (
    <aside className="docs-side">
      <h4>Documentation</h4>
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
