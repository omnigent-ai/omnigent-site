import Link from "next/link";

export const metadata = { title: "Debby" };

export default function Page() {
  return (
    <>
      <h1>Debby</h1>
      <p className="lede-block">
        Multi-model brainstorming partner. Debby sends every question to both Claude
        and GPT simultaneously, then lets them debate and refine each other{"'"}s answers.
      </p>

      <pre><code>{`git clone https://github.com/omnigent-ai/omnigent.git
cd omnigent
omni examples/debby/`}</code></pre>

      <h2>How it works</h2>
      <p>
        Ask a question and both models respond independently. You see both perspectives
        side by side. Then use the <code>/debate</code> skill to start a multi-round
        critique where each model reviews the other{"'"}s answer, challenges weak points,
        and refines its own response.
      </p>

      <table>
        <thead>
          <tr><th>Sub-agent</th><th>Harness</th><th>Role</th></tr>
        </thead>
        <tbody>
          <tr><td><code>claude</code></td><td><code>claude-sdk</code></td><td>Claude responder</td></tr>
          <tr><td><code>gpt</code></td><td><code>openai-agents</code></td><td>GPT responder</td></tr>
        </tbody>
      </table>

      <h2>The /debate skill</h2>
      <p>
        Type <code>/debate</code> after getting initial answers to trigger multi-round
        critique. Each model reviews the other{"'"}s answer, points out weaknesses, and
        improves its own. The debate converges toward a stronger synthesis than either
        model would produce alone.
      </p>

      <h2>When to use</h2>
      <ul>
        <li>Architectural decisions where you want genuinely independent perspectives.</li>
        <li>Comparing approaches before committing to one.</li>
        <li>Stress-testing an idea by having two models challenge each other.</li>
        <li>Catching blind spots a single model might miss.</li>
      </ul>

      <p>
        <a href="https://github.com/omnigent-ai/omnigent/tree/main/examples/debby" target="_blank" rel="noreferrer">
          Source on GitHub
        </a>
      </p>
    </>
  );
}
