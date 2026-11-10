"use client";

import { useEffect, useState } from "react";
import { installerCommand } from "@/lib/docs-component-data";

export default function InstallTerminal() {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("https://omnigent.ai");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);
  const command = installerCommand(origin);

  const copy = () => {
    navigator.clipboard?.writeText(command).then(() => {
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
      </div>
      <div className="term-body">
        <code>
          <span className="term-prompt">$</span> {command}
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
