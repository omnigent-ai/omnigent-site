"use client";

import { useEffect, useState } from "react";
import { cliTabs } from "@/lib/docs-component-data";

// Docs install page command picker. Renders a plain <pre><code> so the docs
// layout's CopyCodeButtons attaches its copy button (unlike the homepage's
// terminal-styled InstallTabs, which carries its own chrome).
// The commands live in lib/docs-component-data.js.
export default function InstallCommandTabs() {
  const [cliTab, setCliTab] = useState(0);
  const [origin, setOrigin] = useState("https://omnigent.ai");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);
  const CLI_TABS = cliTabs(origin);

  return (
    <div className="tabbed-code">
      <div className="tab-bar">
        {CLI_TABS.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setCliTab(i)}
            className={cliTab === i ? "active" : ""}
          >
            {t.label}
          </button>
        ))}
      </div>
      <pre>
        <code>{CLI_TABS[cliTab].code}</code>
      </pre>
    </div>
  );
}
