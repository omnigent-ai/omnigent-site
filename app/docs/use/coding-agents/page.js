import Link from "next/link";

export const metadata = { title: "Coding Agents" };

export default function Page() {
  return (
    <>
      <h1>Coding Agents</h1>
      <p>
        Run Claude Code or Codex through Omnigent with a single command. No YAML needed.
        You get the full platform on top of the coding agent you already use: web UI,
        persistent sessions, team collaboration, mobile access, and{" "}
        <Link href="/docs/policies/overview">contextual policies</Link>.
      </p>

      <pre><code>{`omni claude    # Claude Code
omni codex     # Codex`}</code></pre>

      <p>
        Under the hood, each coding agent runs as a <strong>harness</strong>: the
        runtime that executes your agent loop. Omnigent wraps it with a common
        interface and adds everything a single harness can{"'"}t provide on its own.
      </p>

      <p>
        <strong><Link href="/quickstart/coding-agent">Follow the Coding Agent Quickstart</Link></strong>{" "}
        to get started in under a minute.
      </p>
    </>
  );
}
