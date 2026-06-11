import Link from "next/link";

export const metadata = { title: "Tutorial: Multi-AI Agents" };

export default function Page() {
  return (
    <>
      <h1>Tutorial: Multi-AI Agents</h1>

      <p>
        What happens when you ask two different AI models the same question and
        let them debate? This tutorial shows you Omnigent{"'"}s multi-AI
        orchestration by running Debby, a built-in agent that pits Claude against
        GPT in a structured debate.
      </p>

      <p>
        <strong>Time:</strong> 5 minutes. <strong>Everything runs locally.</strong>
      </p>

      <h2>1. Run Debby</h2>

      <pre><code>{"omni examples/debby/"}</code></pre>

      <div className="note">
        <p>
          If you installed via pip, clone the{" "}
          <a href="https://github.com/omnigent-ai/omnigent" target="_blank" rel="noreferrer">repo</a>{" "}
          first to access the examples directory.
        </p>
      </div>

      <p>
        This starts a session where every question you ask gets sent to both
        Claude and GPT simultaneously. Open <code>http://localhost:6767</code>{" "}
        to see both responses side by side.
      </p>

      <h2>2. Ask a question</h2>

      <p>Try something with room for genuine disagreement:</p>

      <pre><code>{"Should we use a monorepo or polyrepo for a team of 20 engineers building 5 microservices?"}</code></pre>

      <p>
        Both models respond independently. Read both perspectives. Notice where
        they agree and where they diverge.
      </p>

      <h2>3. Start a debate</h2>

      <p>Now type:</p>

      <pre><code>{"/debate"}</code></pre>

      <p>
        This triggers multi-round critique. Each model reviews the other{"'"}s
        answer, challenges weak points, and refines its own response. Watch them
        go back and forth, each round getting sharper.
      </p>

      <p>
        The debate converges toward a stronger synthesis than either model would
        produce alone. This is the point of multi-AI orchestration: genuinely
        independent perspectives, not just two copies of the same opinion.
      </p>

      <h2>4. Try Polly for coding tasks</h2>

      <p>
        Debby is for brainstorming. For coding, try Polly. Bare{" "}
        <code>omni</code> launches Polly by default:
      </p>

      <pre><code>{"omni"}</code></pre>

      <p>
        Polly is a supervisor that breaks your task into sub-tasks and delegates
        each one to a different AI model. Claude Code implements, Codex
        implements in parallel, and a different model reviews each PR.
      </p>

      <h3>Watch it in the web UI</h3>

      <p>
        Open <code>http://localhost:6767</code>. The right panel has four tabs:
        <strong> Files</strong>, <strong>Agents</strong>,{" "}
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
