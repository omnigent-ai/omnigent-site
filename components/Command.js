"use client";

import { useState } from "react";

export default function Command({ children }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <div className="cmd">
      <pre>
        <code>
          <span style={{ color: "#7c7587", userSelect: "none" }}>$ </span>
          {children}
        </code>
      </pre>
      <button className="copy" onClick={copy} aria-label="Copy command">
        {copied ? "copied" : "copy"}
      </button>
    </div>
  );
}
