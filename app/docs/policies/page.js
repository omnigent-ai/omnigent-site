import Link from "next/link";

export const metadata = { title: "Policies" };

export default function Page() {
  return (
    <>
      <h1>Policies</h1>
      <p className="lede-block">
        Policies let an agent run shell commands, edit files, or spend tokens on
        your terms. Each one checks an action and either allows it, blocks it, or
        pauses to ask you first.
      </p>

      <h2>Turning policies on</h2>
      <p>You don&rsquo;t need a config file to use them:</p>
      <ul>
        <li>
          <strong>In the web UI</strong> — open a session&rsquo;s info panel to
          browse the available policies and toggle them on or off.
        </li>
        <li>
          <strong>In chat</strong> — just ask: <em>&ldquo;add a policy that asks
          me before running shell commands.&rdquo;</em> The agent sets it up.
        </li>
      </ul>

      <h2>Defining defaults</h2>
      <p>
        For defaults that apply to everyone, or to a specific agent, declare
        them in your server config or an agent&rsquo;s YAML:
      </p>
      <pre><code>{`policies:
  approve_shell:
    type: function
    handler: omnigent.policies.builtins.safety.ask_on_os_tools   # ask before shell / file writes
  cap_calls:
    type: function
    handler: omnigent.policies.builtins.safety.max_tool_calls_per_session
    factory_params:
      limit: 50                    # cap how many tools one session can call
  budget:
    type: function
    handler: omnigent.policies.builtins.cost.cost_budget
    factory_params:
      max_cost_usd: 5.00           # hard spend cap...
      ask_thresholds_usd: [3.00]   # ...with a soft warning on the way`}</code></pre>

      <h2>Stateful and layered</h2>
      <p>
        Policies are <strong>stateful</strong>: they can track what an agent has
        actually done over a session — that it installed a package, or already
        read a sensitive table — and adapt, like refusing to let that same
        session push to git or send data to an external endpoint.
      </p>
      <p>
        They also stack across three levels — <strong>server-wide</strong>{" "}
        (admin), <strong>per-agent</strong> (developer), and{" "}
        <strong>per-session</strong> (you) — with the stricter session rules
        checked first. Spend caps, GitHub and workspace access limits, and more
        are built in.
      </p>

      <div className="doc-next">
        Next: <Link href="/docs/sandboxes">Sandboxes →</Link>
      </div>
    </>
  );
}
