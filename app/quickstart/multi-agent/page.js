import Link from "next/link";

export const metadata = { title: "Multi-Agent Tutorial" };

export default function Page() {
  return (
    <>
      <h1>Multi-Agent Tutorial</h1>
      <p>
        Omnigent can orchestrate multiple AI models working together. This tutorial
        walks you through two built-in multi-agent examples.
      </p>

      <h2>Try Debby: multi-model debate</h2>
      <p>
        Debby is a brainstorming partner with two heads. Every question you ask gets
        sent to both Claude and GPT simultaneously. You see both perspectives side by
        side, then use the <code>/debate</code> skill to have them critique each
        other across multiple rounds.
      </p>
      <pre><code>{"omni run examples/debby/"}</code></pre>
      <p>
        Ask a question and watch both models respond. Then type <code>/debate</code> to
        start a multi-round critique where each model reviews the other{"'"}s answer and
        refines its own.
      </p>
      <p>
        This is useful for getting genuinely independent perspectives on architectural
        decisions, comparing approaches, or stress-testing an idea before committing.
      </p>

      <h2>Try Polly: multi-agent coding orchestrator</h2>
      <p>
        Polly is a supervisor that breaks coding tasks into sub-tasks and delegates them
        to Claude Code, Codex, and Pi sub-agents, each working in its own git worktree.
        One model implements, a different model reviews. Each implementer opens its own PR.
      </p>
      <pre><code>{"omni"}</code></pre>
      <p><em>The bare <code>omni</code> command launches Polly by default.</em></p>
      <p>
        Give Polly a task and open the web UI to watch the orchestration. The Agents tab
        in the right panel shows every sub-agent Polly dispatches. Click any sub-agent to
        see its terminal output, files, and PRs.
      </p>
      <p>Key skills:</p>
      <ul>
        <li><code>/fanout</code> runs independent tasks in parallel, each in its own worktree.</li>
        <li><code>/cross-review</code> sends each PR to a different-vendor model for review.</li>
        <li><code>/investigate</code> delegates read-only exploration to sub-agents.</li>
      </ul>
      <p>
        See the{" "}
        <a href="https://github.com/omnigent-ai/omnigent/tree/main/examples/polly" target="_blank" rel="noreferrer">
          Polly config on GitHub
        </a>{" "}
        and the{" "}
        <a href="https://github.com/omnigent-ai/omnigent/tree/main/examples/debby" target="_blank" rel="noreferrer">
          Debby config on GitHub
        </a>{" "}
        to see how multi-agent orchestration is configured in YAML.
      </p>

      <h2>What makes multi-agent different</h2>
      <p>
        A single coding agent does everything itself. Multi-agent setups let you:
      </p>
      <ul>
        <li>Get genuinely independent second opinions from different AI vendors.</li>
        <li>Parallelize work across multiple worktrees.</li>
        <li>Have one model implement and a different model review.</li>
        <li>Route different types of tasks to the model best suited for them.</li>
      </ul>
      <p>
        Everything from the{" "}
        <Link href="/quickstart/coding-agent">coding agent quickstart</Link>{" "}
        applies: web UI, deploy, mobile, collaboration, and sandboxing all work
        the same with multi-agent setups.
      </p>
    </>
  );
}
