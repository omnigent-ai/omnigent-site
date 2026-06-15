import Link from "next/link";
import ContentTabs from "@/components/ContentTabs";

export const metadata = {
  title: "Tutorial: Polly (Multi-AI Coding)",
  // TODO(seo): review/refine this share-card description (auto-derived from page intro).
  description:
    "Tutorial: see Polly in practice, a multi-agent coding orchestrator that delegates sub-tasks across AI agents with built-in cross-vendor review.",
};

export default function Page() {
  return (
    <>
      <h1>Tutorial: Polly (Multi-AI Coding)</h1>

      <p>
        Polly is a multi-agent coding orchestrator. It breaks your task into
        sub-tasks and delegates each one to a different AI agent, with
        cross-vendor code review built in. This tutorial shows you how it
        looks in practice.
      </p>

      <p>
        <strong>Time:</strong> 5 minutes. <strong>Everything runs locally.</strong>
      </p>

      <h2>1. Run Polly</h2>

      <pre><code>{"omni polly"}</code></pre>

      <p>
        This starts Polly and opens a web UI at{" "}
        <code>http://localhost:6767</code> (<code>omni</code> will start Polly
        too).
      </p>

      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/docs/polly-default-launch.gif"
          alt="Running omni from the terminal launches Polly"
          style={{ width: "100%", borderRadius: "8px" }}
        />
        <figcaption>
          Start Polly with <code>omni polly</code>, or just <code>omni</code>.
        </figcaption>
      </figure>

      <h2>2. Give it a task</h2>

      <pre><code>{"Refactor the authentication module into separate files for OAuth, JWT, and session handling. Add tests for each."}</code></pre>

      <p>
        Polly breaks this into sub-tasks and delegates each one to a different
        AI agent. Claude Code implements one piece, Codex implements another in
        parallel, and a different agent reviews each PR.
      </p>

      <h2>3. Watch it in the web UI or desktop app</h2>

      <ContentTabs labels={["Web UI", "Desktop App"]}>
        <p>
          Open <code>http://localhost:6767</code> in your browser. It shows the
          same session as your terminal, updating in real time.
        </p>
        <p>
          Launch the <Link href="/docs/interact/desktop">desktop app</Link> and
          connect it to <code>http://localhost:6767</code>. It shows the same
          session as your terminal, and adds OS notifications and a dock badge
          when Polly or a sub-agent needs your attention, which is useful
          while sub-agents work in parallel.
        </p>
      </ContentTabs>

      <p>
        The right panel has four tabs: <strong>Files</strong>,{" "}
        <strong>Agents</strong>, <strong>Shells</strong>, and{" "}
        <strong>Todos</strong>.
      </p>

      <p>Click the <strong>Agents</strong> tab to see every sub-agent Polly
        dispatches, with live status (working, idle, finished).
      </p>

      <ul>
        <li>Click any sub-agent to switch to its view and see its conversation, files, and terminal output.</li>
        <li>Switch to the <strong>Shells</strong> tab to see all running shells side by side.</li>
        <li>Intervene at any point: send a message to a sub-agent, or switch back to Polly to see the orchestrator{"'"}s view.</li>
      </ul>

      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/docs/polly-agent-switch.gif"
          alt="Switching from Polly to sub-agents in the Agents panel"
          style={{ width: "100%", borderRadius: "8px" }}
        />
        <figcaption>
          The Agents panel shows Polly and its sub-agents, so you can inspect or
          steer each delegated worker directly.
        </figcaption>
      </figure>

      <p>
        This is where multi-AI orchestration becomes tangible: you can watch
        Claude Code and Codex working on different parts of the same task
        simultaneously, each in its own git worktree.
      </p>

      <p>
        See <Link href="/docs/use/builtin-agents/polly">Polly reference</Link> for
        the full details on skills like <code>/fanout</code>,{" "}
        <code>/cross-review</code>, and <code>/investigate</code>.
      </p>

      <h2>What{"'"}s next</h2>

      <ul>
        <li>
          <Link href="/quickstart/collaborate">Collaborate from anywhere</Link> to
          deploy a server and share sessions with teammates.
        </li>
        <li>
          <Link href="/docs/use/custom-agents">Build a custom agent</Link> with
          your own multi-agent orchestration in YAML.
        </li>
      </ul>
    </>
  );
}
