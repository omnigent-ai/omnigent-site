"use client";

import { useEffect, useState } from "react";

// /install.sh rewrites to the GitHub install script (see next.config.mjs)
const installerCmd = (origin) => `curl -fsSL ${origin}/install.sh | sh`;

const options = (origin) => [
  { id: "installer", label: "installer", cmd: installerCmd(origin) },
  { id: "uv", label: "uv", cmd: "uv tool install omnigent" },
  { id: "pip", label: "pip", cmd: "pip install omnigent" },
  {
    id: "homebrew",
    label: "homebrew",
    cmd: "brew install omnigent-ai/tap/omnigent",
  },
];

export default function InstallTabs() {
  const [active, setActive] = useState("installer");
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("https://omnigent.ai");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);
  const OPTIONS = options(origin);
  const current = OPTIONS.find((o) => o.id === active) ?? OPTIONS[0];

  const copy = () => {
    navigator.clipboard?.writeText(current.cmd).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <div className="term">
      <div className="term-bar">
        <span className="term-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <div className="term-tabs" role="tablist" aria-label="Install method">
          {OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              role="tab"
              aria-selected={active === o.id}
              className={active === o.id ? "term-tab is-active" : "term-tab"}
              onClick={() => {
                setActive(o.id);
                setCopied(false);
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <div className="term-body">
        <code>
          <span className="term-prompt">$</span> {current.cmd}
        </code>
        <button
          className="term-copy"
          type="button"
          onClick={copy}
          aria-label="Copy command"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>
    </div>
  );
}
