import Link from "next/link";

export const metadata = { title: "Built-in Multi-AI Agents" };

export default function Page() {
  return (
    <>
      <h1>Built-in Multi-AI Agents</h1>
      <p>
        Omnigent ships with multi-agent orchestrators that combine different AI models
        in a single workflow. Both are ready to run out of the box, with more coming.
      </p>

      <h2><Link href="/docs/use/builtin-agents/polly">Polly</Link></h2>
      <p>
        Multi-agent coding orchestrator. Breaks tasks into sub-tasks, delegates to
        Claude Code, Codex, and Pi sub-agents in separate git worktrees, and enforces
        cross-vendor review. Run <code>omni</code> (Polly is the default agent).
      </p>

      <h2><Link href="/docs/use/builtin-agents/debby">Debby</Link></h2>
      <p>
        Multi-model brainstorming partner. Sends every question to both Claude and GPT,
        with a <code>/debate</code> skill for multi-round critique. Run <code>omni run examples/debby/</code>{" "}
        from a clone of the framework repo.
      </p>

      <hr />
      <p>
        Polly and Debby are just YAML configs. You can build your own multi-agent
        orchestrator the same way. See{" "}
        <Link href="/docs/use/custom-agents">Custom Agents</Link>{" "}
        to learn how.
      </p>
    </>
  );
}
