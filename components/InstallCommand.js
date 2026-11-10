"use client";

import { useEffect, useState } from "react";
import { installPageCommands } from "@/lib/docs-component-data";

// Docs install page command block. Renders a plain <pre><code> so the docs
// layout's CopyCodeButtons attaches its copy button (unlike the homepage's
// terminal-styled InstallTerminal, which carries its own chrome).
// The commands live in lib/docs-component-data.js.
export default function InstallCommand() {
  const [origin, setOrigin] = useState("https://omnigent.ai");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <pre>
      <code>{installPageCommands(origin)}</code>
    </pre>
  );
}
