"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function CopyCodeButtons() {
  const pathname = usePathname();

  useEffect(() => {
    function addCopyButton(pre) {
      if (pre.querySelector(":scope > .copy-btn")) return;
      pre.setAttribute("data-copy-added", "true");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.setAttribute("aria-label", "Copy code");
      btn.textContent = "copy";
      btn.addEventListener("click", () => {
        const code = pre.querySelector("code");
        const text = code ? code.textContent : pre.textContent;
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = "copied";
          setTimeout(() => {
            btn.textContent = "copy";
          }, 1500);
        });
      });
      pre.appendChild(btn);
    }

    function scan(root) {
      if (root instanceof Element) {
        const pre = root.closest("pre");
        if (pre) addCopyButton(pre);
      }
      root.querySelectorAll("pre").forEach(addCopyButton);
    }

    scan(document);
    // Tabs, streamed content, and live edits can add or replace code blocks
    // without changing the route. Check the DOM, not a stale data marker.
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof Element) scan(node);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
