import Link from "next/link";

export const metadata = { title: "Coding Agent Quickstart" };

export default function Page() {
  return (
    <>
      <h1>Coding Agent Quickstart</h1>

      <p>
        The fastest way to get started is to run a coding agent you already know
        through Omnigent. Pick Claude Code or Codex. You get everything the
        agent already does, plus a web UI, persistent sessions, policies, and
        team collaboration layered on top.
      </p>

      <p>
        Under the hood, each coding agent runs as a{" "}
        <strong>harness</strong>: the runtime that executes your agent loop.{" "}
        <code>omni claude</code> starts the Claude Code harness.{" "}
        <code>omni codex</code> starts the Codex harness. This walkthrough
        applies to both.
      </p>

      <p>
        <Link href="/quickstart/install">Install Omnigent</Link> first if you
        haven{"'"}t already.
      </p>

      <h2>1. Run it</h2>

      <pre>
        <code>
          {"omni claude                 # Claude Code\nomni codex                  # Codex"}
        </code>
      </pre>

      <p>That{"'"}s it. You{"'"}re up and running.</p>

      <h2>2. Interact</h2>

      <p>
        Omnigent gives you three ways to work with your coding agent, all
        connected to the same session in real time.
      </p>

      <h3>Native terminal</h3>

      <p>
        Omnigent launches the native CLI of your coding agent (Claude Code or
        Codex). You keep the exact terminal experience you{"'"}re used to.
      </p>

      <h3>Web UI</h3>

      <p>
        A browser-based interface at{" "}
        <strong>http://localhost:6767</strong> with features the terminal can
        {"'"}t offer:
      </p>

      <ul>
        <li>
          <Link href="/docs/interact/web-ui#session-management">
            Session management
          </Link>
          . Run multiple sessions, switch between them, resume previous ones.
        </li>
        <li>
          <Link href="/docs/interact/web-ui#file-editor">File editor</Link>.
          Browse and edit files the agent creates or modifies.
        </li>
        <li>
          <Link href="/docs/interact/web-ui#inline-comments-and-addressing">
            Inline comments
          </Link>
          . Leave feedback directly on code changes.
        </li>
        <li>
          <Link href="/docs/interact/web-ui#multi-modal-input">
            Multi-modal input
          </Link>
          . Paste screenshots, mockups, or diagrams into the conversation.
        </li>
        <li>Persistent history. Every conversation is saved automatically.</li>
      </ul>

      <p>
        These are things you can do in Omnigent that you can{"'"}t do with Claude Code
        or Codex alone:
      </p>
      <ul>
        <li><strong>Comment on files</strong> and have the agent resolve your feedback inline.</li>
        <li><strong>Access from your phone</strong> while the agent runs on your laptop or a server.</li>
        <li><strong>Fork a session</strong> into a different coding agent to try a different approach.</li>
        <li><strong>Invite teammates</strong> to your session for real-time pair programming.</li>
        <li><strong>Switch agents mid-conversation</strong> without losing history.</li>
      </ul>

      <h3>Desktop app</h3>

      <p>
        A <Link href="/docs/interact/desktop">native app</Link> with OS
        notifications and dock badges. Same UI as the browser, plus alerts when
        your agent needs attention.
      </p>

      <p>Use whichever interface fits the moment, or all of them at once.</p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/docs/single-harness-demo.gif" alt="Omnigent running a single coding-agent session in the web UI" style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }} />

      <h2>3. Set policies</h2>

      <p>
        Control what your omnigent can do by asking it in plain language:
      </p>

      <pre>
        <code>
          {"You: Route trivial tasks to a cheaper model to save cost.\n\nYou: Ask me before running any shell commands.\n\nYou: Cap this session at $5 of LLM spend."}
        </code>
      </pre>

      <p>
        Your omnigent picks the right policy, shows you what it{"'"}s about to
        add, and asks for approval. The policy takes effect immediately.
      </p>

      <p>
        See <Link href="/docs/policies/overview">Policies</Link> for the full
        list of options.
      </p>

      <h2>4. Deploy</h2>

      <p>
        So far everything runs on your laptop. To access your agent from your
        phone, share sessions with teammates, or keep it running while your
        laptop is closed, deploy the server.
      </p>

      <p>The simplest option is a one-click deploy to Render:</p>

      <ol>
        <li>
          Click the <strong>Deploy to Render</strong> button in the{" "}
          <Link href="/docs/deploy/cloud">deployment docs</Link>.
        </li>
        <li>Render provisions a server with Postgres automatically.</li>
        <li>Once deployed, connect your local machine:</li>
      </ol>

      <pre>
        <code>
          {"omni login https://your-app.onrender.com\nomni host https://your-app.onrender.com"}
        </code>
      </pre>

      <p>
        See <Link href="/docs/deploy/overview">Deployment</Link> for other
        options including Railway, Fly.io, and Docker.
      </p>

      <h2>5. Mobile access</h2>

      <p>
        Once deployed, open your server URL on your phone{"'"}s browser (e.g.{" "}
        <code>https://your-app.onrender.com</code>). No app install needed.
      </p>

      <p>
        You see the same web UI with the same sessions. Send a prompt from your
        phone, and it appears in the terminal and web UI on your desktop.
      </p>

      <h2>6. Team collaboration</h2>

      <p>
        In the web UI, click <strong>Share</strong> on any session to get a
        shareable link. Send it to a teammate. They open it in their browser and
        join the session in real time.
      </p>

      <p>Once in a shared session, teammates can:</p>

      <ul>
        <li>Watch the agent{"'"}s output as it streams</li>
        <li>Send their own messages to the agent</li>
        <li>Comment on and annotate the agent{"'"}s work</li>
        <li>Fork the session to explore a different direction</li>
      </ul>

      <p>
        See <Link href="/docs/collaborate/overview">Collaboration</Link> for
        advanced options like CLI-based co-driving and session forking.
      </p>

      <h2>7. Cloud sandbox</h2>

      <p>
        Once deployed, you may want your agent to keep working after you close
        your laptop. A{" "}
        <Link href="/docs/deploy/cloud-sandbox">cloud sandbox</Link> runs the
        agent in a remote container so it operates independently.
      </p>

      <hr />

      <h2>What{"'"}s next</h2>

      <ul>
        <li>
          <Link href="/quickstart/multi-agent">Try multi-agent</Link> — run Debby
          for a multi-model debate, or Polly for multi-agent coding orchestration.
        </li>
        <li>
          <Link href="/quickstart/custom-omnigent">Build a custom agent</Link> — define
          your own agent in a YAML file with custom tools, policies, and sub-agents.
        </li>
      </ul>
    </>
  );
}
