"use client";

import { useDocsSidebar } from "./DocsSidebarContext";

export default function DocsSidebarToggle() {
  const { toggle } = useDocsSidebar();

  return (
    <button
      className="docs-sidebar-toggle"
      onClick={toggle}
      aria-label="Open navigation"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="3" y1="5" x2="17" y2="5" />
        <line x1="3" y1="10" x2="17" y2="10" />
        <line x1="3" y1="15" x2="17" y2="15" />
      </svg>
    </button>
  );
}
