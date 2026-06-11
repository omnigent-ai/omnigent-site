import Link from "next/link";

export const metadata = { title: "Tutorial: Multi-AI Agents" };

export default function Page() {
  return (
    <>
      <h1>Tutorial: Multi-AI Agents</h1>

      <p>
        Omnigent can orchestrate multiple AI models working together on the same
        task. This tutorial walks you through two built-in multi-AI agents: Polly
        for coding and Debby for brainstorming debates.
      </p>

      <p>
        <strong>Time:</strong> 10 minutes. <strong>Everything runs locally.</strong>
      </p>

      <h2>1. Run Polly</h2>

      <p>
        Polly is a multi-agent coding orchestrator. Bare <code>omni</code>{" "}
        launches it by default:
      </p>

      <pre><code>{"omni"}</code></pre>

      <p>Give it a task. For example:</p>

      <pre><code>{"Refactor the authentication module into separate files for OAuth, JWT, and session handling. Add tests for each."}</code></pre>

      <p>
        Polly breaks this into sub-tasks and delegates each one to a different
        AI model. Claude Code implements one piece, Codex implements another in
        parallel, and a different model reviews each PR.
      </p>

      <h2>2. Watch it in the web UI</h2>

      <p>
        Open <code>http://localhost:6767</code>. The right panel has four tabs:{" "}
        <strong>Files</strong>, <strong>Agents</strong>,{" "}
        <strong>Terminals</strong>, and <strong>Todos</strong>. Click the{" "}
        <strong>Agents</strong> tab to see every sub-agent Polly dispatches,
        with live status (working, idle, finished).
      </p>

      <ul>
        <li>Click any sub-agent to switch to its view and see its conversation, files, and terminal output.</li>
        <li>Switch to the <strong>Terminals</strong> tab to see all running shells side by side.</li>
        <li>Intervene at any point: send a message to a sub-agent, or switch back to Polly to see the orchestrator{"'"}s view.</li>
      </ul>

      <p>
        This is where multi-AI orchestration becomes tangible: you can watch
        Claude Code and Codex working on different parts of the same task
        simultaneously, each in its own git worktree.
      </p>

      <h2>3. Try Debby for multi-model debate</h2>

      <p>
        Polly is for coding. Debby is for brainstorming: it sends every question
        to both Claude and GPT, then lets them debate each other.
      </p>

      <pre><code>{`git clone https://github.com/omnigent-ai/omnigent.git
cd omnigent
omni examples/debby/`}</code></pre>

      <h2>4. Ask a question and start a debate</h2>

      <p>Try something with room for genuine disagreement:</p>

      <pre><code>{"Should we use a monorepo or polyrepo for a team of 20 engineers building 5 microservices?"}</code></pre>

      <p>
        Both models respond independently. Read both perspectives. Then type:
      </p>

      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/docs/debby-results-scroll-short.gif"
          alt="Debby sends one prompt to Claude and GPT, then scrolls through both independent answers"
          style={{ width: "100%", borderRadius: "8px" }}
        />
        <figcaption>
          Debby fans one prompt out to Claude and GPT, waits for both partners,
          and then brings their independent takes back into the same session.
        </figcaption>
      </figure>

      <pre><code>{"/debate"}</code></pre>

      <p>
        Each model reviews the other{"'"}s answer, challenges weak points, and
        refines its own. The debate converges toward a stronger synthesis than
        either model would produce alone.
      </p>

      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/docs/debby-debate-synthesis-tight.png"
          alt="Debby summarizes how Claude and GPT challenged each other during debate"
          style={{ width: "100%", borderRadius: "8px" }}
        />
        <figcaption>
          After <code>/debate</code>, Debby summarizes how the models challenged
          each other and where the final synthesis changed.
        </figcaption>
      </figure>

      <p>
        See <Link href="/docs/use/builtin-agents/polly">Polly</Link> and{" "}
        <Link href="/docs/use/builtin-agents/debby">Debby</Link> for the full
        reference.
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
