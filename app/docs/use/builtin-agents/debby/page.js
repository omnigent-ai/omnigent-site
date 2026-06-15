import Link from "next/link";

export const metadata = {
  title: "Debby",
  // TODO(seo): review/refine this share-card description (auto-derived from page intro).
  description:
    "Debby asks two models the same question and runs a multi-round debate where each critiques and refines the other's answer.",
};

export default function Page() {
  return (
    <>
      <h1>Debby</h1>
      <p className="lede-block">
        Multi-model brainstorming partner. Debby sends every question to both Claude
        and GPT simultaneously, then lets them debate and refine each other{"'"}s answers.
      </p>

      <pre><code>{"omni debby"}</code></pre>

      <h2>How it works</h2>
      <p>
        Ask a question and both models respond independently. You see both perspectives
        side by side. Then use the <code>/debate</code> skill to start a multi-round
        critique where each model reviews the other{"'"}s answer, challenges weak points,
        and refines its own response.
      </p>

      <table>
        <thead>
          <tr><th>Sub-agent</th><th>Role</th></tr>
        </thead>
        <tbody>
          <tr><td><code>claude</code></td><td>Responds and debates with an Anthropic Claude model</td></tr>
          <tr><td><code>gpt</code></td><td>Responds and debates with an OpenAI GPT model</td></tr>
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
