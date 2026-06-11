import Link from "next/link";

export const metadata = { title: "Interact Overview" };

export default function Page() {
  return (
    <>
      <h1>Interact with your Omnigent</h1>

      <h2>Starting a session</h2>

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

      <pre><code>{"omni run agent.yaml --harness codex --model gpt-5.4-mini"}</code></pre>

      <p>
        The <code>--harness</code> and <code>--model</code> flags map directly to the{" "}
        <code>executor</code> block. This lets you reuse the same config across different LLM
        backends.
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

      <h2>What happens when you run</h2>

      <p>
        Omnigent spins up a local server (localhost:6767 by default) and gives you four ways to
        interact with your agent:
      </p>

      <ul>
        <li>
          <strong><Link href="/docs/interact/terminal">Terminal</Link>.</strong> CLI experience for
          keyboard-first developers.
        </li>
        <li>
          <strong><Link href="/docs/interact/web-ui">Web UI</Link>.</strong> Browser interface with
          session management, file editor, inline comments, multi-modal input, and collaboration.
        </li>
        <li>
          <strong><Link href="/docs/interact/mobile">Mobile</Link>.</strong> The Web UI is
          responsive and touch-optimized. Use it from your phone.
        </li>
        <li>
          <strong><Link href="/docs/interact/desktop">Desktop App</Link>.</strong> Native app with
          OS notifications, dock badges, and multiple windows. Same UI as the browser.
        </li>
      </ul>

      <p>All four surfaces connect to the same session in real time.</p>

      <h3>Browser-first mode</h3>

      <p>
        If you prefer to work entirely in the browser without a terminal, start the server and host
        daemon separately:
      </p>

      <pre><code>{"omni server start   # start the local server + web UI in the background\nomni host           # (separate terminal) register this machine as a host"}</code></pre>

      <p>
        Now open <strong>http://localhost:6767</strong> in your browser and work from there. The
        terminal is optional.
      </p>
    </>
  );
}
