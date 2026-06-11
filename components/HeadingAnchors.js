"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function HeadingAnchors() {
  const pathname = usePathname();

  useEffect(() => {
    const headings = document.querySelectorAll(
      ".docs-main h1:not([data-anchor]), .docs-main h2:not([data-anchor]), .docs-main h3:not([data-anchor])"
    );
    headings.forEach((h) => {
      h.setAttribute("data-anchor", "true");
      const id = h.id || slugify(h.textContent);
      if (!h.id) h.id = id;

      const link = document.createElement("a");
      link.href = `#${id}`;
      link.className = "heading-anchor";
      link.setAttribute("aria-label", "Link to this section");
      link.textContent = "#";
      h.appendChild(link);
    });
  }, [pathname]);

  return null;
}
