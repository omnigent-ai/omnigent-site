import Link from "next/link";

export const metadata = { title: "Tutorial: Contextual Policies" };

export default function Page() {
  return (
    <>
      <h1>Tutorial: Contextual Policies</h1>

      <p>
        Omnigent ships with a set of context-aware policies you can attach to any
        live session, no code required. They watch what your agent is doing and
        step in when it matters: warning you about spend, pausing for approval, or
        blocking a risky action outright. This tutorial walks you through setting
        one up on a running session.
      </p>

      <p>
        <strong>Time:</strong> 5 minutes. <strong>Everything runs locally.</strong>
      </p>

      <h2>1. Start a new session</h2>

      <p>
        Open the web UI and start a new session with whichever agent you like.
        We{"'"}ll use a Claude Code session for this walkthrough, but policies work
        the same across every agent type.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/docs/policy-new-session.png" alt="Starting a new Claude Code session in the Omnigent web UI" style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }} />

      <h2>2. Add a policy to the session</h2>

      <p>
        Click the info button <code>(i)</code> at the top of the page to open the
        session panel. You{"'"}ll see the current session cost and a{" "}
        <strong>Policies</strong> section. Hit the <code>+</code> button to add a
        new built-in policy.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/docs/policy-info-panel.png" alt="The session info panel showing session cost and the add-policy button" style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }} />

      <p>
        There are plenty of policies to choose from. For this tutorial we{"'"}ll
        pick <strong>Session Cost Budget</strong>, which keeps an eye on how much
        the session is spending on the model.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/docs/policy-cost-budget-config.png" alt="Configuring the Session Cost Budget policy" style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }} />

      <p>The cost policy gives you two kinds of guardrails:</p>

      <ul>
        <li>
          <strong>Soft limits</strong> — a list of spend thresholds that act as
          gentle warnings. When the session cost crosses one, you get a heads-up
          on the next tool call and can decide whether to keep going. For the demo
          we{"'"}ll set a soft limit of <code>0.01</code>.
        </li>
        <li>
          <strong>Hard limit</strong> — a ceiling paired with a list of{" "}
          <strong>expensive models</strong>. Once spend passes the hard limit, the
          session blocks any of those pricey models until you downgrade to a
          cheaper one. We{"'"}ll set the hard limit to <code>0.2</code> and keep
          the default expensive-model list (Opus, GPT-5.5).
        </li>
      </ul>

      <p>
        Fill in the values and click <strong>Add</strong>. The policy is now live
        on this session.
      </p>

      <h2>3. Watch the policy in action</h2>

      <p>
        Keep an eye on the running cost in the info panel <code>(i)</code> as you
        chat. Now let{"'"}s trip each guardrail.
      </p>

      <h3>Cross the soft limit</h3>
      <p>
        Once spend passes your soft limit, ask the agent to run any tool. Instead
        of charging ahead, it pauses and asks whether you want to continue. Approve
        to keep going, or reject to stop the call.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/docs/policy-soft-limit-approval.png" alt="Approval prompt shown after the session cost crosses the soft limit" style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }} />

      <h3>Hit the hard limit</h3>
      <p>
        When spend reaches the hard limit, the policy blocks every following tool
        call that would use an expensive model. The agent tells you what happened
        and waits — switch to a cheaper model and you{"'"}re free to continue.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/docs/policy-hard-limit-blocked.png" alt="Expensive models blocked after the session hits the hard cost limit, then unblocked by downgrading" style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }} />

      <p>
        That{"'"}s the whole loop: warn, ask, block. The same pattern applies to
        every built-in policy, so you can mix and match them to fit how you want a
        session to behave.
      </p>

      <h2>What{"'"}s next</h2>

      <ul>
        <li>
          <Link href="/docs/policies/overview">Contextual Policies overview</Link> —
          all the ways to apply policies (chat, omnigent YAML, or server config).
        </li>
        <li>
          <Link href="/docs/policies/builtin">Builtin Policies</Link> — the full
          catalog of policies you can add out of the box.
        </li>
        <li>
          <Link href="/docs/policies/custom">Custom Policies</Link> — write your own
          in Python when the builtins don{"'"}t cover your use case.
        </li>
      </ul>
    </>
  );
}
