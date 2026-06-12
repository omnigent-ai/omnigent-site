import Link from "next/link";

export const metadata = { title: "Builtin Policies" };

export default function Page() {
  return (
    <>
      <h1>Builtin Policies</h1>

      <p>
        Omnigent ships with policies for common guardrails, organized into two categories:{" "}
        <strong>Safety</strong> and <strong>Cost Control</strong>. Your omnigent can apply any of
        these by name when you{" "}
        <Link href="/docs/policies/overview#adding-a-policy">ask it to add a policy</Link>, or you
        can reference them in YAML by their full path in the <code>handler</code> field.
      </p>

      <p>
        All builtin policies live under <code>omnigent.policies.builtins</code>.
      </p>

      <h2>Safety</h2>

      <table>
        <thead>
          <tr>
            <th>Policy</th>
            <th>What it does</th>
            <th>Parameters</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>max_tool_calls_per_session</code></td>
            <td>DENYs after a total tool-call limit is reached.</td>
            <td><code>limit</code> (int, default <code>100</code>)</td>
          </tr>
          <tr>
            <td><code>ask_on_os_tools</code></td>
            <td>ASKs before any file or shell operation.</td>
            <td>None</td>
          </tr>
          <tr>
            <td><code>block_skills</code></td>
            <td>Prevents specific skills from loading.</td>
            <td><code>blocked</code> (string[], required)</td>
          </tr>
          <tr>
            <td><code>enforce_sandbox</code></td>
            <td>Forces a sandbox configuration on agent start.</td>
            <td>
              <code>sandbox_type</code>, <code>allow_network</code>, <code>write_paths</code>,{" "}
              <code>read_paths</code>
            </td>
          </tr>
          <tr>
            <td><code>deny_pii_in_llm_request</code></td>
            <td>Scans outgoing messages for PII and blocks or flags them.</td>
            <td>
              <code>pii_types</code> (string[]), <code>action</code> (<code>&quot;DENY&quot;</code>{" "}
              or <code>&quot;ASK&quot;</code>)
            </td>
          </tr>
          <tr>
            <td><code>github_policy</code></td>
            <td>Controls GitHub read/write access across MCP tools and shell commands.</td>
            <td>
              <code>read_all</code>, <code>write_repos</code>, <code>write_branches</code>
            </td>
          </tr>
          <tr>
            <td><code>gdrive_policy</code></td>
            <td>
              Controls Google Drive, Docs, Sheets, and Slides access. Writes restricted to
              agent-created files by default.
            </td>
            <td>
              <code>read_all</code>, <code>allow_create</code>, <code>write_files</code>
            </td>
          </tr>
          <tr>
            <td><code>gmail_policy</code></td>
            <td>Controls Gmail. Defaults to read + draft, no send.</td>
            <td>
              <code>allow_read</code>, <code>allow_send</code>, <code>allow_drafts</code>
            </td>
          </tr>
          <tr>
            <td><code>gcalendar_policy</code></td>
            <td>Controls Google Calendar. Defaults to read-only.</td>
            <td>None</td>
          </tr>
          <tr>
            <td><code>block_working_dir_changes</code></td>
            <td>Blocks shell commands that change the working directory.</td>
            <td>
              <code>block_cd</code> (bool), <code>block_worktree</code> (bool),{" "}
              <code>allowed_dirs</code> (string[]), <code>action</code> (<code>&quot;deny&quot;</code>{" "}
              or <code>&quot;ask&quot;</code>)
            </td>
          </tr>
          <tr>
            <td><code>cel_policy</code></td>
            <td>
              Write custom policy logic using CEL (Common Expression Language), a safe,
              non-Turing-complete expression language.
            </td>
            <td>
              <code>expression</code> (CEL expression string), <code>reason</code> (deny message)
            </td>
          </tr>
          <tr>
            <td><code>prompt_policy</code></td>
            <td>
              Evaluate policy decisions using an LLM. The policy sends the event context to a model
              and interprets the response as ALLOW/ASK/DENY. Useful for nuanced decisions that
              can{"'"}t be expressed as static rules.
            </td>
            <td>
              <code>prompt</code> (system instructions for the evaluator model)
            </td>
          </tr>
          <tr>
            <td><code>risk_score_policy</code></td>
            <td>
              Accumulate a risk score from tool calls and sensitive data labels. Escalates guarded
              tools to ASK or DENY once the score exceeds a threshold.
            </td>
            <td>
              <code>threshold</code> (int), <code>tool_points</code> (object mapping tool names to
              points), <code>sensitive_labels</code> (object mapping labels to points),{" "}
              <code>guarded_tools</code> (string[]), <code>escalate_action</code> (<code>&quot;ASK&quot;</code>{" "}
              or <code>&quot;DENY&quot;</code>)
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Cost Control</h2>

      <table>
        <thead>
          <tr>
            <th>Policy</th>
            <th>What it does</th>
            <th>Parameters</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>cost_budget</code></td>
            <td>
              Tracks cumulative LLM spend per session. ASKs at soft thresholds, blocks expensive
              models at the hard limit.
            </td>
            <td>
              <code>max_cost_usd</code> (required), <code>ask_thresholds_usd</code>,{" "}
              <code>expensive_models</code>
            </td>
          </tr>
          <tr>
            <td><code>user_daily_cost_budget</code></td>
            <td>
              Same as <code>cost_budget</code>, but enforced per-user daily across all sessions.
            </td>
            <td>
              <code>max_cost_usd</code> (required), <code>ask_thresholds_usd</code>
            </td>
          </tr>
          <tr>
            <td><code>deny_trivial_to_expensive_model</code></td>
            <td>
              Classifies messages as trivial or complex. Routes trivial tasks away from expensive
              models.
            </td>
            <td>None</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
