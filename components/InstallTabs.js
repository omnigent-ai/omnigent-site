"use client";

import { useState } from "react";

const OPTIONS = [
  { id: "pip", label: "pip", cmd: "pip install omnigent" },
  { id: "uv", label: "uv", cmd: "uv tool install omnigent" },
];

export default function InstallTabs() {
  const [active, setActive] = useState("pip");
  const [copied, setCopied] = useState(false);
  const current = OPTIONS.find((o) => o.id === active) ?? OPTIONS[0];

  const copy = () => {
    navigator.clipboard?.writeText(current.cmd).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <div className="cmd">
      <div className="install-tabs" role="tablist" aria-label="Install method">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            role="tab"
            aria-selected={active === o.id}
            className={active === o.id ? "install-tab is-active" : "install-tab"}
            onClick={() => {
              setActive(o.id);
              setCopied(false);
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
      <pre>
        <code>
          <span style={{ color: "#7c7587", userSelect: "none" }}>$ </span>
          {current.cmd}
        </code>
      </pre>
      <button className="copy" type="button" onClick={copy} aria-label="Copy command">
        {copied ? "copied" : "copy"}
      </button>
    </div>
  );
}
