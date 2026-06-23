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
      ".docs-main h1, .docs-main h2, .docs-main h3",
    );
    headings.forEach((h) => {
      const id = h.id || slugify(h.textContent.replace(/#$/, "").trim());
      if (!h.id) h.id = id;

      if (!h.querySelector(".heading-anchor")) {
        const link = document.createElement("a");
        link.href = `#${id}`;
        link.className = "heading-anchor";
        link.setAttribute("aria-label", "Link to this section");
        link.textContent = "#";
        h.appendChild(link);
      }
    });

    // After IDs are set, scroll to hash if present
    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [pathname]);

  return null;
}
