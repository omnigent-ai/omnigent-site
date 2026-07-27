"use client";

import { useState } from "react";

// Docs install page extras picker. Mirrors InstallCommandTabs so it inherits
// the .tabbed-code / .tab-bar CSS and renders code only per tab. No Homebrew
// tab: Homebrew can't express Python extras.
const EXTRAS_TABS = [
  {
    label: "installer",
    code: "curl -fsSL https://omnigent.ai/install.sh | sh -s -- --extra databricks,modal",
  },
  { label: "uv", code: 'uv tool install "omnigent[databricks,modal]"' },
  { label: "pip", code: 'pip install "omnigent[databricks,modal]"' },
];

export default function ExtrasCommandTabs() {
  const [tab, setTab] = useState(0);

  return (
    <div className="tabbed-code">
      <div className="tab-bar">
        {EXTRAS_TABS.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setTab(i)}
            className={tab === i ? "active" : ""}
          >
            {t.label}
          </button>
        ))}
      </div>
      <pre>
        <code>{EXTRAS_TABS[tab].code}</code>
      </pre>
    </div>
  );
}
