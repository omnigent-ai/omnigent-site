"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useDocsSidebar } from "./DocsSidebarContext";

const SECTIONS = [
  {
    title: "Get Started",
    pages: [
      { href: "/quickstart/install", label: "Install Omnigent" },
      { href: "/quickstart/coding-agent", label: "Tutorial: Coding Agent" },
      { href: "/quickstart/polly", label: "Tutorial: Polly (Multi-AI Coding)" },
      { href: "/quickstart/collaborate", label: "Tutorial: Collaborate" },
      { href: "/quickstart/policies", label: "Tutorial: Contextual Policies" },
    ],
  },
  {
    title: "Use Cases",
    pages: [],
    subsections: [
      {
        title: "Coding Agents",
        collapsed: false,
        href: "/docs/use/coding-agents",
        pages: [],
      },
      {
        title: "Built-in Multi-AI Agents",
        collapsed: true,
        href: "/docs/use/builtin-agents",
        pages: [
          { href: "/docs/use/builtin-agents/polly", label: "Polly" },
          { href: "/docs/use/builtin-agents/debby", label: "Debby" },
        ],
      },
      {
        title: "Custom Agents",
        collapsed: true,
        href: "/docs/use/custom-agents",
        pages: [
          { href: "/docs/build/harnesses", label: "Harnesses" },
          { href: "/docs/build/models", label: "Models & Credentials" },
          { href: "/docs/build/prompts", label: "Prompts & Skills" },
          { href: "/docs/build/tools", label: "MCP & Tools" },
        ],
      },
    ],
  },
  {
    title: "Interfaces",
    pages: [
      { href: "/docs/interact/terminal", label: "Terminal" },
      { href: "/docs/interact/web-ui", label: "Web UI" },
      { href: "/docs/interact/mobile", label: "Mobile" },
      { href: "/docs/interact/desktop", label: "Desktop App" },
    ],
  },
  {
    title: "Collaboration",
    pages: [
      { href: "/docs/collaborate", label: "Pair Programming" },
      { href: "/docs/deploy/overview", label: "Shared Server" },
      { href: "/docs/collaborate/auth", label: "Auth & SSO" },
      { href: "/docs/deploy/database", label: "Database" },
      { href: "/docs/deploy/cloud-sandbox-host", label: "Cloud Sandbox Host" },
    ],
  },
  {
    title: "Contextual Policies",
    pages: [{ href: "/docs/policies/overview", label: "Overview" }],
    subsections: [
      {
        title: "Builtin Policies",
        collapsed: false,
        href: "/docs/policies/builtin",
        pages: [
          { href: "/docs/policies/builtin#safety", label: "Safety" },
          {
            href: "/docs/policies/builtin#cost-control",
            label: "Cost Control",
          },
        ],
      },
      {
        title: "Custom Policies",
        collapsed: false,
        href: "/docs/policies/custom",
        pages: [],
      },
    ],
  },
  {
    title: "Omnibox",
    pages: [
      { href: "/docs/omnibox", label: "Overview" },
      { href: "/docs/policies/os-sandbox", label: "OS Sandbox Config" },
    ],
  },
  {
    title: "Reference",
    pages: [{ href: "/reference", label: "REST API" }],
  },
];

function allHrefs(section) {
  const hrefs = section.pages.map((p) => p.href);
  if (section.subsections) {
    section.subsections.forEach((s) => {
      if (s.href) hrefs.push(s.href);
      s.pages.forEach((p) => hrefs.push(p.href));
    });
  }
  return hrefs;
}

