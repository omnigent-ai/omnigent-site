"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { docsSections } from "@/lib/docs-navigation";
import { useDocsSidebar } from "./DocsSidebarContext";

const SCROLL_POSITION_KEY = "docs-sidebar-scroll-top";

export default function DocsSidebarFull() {
  const path = usePathname();
  const { open: drawerOpen, close: closeDrawer } = useDocsSidebar();
  const sidebarRef = useRef(null);

  // Docs and Quickstart have separate layouts. Restore the sidebar before
  // paint when navigation remounts it, without changing the article's scroll.
  useLayoutEffect(() => {
    try {
      sidebarRef.current.scrollTop = Number(
        sessionStorage.getItem(SCROLL_POSITION_KEY),
      );
    } catch {
      // Navigation still works when browser storage is unavailable.
    }
  }, []);

  function saveScrollPosition(event) {
    try {
      sessionStorage.setItem(
        SCROLL_POSITION_KEY,
        String(event.currentTarget.scrollTop),
      );
    } catch {
      // Storage may be disabled by browser settings.
    }
  }

  useEffect(() => {
    closeDrawer();
  }, [path, closeDrawer]);

  const [sectionOpen, setSectionOpen] = useState(() =>
    docsSections.reduce((acc, s, i) => {
      acc[i] = true;
      return acc;
    }, {}),
  );

  const [subOpen, setSubOpen] = useState(() => {
    const state = {};
    docsSections.forEach((s, si) => {
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
    docsSections.forEach((s, si) => {
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
      <aside
        ref={sidebarRef}
        onScroll={saveScrollPosition}
        className={`docs-side ${drawerOpen ? "docs-side-open" : ""}`}
      >
        {docsSections.map((section, si) => {
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
