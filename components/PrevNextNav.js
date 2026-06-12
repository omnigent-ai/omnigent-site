"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ALL_PAGES = [
  { href: "/docs", label: "Overview", section: "" },
  { href: "/quickstart/install", label: "Install Omnigent", section: "Get Started" },
  { href: "/quickstart/coding-agent", label: "Tutorial: Coding Agent", section: "Get Started" },
  { href: "/quickstart/polly", label: "Tutorial: Polly", section: "Get Started" },
  { href: "/quickstart/collaborate", label: "Tutorial: Collaborate", section: "Get Started" },
  { href: "/quickstart/policies", label: "Tutorial: Contextual Policies", section: "Get Started" },
  { href: "/docs/use/coding-agents", label: "Coding Agents", section: "Use Omnigent" },
  { href: "/docs/use/builtin-agents", label: "Built-in Multi-AI Agents", section: "Use Omnigent" },
  { href: "/docs/use/builtin-agents/polly", label: "Polly", section: "Use Omnigent" },
  { href: "/docs/use/builtin-agents/debby", label: "Debby", section: "Use Omnigent" },
  { href: "/docs/use/custom-agents", label: "Custom Agents", section: "Use Omnigent" },
  { href: "/docs/build/harnesses", label: "Harnesses", section: "Use Omnigent" },
  { href: "/docs/build/models", label: "Models & Credentials", section: "Use Omnigent" },
  { href: "/docs/build/prompts", label: "Prompts & Skills", section: "Use Omnigent" },
  { href: "/docs/build/tools", label: "MCP & Tools", section: "Use Omnigent" },
  { href: "/docs/interact/terminal", label: "Terminal", section: "Interact" },
  { href: "/docs/interact/web-ui", label: "Web UI", section: "Interact" },
  { href: "/docs/interact/mobile", label: "Mobile", section: "Interact" },
  { href: "/docs/interact/desktop", label: "Desktop App", section: "Interact" },
  { href: "/docs/policies/overview", label: "Overview", section: "Contextual Policies" },
  { href: "/docs/policies/builtin", label: "Builtin Policies", section: "Contextual Policies" },
  { href: "/docs/policies/custom", label: "Custom Policies", section: "Contextual Policies" },
  { href: "/docs/policies/os-sandbox", label: "Omnibox", section: "Contextual Policies" },
  { href: "/docs/deploy/overview", label: "Server deployment overview", section: "Deploy" },
  { href: "/docs/collaborate", label: "Collaboration", section: "Collaborate" },
  { href: "/docs/collaborate/auth", label: "Auth & SSO", section: "Collaborate" },
  { href: "/docs/deploy/database", label: "Database", section: "Deploy" },
  { href: "/docs/deploy/cloud-sandbox-host", label: "Cloud Sandbox Host", section: "Deploy" },
];

export default function PrevNextNav() {
  const path = usePathname();
  const idx = ALL_PAGES.findIndex((p) => p.href === path);
  if (idx === -1) return null;

  const prev = idx > 0 ? ALL_PAGES[idx - 1] : null;
  const next = idx < ALL_PAGES.length - 1 ? ALL_PAGES[idx + 1] : null;

  return (
    <nav className="prev-next-nav">
      {prev ? (
        <Link href={prev.href} className="prev-next-link prev-next-link--prev">
          <span className="prev-next-dir">← Previous</span>
          <span className="prev-next-label">{prev.section ? `${prev.section}: ${prev.label}` : prev.label}</span>
        </Link>
      ) : <div />}
      {next ? (
        <Link href={next.href} className="prev-next-link prev-next-link--next">
          <span className="prev-next-dir">Next →</span>
          <span className="prev-next-label">{next.section ? `${next.section}: ${next.label}` : next.label}</span>
        </Link>
      ) : <div />}
    </nav>
  );
}
