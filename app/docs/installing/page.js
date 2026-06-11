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
      <h1>Install Omnigent</h1>

      <h2>Requirements</h2>

      <table>
        <thead>
          <tr>
            <th>Dependency</th>
            <th>Version</th>
            <th>Why</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Python</td>
            <td>3.12+</td>
            <td>Omnigent runtime</td>
          </tr>
          <tr>
            <td>Node.js</td>
            <td>22 LTS</td>
            <td>Claude Code, Codex, and Pi harnesses</td>
          </tr>
          <tr>
            <td>npm</td>
            <td>(comes with Node.js)</td>
            <td>Package management for harnesses</td>
          </tr>
          <tr>
            <td>tmux</td>
            <td>any</td>
            <td>Launches native agent terminals</td>
          </tr>
        </tbody>
      </table>

      <h2>Install</h2>

      <div className="tabs">
        <div className="tab-buttons" style={{ display: "flex", gap: "0" }}>
          {installTabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              style={{
                padding: "8px 16px",
                border: "1px solid #ccc",
                borderBottom: activeTab === i ? "none" : "1px solid #ccc",
                background: activeTab === i ? "#1e1e1e" : "#f5f5f5",
                color: activeTab === i ? "#fff" : "#333",
                cursor: "pointer",
                fontWeight: activeTab === i ? "bold" : "normal",
              }}
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
        The setup wizard walks you through configuring model credentials. It
        auto-detects credentials already in your environment (Anthropic API key,
        OpenAI key, or an existing CLI login) and offers them as defaults.
      </p>

      <p>Four credential types are supported:</p>

      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>API key</strong>
            </td>
            <td>Anthropic, OpenAI, or any provider dashboard</td>
          </tr>
          <tr>
            <td>
              <strong>Subscription</strong>
            </td>
            <td>Claude Pro/Max or ChatGPT Plus/Pro via their CLIs</td>
          </tr>
          <tr>
            <td>
              <strong>Gateway</strong>
            </td>
            <td>
              OpenAI or Anthropic-compatible endpoints (OpenRouter, Ollama,
              Azure, LiteLLM, etc.)
            </td>
          </tr>
          <tr>
            <td>
              <strong>Databricks</strong>
            </td>
            <td>Workspace profile for Databricks-hosted models</td>
          </tr>
        </tbody>
      </table>

      <p>
        Defaults are per agent, so a Claude default and a Codex default can
        coexist. You can switch models during a session with the{" "}
        <code>/model</code> command.
      </p>

      <p>
        See{" "}
        <Link href="/docs/build/models">Models &amp; Credentials</Link> for the
        full reference.
      </p>

      <h2>Verify the installation</h2>

      <pre>
        <code>{"omni claude"}</code>
      </pre>

      <p>
        If everything is set up correctly, this launches Claude Code with
        Omnigent{"'"}s web UI and terminal. You{"'"}re ready for the{" "}
        <Link href="/docs/coding-agent">Coding Agent Quickstart</Link>.
      </p>
    </>
  );
}
