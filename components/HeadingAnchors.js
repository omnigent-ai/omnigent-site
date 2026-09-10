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

// `containerSelector` scopes which article's headings get anchor links.
// `requireSelector` (optional) gates the whole effect so it stays dormant when
// that element is absent — the blog index shares .blog-main with posts but has
// no .blog-post-header, so its card titles must not get anchored.
export default function HeadingAnchors({
  containerSelector = ".docs-main",
  requireSelector,
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (requireSelector && !document.querySelector(requireSelector)) return;
    const headings = document.querySelectorAll(
      `${containerSelector} h1, ${containerSelector} h2, ${containerSelector} h3`,
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
  }, [pathname, containerSelector, requireSelector]);

  return null;
}
