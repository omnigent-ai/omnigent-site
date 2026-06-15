import { pageMeta } from "@/lib/og";
import Link from "next/link";

export const metadata = pageMeta("Terminal", "Omnigent's keyboard-first default interface, with streaming output and real-time tool execution for people who live in the terminal.", {
  eyebrow: "Interact",
});

export default function Page() {
  return (
    <>
      <h1>Terminal</h1>

      <p>
        The terminal is Omnigent{"'"}s default interface: keyboard-first, with streaming output and
        real-time tool execution. If you already live in a terminal, this is the fastest way to work
        with your agent.
      </p>

      <p>
        Every interface (terminal, web UI, mobile, and desktop) connects to the same persistent,
        shareable session, so you can start work in one place and keep going anywhere.
      </p>

            {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/docs/terminal.png" alt="Omnigent terminal session" style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }} />

      <h2>Start a session</h2>

      <p>
        The terminal interface requires <code>tmux</code>, so install it first if you don{"'"}t have
        it:
      </p>

      <pre><code>{"# macOS\nbrew install tmux\n\n# Debian / Ubuntu\napt install tmux"}</code></pre>

      <p>Then launch an agent:</p>

      <pre><code>{"omni claude                          # Claude Code\nomni codex                           # Codex\nomni run agent.yaml                  # custom omnigent\nomni run ./my-agent/                 # directory with config.yaml"}</code></pre>

      <p>
        <code>omni claude</code> and <code>omni codex</code> launch an existing coding agent with
        Omnigent{"'"}s UI. No YAML needed. See the{" "}
        <Link href="/quickstart/coding-agent">Coding Agent tutorial</Link>.
      </p>

      <p>
        <code>omni run</code> starts a custom omnigent from a YAML config. See{" "}
        <Link href="/docs/use/custom-agents">Custom Agents</Link> for how to write one.
      </p>

      <h3>CLI overrides</h3>

      <p>Override executor values at runtime without editing the YAML:</p>

      <pre><code>{"omni run agent.yaml --harness codex --model gpt-4.1-mini"}</code></pre>

      <p>
        The <code>--harness</code> and <code>--model</code> flags map
        directly to the <code>executor</code> block. This lets you reuse the same config across
        different LLM backends.
      </p>

      <p>
        From here, the agent streams its output as it thinks and acts. Tool calls run in real time,
        so you watch file writes, shell commands, and API calls land as they happen. The session also
        stays in sync with the <Link href="/docs/interact/web-ui">Web UI</Link> both ways: run the
        agent in your terminal and glance at the browser whenever you want file diffs or inline
        comments.
      </p>

      <h2>Sessions and conversations</h2>

      <p>
        A session is a conversation. Every message, tool call, and file change lives in one
        continuous thread. Sessions are the core unit of work in Omnigent, and three properties make
        them useful:
      </p>

      <ul>
        <li>
          <strong>Agent-independent.</strong> A session belongs to you, not to a specific agent.
          Switch agents mid-conversation: start with a planner, switch to a coder, bring in a
          reviewer. The full history carries forward.
        </li>
        <li>
          <strong>Persistent.</strong> Every session has a conversation ID and lives beyond the
          current terminal window. Close your laptop, come back tomorrow, resume where you left off:{" "}
          <code>omni resume &lt;conversation_id&gt;</code>
        </li>
        <li>
          <strong>Shared.</strong> Any omnigent can read the history of other sessions you have
          access to. When you spin up a new task, the agent already has context from previous work.
        </li>
      </ul>

      <h2>When to use the terminal</h2>

      <p>The terminal shines when you want to stay close to the command line:</p>

      <ul>
        <li>
          <strong>Fast iteration.</strong> Keyboard-first, no context switching to a browser.
        </li>
        <li>
          <strong>SSH environments.</strong> Works over SSH where a browser isn{"'"}t available.
        </li>
        <li>
          <strong>Low-bandwidth connections.</strong> Text-only, minimal overhead.
        </li>
        <li>
          <strong>Scripting and automation.</strong> Composable with other CLI tools.
        </li>
      </ul>
    </>
  );
}
