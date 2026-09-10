"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Must match the slug logic in HeadingAnchors so both components
// agree on heading IDs regardless of which effect runs first.
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// `containerSelector` is the article whose h2/h3 form the ToC. `requireSelector`
// (optional) gates activation: the ToC only renders when that element exists,
// which lets the blog reuse this on individual posts without lighting up on the
// index, where the card grid also contains h2/h3.
export default function TableOfContents({
  containerSelector = ".docs-main",
  requireSelector,
  className = "docs-toc",
}) {
  const pathname = usePathname();
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const main = document.querySelector(containerSelector);
    if (!main) return;
    if (requireSelector && !document.querySelector(requireSelector)) return;

    const scan = () => {
      const headings = Array.from(main.querySelectorAll("h2, h3")).filter(
        (h) => !h.closest("details"),
      );
      const next = headings.map((h) => {
        const text = h.textContent.replace(/#$/, "").trim();
        const id = h.id || slugify(text);
        if (!h.id) h.id = id;
        return { id, text, level: h.tagName === "H3" ? 3 : 2 };
      });
      setItems((prev) =>
        prev.length === next.length &&
        prev.every((p, i) => p.id === next[i].id && p.text === next[i].text)
          ? prev
          : next,
      );
    };

    scan();
    // Re-scan when page content swaps without navigation (e.g. ContentTabs)
    const observer = new MutationObserver(scan);
    observer.observe(main, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname, containerSelector, requireSelector]);

  useEffect(() => {
    if (items.length === 0) return;

    const onScroll = () => {
      // A short final section can't scroll up to the threshold, so when we're
      // at the bottom of the page force-select the last heading.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveId(items[items.length - 1].id);
        return;
      }

      let current = items[0].id;
      for (const { id } of items) {
        const el = document.getElementById(id);
        // 96px ≈ sticky nav plus the headings' 5rem scroll-margin-top
        if (el && el.getBoundingClientRect().top <= 96) current = id;
      }
      setActiveId(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav className={className} aria-label="On this page">
      <ul>
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "toc-h3" : undefined}>
            <a
              href={`#${item.id}`}
              className={item.id === activeId ? "active" : undefined}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
