"use client";

import { useState } from "react";
import Link from "next/link";

export default function Page() {
  const [activeTab, setActiveTab] = useState(0);

  const installTabs = [
    { label: "pip", code: "pip install omnigent" },
    { label: "uv", code: "uv tool install omnigent" },
    { label: "Homebrew", code: "brew install omnigent-ai/tap/omnigent" },
  ];

  return (
    <>
      <h1>Install</h1>

      <h2>Requirements</h2>
      <ul>
        <li><strong>Python 3.12+</strong></li>
        <li><strong>Node.js 22 LTS</strong> and npm</li>
        <li><strong>tmux</strong></li>
      </ul>

      <h2>Install Omnigent</h2>

      <div className="tabbed-code">
        <div className="tab-bar">
          {installTabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={activeTab === i ? "active" : ""}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <pre>
          <code>{installTabs[activeTab].code}</code>
        </pre>
      </div>

      <p>Run the same command to upgrade an existing installation.</p>

      <h2>Set up credentials</h2>

      <pre>
        <code>{"omni setup"}</code>
      </pre>

      <p>
        The wizard auto-detects credentials in your environment and walks you
        through adding any that are missing. See{" "}
        <Link href="/docs/build/models#credentials">Models &amp; Credentials</Link> for the
        full reference.
      </p>
    </>
  );
}
