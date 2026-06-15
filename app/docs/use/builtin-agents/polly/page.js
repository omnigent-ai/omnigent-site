import { pageMeta } from "@/lib/og";
import Link from "next/link";

export const metadata = pageMeta("Polly", "Polly is a supervisor that delegates sub-tasks to sub-agents on separate harnesses and worktrees, with cross-agent review and human-decided merges.", {
  eyebrow: "Use Cases",
});

export default function Page() {
  return (
    <>
      <h1>Polly</h1>
      <p className="lede-block">
        Multi-agent coding orchestrator. Polly breaks your task into sub-tasks and
        delegates each one to a different AI agent, with cross-vendor code review built in.
      </p>

      <pre><code>{`omni polly
omni          # also launches Polly (it's the default)`}</code></pre>

      <h2>How it works</h2>
      <p>
        Polly is a supervisor that never writes code itself. It decomposes your goal
        into sub-tasks and delegates each one to a sub-agent running on its own harness
        and git worktree. One agent implements, a different agent reviews. Each
        implementer opens its own PR. Polly never merges. The human decides.
      </p>

      <table>
        <thead>
          <tr><th>Sub-agent</th><th>Harness</th><th>Role</th></tr>
        </thead>
        <tbody>
          <tr><td><code>claude_code</code></td><td><code>claude-native</code></td><td>Claude Code</td></tr>
          <tr><td><code>codex</code></td><td><code>codex-native</code></td><td>Codex</td></tr>
          <tr><td><code>pi</code></td><td><code>pi</code></td><td>Pi (headless, any gateway model)</td></tr>
        </tbody>
      </table>

      <h2>Skills</h2>
      <ul>
        <li>
          <strong><code>/fanout</code></strong> runs independent tasks in parallel.
          Each gets its own git worktree and sub-agent. Each opens its own PR.
        </li>
        <li>
          <strong><code>/cross-review</code></strong> sends an implementer{"'"}s diff
          to a different-vendor reviewer. Blocking issues loop back as fixes until clean.
        </li>
        <li>
          <strong><code>/investigate</code></strong> delegates read-only work (debugging,
          audits, code understanding) to sub-agents and synthesizes findings.
        </li>
      </ul>

      <h2>When to use</h2>
      <ul>
        <li>Large refactors that benefit from parallel work.</li>
        <li>Cross-vendor code review where one agent writes and another reviews.</li>
        <li>Specialized sub-tasks routed to the harness best suited for them.</li>
      </ul>

      <p>
        <a href="https://github.com/omnigent-ai/omnigent/tree/main/examples/polly" target="_blank" rel="noreferrer">
          Source on GitHub
        </a>
      </p>
    </>
  );
}
