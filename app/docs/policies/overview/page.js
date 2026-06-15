import Link from "next/link";

export const metadata = {
  title: "Contextual Policies",
  // TODO(seo): review/refine this share-card description (auto-derived from page intro).
  description:
    "Policies control what your Omnigent can do, intercepting every action to allow, ask for approval, or deny it in real time.",
};

export default function Page() {
  return (
    <>
      <h1>Contextual Policies</h1>

      <p>
        Policies control what your Omnigent can and cannot do. They intercept every
        action (tool calls, LLM requests, file operations) and decide in real time
        whether to <strong>allow</strong>, <strong>ask for approval</strong>, or{" "}
        <strong>deny</strong>.
      </p>

      <h2>Why &ldquo;contextual&rdquo;?</h2>

      <p>
        Most agent frameworks offer static rules: allow this tool, deny that one.
        Omnigent policies are different. They are <strong>stateful</strong> and{" "}
        <strong>dynamic</strong>: each policy maintains its own state across the
        entire session and makes decisions based on what has happened so far.
      </p>

      <p>This is what enables policies that static systems simply cannot express:</p>

      <ul>
        <li>
          <strong>Cost budgets.</strong> Track cumulative LLM spend across every turn.
          Warn at $3, block expensive models at $5. The policy remembers what
          you{"'"}ve spent.
        </li>
        <li>
          <strong>Rate limiting.</strong> Count tool calls over time and deny after a
          threshold. The count persists across the session, not per-request.
        </li>
        <li>
          <strong>Risk scoring.</strong> Accumulate a risk score from sensitive
          operations (accessing credentials, modifying production data). Escalate
          to human approval once the score crosses a threshold.
        </li>
        <li>
          <strong>Model routing.</strong> Classify tasks as trivial or complex and
          redirect trivial ones away from expensive models, based on conversation
          context.
        </li>
      </ul>

      <p>
        Every policy evaluation receives the full session context: cumulative cost,
        tool call history, data classification labels, and custom state you define.
        This makes Omnigent{"'"}s policy system fundamentally more powerful than the
        static security controls built into individual coding agents.
      </p>

      <h2>What you can enforce</h2>

      <p>
        For example: cap spending, require approval before destructive actions,
        restrict access to repos or services, block PII, or route models. See{" "}
        <Link href="/docs/policies/builtin">Builtin Policies</Link> for the full list.
      </p>

      <h2>How policies work</h2>

      <p>Each policy returns one of three decisions:</p>

      <table>
        <thead>
          <tr>
            <th>Decision</th>
            <th>What happens</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>ALLOW</strong></td>
            <td>The action proceeds.</td>
          </tr>
          <tr>
            <td><strong>ASK</strong></td>
            <td>The action pauses until the user approves or rejects it.</td>
          </tr>
          <tr>
            <td><strong>DENY</strong></td>
            <td>The action is blocked with an error message.</td>
          </tr>
        </tbody>
      </table>

      <p>
        Policies are checked in order. The first policy to return a decision wins. No opinion (
        <code>None</code>) passes to the next policy.
      </p>

      <h3>Available policies</h3>

      <p>
        Omnigent provides{" "}
        <Link href="/docs/policies/builtin">builtin policies</Link> for common guardrails (cost
        budgets, approval gates, access controls, PII blocking, model routing). You can also write
        your own <Link href="/docs/policies/custom">custom policies</Link> in Python and register
        them on the server to make them available:
      </p>

      <pre>
        <code>
          {`# server config (config.yaml)
policy_modules:
  - myorg.policies`}
        </code>
      </pre>

      <p>
        This makes your custom policies discoverable alongside the builtins. See{" "}
        <Link href="/docs/policies/custom">Custom Policies</Link> for how to write and register
        them.
      </p>

      <h3>Three levels</h3>

      <p>
        To apply a policy, you pick one (builtin or custom) and add it at one of three levels. Each
        level has a different scope and priority:
      </p>

      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>Who</th>
            <th>Scope</th>
            <th>How to add</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Session</strong></td>
            <td>End user</td>
            <td>Current session only, not persistent</td>
            <td>Ask your Omnigent, or use the UI settings panel</td>
            <td>First</td>
          </tr>
          <tr>
            <td><strong>Omnigent config</strong></td>
            <td>Developer</td>
            <td>Every session using this Omnigent</td>
            <td><code>policies</code> block in the Omnigent YAML</td>
            <td>Second</td>
          </tr>
          <tr>
            <td><strong>Server-wide</strong></td>
            <td>Admin</td>
            <td>Every agent and session on the server</td>
            <td>Server config YAML or REST API</td>
            <td>Last</td>
          </tr>
        </tbody>
      </table>

      <p>
        An admin can set a company-wide cost cap, a developer can restrict which repos the Omnigent
        writes to, and an end user can add extra approval gates. All three levels are enforced
        simultaneously.
      </p>

      <h2>Adding a policy</h2>

      <h3>Session level: ask your Omnigent (recommended)</h3>

      <p>
        The easiest way to add a policy is to ask your Omnigent directly. Describe what you want in
        plain language:
      </p>

      <pre>
        <code>
          {`You: Add a policy that asks me before running any shell commands.

You: Limit this session to $5 of LLM spend.

You: Block access to all GitHub repos except myorg/frontend.`}
        </code>
      </pre>

      <p>
        Your Omnigent picks the right policy from the available registry (both{" "}
        <Link href="/docs/policies/builtin">builtin</Link> and any{" "}
        <Link href="/docs/policies/custom">custom policies</Link> registered on the server),
        configures the parameters, and asks for your approval. Once you approve, the policy takes
        effect immediately on the next turn of the current session.
      </p>

      <p>
        You can also browse and toggle policies from the <strong>settings panel</strong> in the web
        UI without typing anything in chat.
      </p>

      <h3>Omnigent config level: declare in YAML</h3>

      <p>
        For policies that should always apply, declare them in the <code>policies</code> block of
        your Omnigent config. These take effect every time the Omnigent starts.
      </p>

      <pre>
        <code>
          {`policies:
  approve_file_ops:
    type: function
    handler: omnigent.policies.builtins.safety.ask_on_os_tools
  rate_limit:
    type: function
    handler: omnigent.policies.builtins.safety.max_tool_calls_per_session
    factory_params:
      limit: 50`}
        </code>
      </pre>

      <p>
        Here <code>rate_limit</code> caps the total number of tool calls a single session can make
        (50 in this example), a guard against runaway agent loops and surprise cost. Once the cap
        is reached, further tool calls are denied for the rest of the session.
      </p>

      <p>
        Policies without parameters use just <code>handler</code>. Configurable policies add{" "}
        <code>factory_params</code>. Multiple policies are evaluated in the order declared.
      </p>

      <h3>Server-wide level: server config</h3>

      <p>
        Server-wide policies apply to every session on your deployed server. Add them to your server
        config YAML (<code>~/.omnigent/config.yaml</code> on a laptop,{" "}
        <code>/data/config.yaml</code> in Docker):
      </p>

      <pre>
        <code>
          {`policies:
  session_cost_guard:
    type: function
    function:
      path: omnigent.policies.builtins.cost.cost_budget
      arguments:
        ask_thresholds_usd: [1.0]
        max_cost_usd: 5.0
  user_daily_cost_guard:
    type: function
    function:
      path: omnigent.policies.builtins.cost.user_daily_cost_budget
      arguments:
        ask_thresholds_usd: [10.0, 25.0]
        max_cost_usd: 50.0`}
        </code>
      </pre>

      <p>
        Server-wide policies use the <code>{"function: {path, arguments}"}</code> format (not{" "}
        <code>handler</code> / <code>factory_params</code>). Restart the server after editing.
      </p>

      <p>
        Server-wide policies can also be managed at runtime via the REST API:
      </p>

      <table>
        <thead>
          <tr>
            <th>Method</th>
            <th>Endpoint</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>POST</code></td>
            <td><code>/v1/policies</code></td>
            <td>Create a policy</td>
          </tr>
          <tr>
            <td><code>GET</code></td>
            <td><code>/v1/policies</code></td>
            <td>List all policies</td>
          </tr>
          <tr>
            <td><code>PATCH</code></td>
            <td><code>/v1/policies/{"{id}"}</code></td>
            <td>Update a policy</td>
          </tr>
          <tr>
            <td><code>DELETE</code></td>
            <td><code>/v1/policies/{"{id}"}</code></td>
            <td>Remove a policy</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
