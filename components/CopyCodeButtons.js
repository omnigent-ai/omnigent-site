"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function CopyCodeButtons() {
  const pathname = usePathname();

  useEffect(() => {
    const pres = document.querySelectorAll("pre:not([data-copy-added])");
    pres.forEach((pre) => {
      pre.setAttribute("data-copy-added", "true");
      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.textContent = "copy";
      btn.addEventListener("click", () => {
        const code = pre.querySelector("code");
        const text = code ? code.textContent : pre.textContent;
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = "copied";
          setTimeout(() => { btn.textContent = "copy"; }, 1500);
        });
      });
      pre.appendChild(btn);
    });
  }, [pathname]);

  return null;
}
