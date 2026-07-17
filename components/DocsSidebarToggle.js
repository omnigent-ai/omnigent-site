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
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <rect x="3" y="4" width="14" height="12" rx="1.5" />
        <line x1="7.5" y1="4" x2="7.5" y2="16" />
      </svg>
    </button>
  );
}
