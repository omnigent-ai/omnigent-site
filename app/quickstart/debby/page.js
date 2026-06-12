import Link from "next/link";

export const metadata = { title: "Tutorial: Debby" };

export default function Page() {
  return (
    <>
      <h1>Tutorial: Debby</h1>

      <p>
        Your first taste of what Omnigent can do. Debby sends every question to
        both Claude and GPT at the same time, then lets them debate each other.
        No coding required, just ask a question.
      </p>

      <p>
        <strong>Time:</strong> 2 minutes. <strong>Everything runs locally.</strong>
      </p>

      <h2>1. Run Debby</h2>

      <pre><code>{"omni debby"}</code></pre>

      <p>
        This starts a session in your terminal and opens a web UI at{" "}
        <code>http://localhost:6767</code>. Both Claude and GPT are ready to go.
      </p>

      <h2>2. Ask a question</h2>

      <p>Try something fun or something you genuinely want two perspectives on:</p>

      <pre><code>{"What came first, the chicken or the egg?"}</code></pre>

      <p>
        Both models respond independently. You see both perspectives side by
        side in the web UI. Notice where they agree and where they diverge.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/docs/debby-quickstart-chicken-egg.gif"
        alt="Debby showing Claude and GPT responses to the chicken-or-egg question"
        style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }}
      />

      <h2>3. Start a debate</h2>

      <p>Now type:</p>

      <pre><code>{"/debate"}</code></pre>

      <p>
        Each model reviews the other{"'"}s answer, challenges weak points, and
        refines its own. Watch them go back and forth, each round getting
        sharper. The debate converges toward a stronger synthesis than either
        model would produce alone.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/docs/debby-quickstart-chicken-egg-debate.png"
        alt="Debby debate synthesis for the chicken-or-egg question"
        style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }}
      />

      <h2>4. Try a real question</h2>

      <p>Debby is most useful for questions where independent perspectives matter:</p>

      <pre><code>{"Should we use a monorepo or polyrepo for a team of 20 engineers building 5 microservices?"}</code></pre>

      <p>
        Run <code>/debate</code> again. This is multi-AI orchestration: genuinely
        independent models stress-testing each other{"'"}s reasoning, not just
        two copies of the same opinion.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/docs/debby-debate-synthesis-tight.png"
        alt="Debby debate synthesis for the monorepo-or-polyrepo question"
        style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }}
      />

      <p>
        See <Link href="/docs/use/builtin-agents/debby">Debby reference</Link> for
        more details.
      </p>

      <h2>What{"'"}s next</h2>

      <ul>
        <li>
          <Link href="/quickstart/coding-agent">Coding Agent tutorial</Link> to
          see what Omnigent adds on top of Claude Code.
        </li>
        <li>
          <Link href="/quickstart/polly">Polly tutorial</Link> to
          see multi-agent coding orchestration in action.
        </li>
      </ul>
    </>
  );
}
