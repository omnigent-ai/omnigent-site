"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const SECTIONS = [
  {
    title: "Build Your Omnigent",
    pages: [
      { href: "/docs/build/overview", label: "Overview" },
    ],
    subsections: [
      {
        title: "Config Reference",
        collapsed: true,
        pages: [
          { href: "/docs/build/harnesses", label: "Harnesses" },
          { href: "/docs/build/models", label: "Models & Credentials" },
          { href: "/docs/build/prompts", label: "Prompts & Skills" },
          { href: "/docs/build/tools", label: "MCP & Tools" },
          { href: "/docs/build/policies", label: "Policies" },
        ],
      },
    ],
  },
  {
    title: "Set Omnigent Policies",
    pages: [
      { href: "/docs/policies/overview", label: "Overview" },
      { href: "/docs/policies/builtin", label: "Builtin Policies" },
      { href: "/docs/policies/custom", label: "Custom Policies" },
      { href: "/docs/policies/os-sandbox", label: "OS Sandbox" },
    ],
  },
  {
    title: "Interact with Your Omnigent",
    pages: [
      { href: "/docs/interact/overview", label: "Overview" },
      { href: "/docs/interact/terminal", label: "Terminal" },
      { href: "/docs/interact/web-ui", label: "Web UI" },
      { href: "/docs/interact/mobile", label: "Mobile" },
      { href: "/docs/interact/desktop", label: "Desktop App" },
    ],
  },
  {
    title: "Deploy Your Omnigent",
    pages: [
      { href: "/docs/deploy/overview", label: "Overview" },
      { href: "/docs/deploy/database", label: "Database" },
      { href: "/docs/deploy/docker", label: "Docker" },
      { href: "/docs/deploy/cloud", label: "Cloud Platforms" },
      { href: "/docs/deploy/cloud-sandbox", label: "Cloud Sandbox" },
    ],
  },
  {
    title: "Collaborate with Your Team",
    pages: [
      { href: "/docs/collaborate/overview", label: "Overview" },
      { href: "/docs/collaborate/auth", label: "Auth & SSO" },
    ],
  },
];

function allHrefs(section) {
  const hrefs = section.pages.map((p) => p.href);
  if (section.subsections) {
    section.subsections.forEach((s) => s.pages.forEach((p) => hrefs.push(p.href)));
  }
  return hrefs;
}

export default function DocsSidebarFull() {
  const path = usePathname();

  const [sectionOpen, setSectionOpen] = useState(() =>
    SECTIONS.reduce((acc, s, i) => {
      acc[i] = true;
      return acc;
    }, {})
  );

  const [subOpen, setSubOpen] = useState(() => {
    const state = {};
    SECTIONS.forEach((s, si) => {
      if (s.subsections) {
        s.subsections.forEach((sub, ci) => {
          const key = `${si}-${ci}`;
          state[key] = !sub.collapsed || sub.pages.some((p) => p.href === path);
        });
      }
    });
    return state;
  });

  return (
    <aside className="docs-side" style={{ maxHeight: "calc(100vh - 4.5rem)", overflowY: "auto", overflowX: "hidden" }}>
      {SECTIONS.map((section, si) => {
        const isOpen = sectionOpen[si];

        return (
          <div key={section.title}>
            <h4
              onClick={() => setSectionOpen((o) => ({ ...o, [si]: !o[si] }))}
              style={{ cursor: "pointer", userSelect: "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              {section.title}
              <span style={{ fontSize: "0.55rem", opacity: 0.4, transition: "transform 0.15s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>
                ▶
              </span>
            </h4>

            {isOpen && (
              <ul>
                {section.pages.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href} className={path === p.href ? "active" : ""}>
                      {p.label}
                    </Link>
                  </li>
                ))}

                {section.subsections && section.subsections.map((sub, ci) => {
                  const subKey = `${si}-${ci}`;
                  const subIsOpen = subOpen[subKey];

                  return (
                    <li key={sub.title} style={{ listStyle: "none" }}>
                      <span
                        onClick={() => setSubOpen((o) => ({ ...o, [subKey]: !o[subKey] }))}
                        role="button"
                        tabIndex={0}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "0.25rem 0.6rem", borderRadius: "7px", fontSize: "0.9rem", color: "var(--fg-soft)" }}
                      >
                        {sub.title}
                        <span style={{ fontSize: "0.5rem", opacity: 0.4, transition: "transform 0.15s", transform: subIsOpen ? "rotate(90deg)" : "rotate(0deg)" }}>
                          ▶
                        </span>
                      </span>
                      {subIsOpen && (
                        <ul style={{ paddingLeft: "0.6rem", marginBottom: "0.3rem" }}>
                          {sub.pages.map((p) => (
                            <li key={p.href}>
                              <Link href={p.href} className={path === p.href ? "active" : ""}>
                                {p.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </aside>
  );
}
