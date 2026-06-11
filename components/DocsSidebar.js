"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGES = [
  { href: "/quickstart/installing", label: "Installing" },
  { href: "/quickstart/coding", label: "Running a coding agent" },
  { href: "/quickstart/custom-agent", label: "Writing a custom agent" },
  { href: "/quickstart/policies", label: "Policies" },
  { href: "/quickstart/sandboxes", label: "Sandboxes" },
  { href: "/quickstart/deploying", label: "Deploying the server" },
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