export default function DocsSidebarFull() {
  const path = usePathname();
  const { open: drawerOpen, close: closeDrawer } = useDocsSidebar();

  useEffect(() => {
    closeDrawer();
  }, [path, closeDrawer]);

  const [sectionOpen, setSectionOpen] = useState(() =>
    SECTIONS.reduce((acc, s, i) => {
      acc[i] = true;
      return acc;
    }, {}),
  );

  const [subOpen, setSubOpen] = useState(() => {
    const state = {};
    SECTIONS.forEach((s, si) => {
      if (s.subsections) {
        s.subsections.forEach((sub, ci) => {
          const key = `${si}-${ci}`;
          const hasActivePage =
            sub.pages.some((p) => p.href === path) || sub.href === path;
          state[key] = !sub.collapsed || hasActivePage;
        });
      }
    });
    return state;
  });

  // Expand the section + subsection containing the active page on every route
  // change. The sidebar persists across client-side navigation (it lives in the
  // layout and never remounts), so the useState initializers above only run on
  // first mount. Without this, navigating into a collapsed subsection — via a
  // search result, an in-content link, or prev/next nav — leaves it closed and
  // hides where you are. Only force-opens the matching entries, never collapses.
  useEffect(() => {
    SECTIONS.forEach((s, si) => {
      const inSectionPages = s.pages.some((p) => p.href === path);
      if (inSectionPages) {
        setSectionOpen((o) => (o[si] ? o : { ...o, [si]: true }));
      }
      s.subsections?.forEach((sub, ci) => {
        const isActive =
          sub.href === path || sub.pages.some((p) => p.href === path);
        if (isActive) {
          setSectionOpen((o) => (o[si] ? o : { ...o, [si]: true }));
          const key = `${si}-${ci}`;
          setSubOpen((o) => (o[key] ? o : { ...o, [key]: true }));
        }
      });
    });
  }, [path]);

  return (
    <>
      {drawerOpen && (
        <div className="docs-sidebar-backdrop" onClick={closeDrawer} />
      )}
      <aside className={`docs-side ${drawerOpen ? "docs-side-open" : ""}`}>
        {SECTIONS.map((section, si) => {
          const isOpen = sectionOpen[si];

          return (
            <div key={section.title}>
              <h4
                onClick={() => setSectionOpen((o) => ({ ...o, [si]: !o[si] }))}
                style={{
                  cursor: "pointer",
                  userSelect: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {section.title}
                <span
                  style={{
                    fontSize: "0.55rem",
                    opacity: 0.4,
                    transition: "transform 0.15s",
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                  }}
                >
                  ▶
                </span>
              </h4>

              {isOpen && (
                <ul>
                  {section.pages.map((p) => (
                    <li key={p.href}>
                      <Link
                        href={p.href}
                        className={path === p.href ? "active" : ""}
                      >
                        {p.label}
                      </Link>
                    </li>
                  ))}

                  {section.subsections &&
                    section.subsections.map((sub, ci) => {
                      const subKey = `${si}-${ci}`;
                      const subIsOpen = subOpen[subKey];
                      const subIsActive = sub.href === path;

                      return (
                        <li key={sub.title} style={{ listStyle: "none" }}>
                          {sub.href ? (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0,
                              }}
                            >
                              <Link
                                href={sub.href}
                                className={subIsActive ? "active" : ""}
                                style={{
                                  flex: 1,
                                  display: "block",
                                  padding: "0.25rem 0.6rem 0.25rem 1.2rem",
                                  borderRadius: "7px",
                                  fontSize: "0.9rem",
                                }}
                              >
                                {sub.title}
                              </Link>
                              {sub.pages.length > 0 && (
                                <span
                                  onClick={() =>
                                    setSubOpen((o) => ({
                                      ...o,
                                      [subKey]: !o[subKey],
                                    }))
                                  }
                                  role="button"
                                  tabIndex={0}
                                  style={{
                                    cursor: "pointer",
                                    padding: "0.25rem 0.5rem",
                                    fontSize: "0.5rem",
                                    opacity: 0.4,
                                    transition: "transform 0.15s",
                                    transform: subIsOpen
                                      ? "rotate(90deg)"
                                      : "rotate(0deg)",
                                  }}
                                >
                                  ▶
                                </span>
                              )}
                            </span>
                          ) : (
                            <span
                              onClick={() =>
                                setSubOpen((o) => ({
                                  ...o,
                                  [subKey]: !o[subKey],
                                }))
                              }
                              role="button"
                              tabIndex={0}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                padding: "0.25rem 0.6rem",
                                borderRadius: "7px",
                                fontSize: "0.9rem",
                                color: "var(--fg-soft)",
                              }}
                            >
                              {sub.title}
                              <span
                                style={{
                                  fontSize: "0.5rem",
                                  opacity: 0.4,
                                  transition: "transform 0.15s",
                                  transform: subIsOpen
                                    ? "rotate(90deg)"
                                    : "rotate(0deg)",
                                }}
                              >
                                ▶
                              </span>
                            </span>
                          )}
                          {subIsOpen && sub.pages.length > 0 && (
                            <ul
                              style={{
                                paddingLeft: "0.6rem",
                                marginBottom: "0.3rem",
                              }}
                            >
                              {sub.pages.map((p) => (
                                <li key={p.href}>
                                  <Link
                                    href={p.href}
                                    className={path === p.href ? "active" : ""}
                                    style={{ paddingLeft: "0.9rem" }}
                                  >
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
    </>
  );
}
