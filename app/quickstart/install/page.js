"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MACOS_DOWNLOAD_URL } from "@/components/links";


// /install.sh rewrites to the GitHub install script (see next.config.mjs)
const cliTabs = (origin) => [
  { label: "installer", code: `curl -fsSL ${origin}/install.sh | sh` },
  { label: "uv", code: "uv tool install omnigent" },
  { label: "pip", code: "pip install omnigent" },
  { label: "Homebrew", code: "brew install omnigent-ai/tap/omnigent" },
];

function AppleLogo() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      width="12"
      height="15"
      fill="currentColor"
      style={{ flexShrink: 0 }}
    >
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

export default function Page() {
  const [setup, setSetup] = useState("cli");
  const [cliTab, setCliTab] = useState(0);
  const [origin, setOrigin] = useState("https://omnigent.ai");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);
  const CLI_TABS = cliTabs(origin);

  return (
    <>
      <h1>Install</h1>

      <div className="setup-tabs setup-tabs--full">
        <button className={`setup-tab${setup === "cli" ? " active" : ""}`} onClick={() => setSetup("cli")}>
          CLI
        </button>
        <button className={`setup-tab${setup === "app" ? " active" : ""}`} onClick={() => setSetup("app")}>
          Desktop App
        </button>
      </div>

      {setup === "cli" && (
        <>
          <h2>Requirements</h2>
          <ul>
            <li><strong>Python 3.12+</strong></li>
            <li><strong>Node.js 22 LTS</strong> and npm</li>
            <li><strong>tmux</strong></li>
          </ul>

          <h2>Install Omnigent</h2>

          <div className="tabbed-code">
            <div className="tab-bar">
              {CLI_TABS.map((t, i) => (
                <button key={t.label} onClick={() => setCliTab(i)} className={cliTab === i ? "active" : ""}>
                  {t.label}
                </button>
              ))}
            </div>
            <pre><code>{CLI_TABS[cliTab].code}</code></pre>
          </div>

          <p>Run the same command to upgrade an existing installation.</p>

          <h2>Set up credentials</h2>
          <pre><code>{"omni setup"}</code></pre>
          <p>
            The wizard detects credentials in your environment and prompts for
            any that are missing. See{" "}
            <Link href="/docs/build/models#credentials">Models &amp; Credentials</Link> for the
            full reference.
          </p>

          <h2>Launch Debby</h2>
          <p>
            Try your install with Debby, a built-in multi-AI agent that sends every
            question to both Claude and GPT and lets them debate.
          </p>
          <pre><code>{"omni debby"}</code></pre>
          <p>
            Ask something like{" "}
            <code>What came first, the chicken or the egg?</code> and watch the
            models challenge each other. See
            the <Link href="/docs/use/builtin-agents/debby">Debby reference</Link>{" "}
            for more.
          </p>
        </>
      )}

      {setup === "app" && (
        <>
          <p>
            Download the native macOS app for a full UI, session history, and
            the ability to connect to a local or remote server.
          </p>

          <p>
            <a href={MACOS_DOWNLOAD_URL} className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <AppleLogo />
              Download macOS App
            </a>
          </p>

          <h2>Install Omnigent</h2>

          <div className="tabbed-code">
            <div className="tab-bar">
              {CLI_TABS.map((t, i) => (
                <button key={t.label} onClick={() => setCliTab(i)} className={cliTab === i ? "active" : ""}>
                  {t.label}
                </button>
              ))}
            </div>
            <pre><code>{CLI_TABS[cliTab].code}</code></pre>
          </div>

          <p>Run the same command to upgrade an existing installation.</p>

          <h2>Set up credentials</h2>
          <pre><code>{"omni setup"}</code></pre>
          <p>
            The wizard detects credentials in your environment and prompts for
            any that are missing. See{" "}
            <Link href="/docs/build/models#credentials">Models &amp; Credentials</Link> for the
            full reference.
          </p>

          <h2>Launch Debby</h2>
          <p>
            Try your install with Debby, a built-in multi-AI agent that sends every
            question to both Claude and GPT and lets them debate.
          </p>
          <pre><code>{"omni debby"}</code></pre>

          <h2>Connect the Desktop App</h2>
          <p>
            Open the downloaded app — it will ask for a server URL. The{" "}
            <code>omni debby</code> command launches a web UI and prints the
            server URL and port. By default this is{" "}
            <code>http://localhost:6767</code>. If port 6767 is already taken,
            the server will use the next available port — check the web UI
            for the actual URL (e.g. <code>http://localhost:6768</code>).
            Paste that into the desktop app to connect.
          </p>
          <p>
            Now your desktop app is ready to use. Pick <strong>Debby</strong>{" "}
            from the agent picker in the UI (along with other agents we have)
            and ask something like{" "}
            <code>What came first, the chicken or the egg?</code> and watch the
            models challenge each other. See
            the <Link href="/docs/use/builtin-agents/debby">Debby reference</Link>{" "}
            for more.
          </p>
          <p>
            This also works with a remote server. See{" "}
            <Link href="/docs/deploy/overview">Shared Server</Link> to learn how to
            deploy your own server.
          </p>
        </>
      )}


    </>
  );
}
