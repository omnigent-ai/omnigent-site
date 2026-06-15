import Link from "next/link";

export const metadata = {
  title: "MCP & Tools",
  // TODO(seo): review/refine this share-card description (auto-derived from page intro).
  description:
    "Give your agent capabilities beyond conversation. Declare tools and MCP servers in your agent YAML, each with a name you choose.",
};

export default function Page() {
  return (
    <>
      <h1>MCP &amp; Tools</h1>

      <p>
        Tools give your agent capabilities beyond conversation. They are declared under the{" "}
        <code>tools</code> key in your agent YAML, each identified by a name you choose.
      </p>

      <p>
        Omnigent supports four tool types: MCP servers, Python functions, sub-agents, and inherited
        tools.
      </p>

      <h2>MCP servers</h2>

      <p>MCP (Model Context Protocol) servers expose tools over a standard protocol.</p>

      <h3>Bundled servers</h3>

      <p>
        The following MCP servers are available out of the box. No setup or configuration needed:
      </p>

      <table>
        <thead>
          <tr>
            <th>Server</th>
            <th>What it connects to</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Google</td>
            <td>Drive, Docs, Sheets, Slides, Gmail, Calendar</td>
          </tr>
          <tr>
            <td>GitHub</td>
            <td>Issues, PRs, repos, code search</td>
          </tr>
          <tr>
            <td>Slack</td>
            <td>Channels, messages, threads</td>
          </tr>
          <tr>
            <td>Jira</td>
            <td>Issues, projects, search</td>
          </tr>
          <tr>
            <td>Confluence</td>
            <td>Pages, spaces, search</td>
          </tr>
          <tr>
            <td>Glean</td>
            <td>Enterprise search</td>
          </tr>
          <tr>
            <td>PagerDuty</td>
            <td>Incidents, on-call</td>
          </tr>
        </tbody>
      </table>

      <p>
        To restrict which tools from a bundled server your agent can access, use the{" "}
        <code>tools</code> filter or configure{" "}
        <Link href="/docs/policies/overview">policies</Link>.
      </p>

      <h3>Custom servers</h3>

      <p>
        For MCP servers not in the bundled set, declare them in your agent YAML. Transport is
        inferred: use <code>command</code> for local stdio servers, <code>url</code> for remote
        HTTP/SSE servers.
      </p>

      <p>
        <strong>Local command (stdio):</strong>
      </p>

      <pre>
        <code>
          {`tools:
  my-server:
    type: mcp
    command: node
    args: [dist/server.js]
    env:
      API_KEY: \${MY_API_KEY}          # env vars expanded at runtime`}
        </code>
      </pre>

      <p>
        <strong>Remote URL (HTTP/SSE):</strong>
      </p>

      <pre>
        <code>
          {`tools:
  docs-api:
    type: mcp
    url: https://example.com/mcp
    headers:
      Authorization: "Bearer \${API_TOKEN}"   # env vars expanded at runtime`}
        </code>
      </pre>

      <p>
        The optional <code>tools</code> list filters which MCP tools are exposed to the agent. Omit
        it to expose everything the server provides.
      </p>

      <h3>Authentication</h3>

      <p>
        As shown in the examples above, custom MCP servers accept credentials through:
      </p>

      <ul>
        <li>
          <strong><code>env</code></strong>: environment variables passed to stdio server processes
          (e.g., <code>{"API_KEY: ${MY_API_KEY}"}</code>)
        </li>
        <li>
          <strong><code>headers</code></strong>: HTTP headers for remote servers, with{" "}
          <code>{"${...}"}</code> env var expansion (e.g.,{" "}
          <code>{"Authorization: \"Bearer ${API_TOKEN}\""}</code>)
        </li>
        <li>
          <strong><code>profile</code></strong> (under <code>auth:</code>): resolves an OAuth token from your{" "}
          <code>~/.databrickscfg</code>:
        </li>
      </ul>

      <pre>
        <code>
          {`tools:
  internal-api:
    type: mcp
    url: https://my-workspace.databricks.com/mcp
    auth:
      profile: my-profile`}
        </code>
      </pre>

      <h2>Python function tools</h2>

      <p>
        Expose any Python callable as a tool. The function is referenced by its fully qualified
        import path:
      </p>

      <pre>
        <code>
          {`tools:
  summarize_file:
    type: function
    description: Summarize a local text file.
    callable: my_package.tools.summarize_file
    parameters:
      type: object
      properties:
        path:
          type: string
      required: [path]`}
        </code>
      </pre>

      <p>
        The JSON Schema under <code>parameters</code> is optional. If you omit it, Omnigent
        auto-generates the schema from the function&apos;s type annotations and signature.
      </p>

      <h2>Sub-agent tools</h2>

      <p>
        Declare agents as tools so a supervisor agent can delegate work to them. You can define a
        sub-agent inline or reference an external config file.
      </p>

      <h3>Inline definition</h3>

      <p>
        Define the sub-agent&apos;s full spec directly in the <code>tools</code> block:
      </p>

      <pre>
        <code>
          {`tools:
  reviewer:
    type: agent
    description: Review proposed code changes.
    prompt: |
      You are a careful code reviewer. Focus on correctness,
      tests, security, and maintainability.
    executor:
      harness: claude-sdk
      model: claude-sonnet-4-6
    os_env: inherit
    pass_history: true
    max_sessions: 2`}
        </code>
      </pre>

      <h3>External config file</h3>

      <p>
        Point to a separate YAML file containing the sub-agent&apos;s spec. This is useful when the
        sub-agent is complex, shared across multiple parents, or maintained independently:
      </p>

      <pre>
        <code>
          {`tools:
  reviewer:
    type: agent
    description: Review proposed code changes.
    config: agents/reviewer.yaml`}
        </code>
      </pre>

      <p>
        The <code>config</code> path resolves relative to the parent agent&apos;s YAML directory.
        The referenced file is a standard agent config that can define its own tools, skills,
        harness, and policies.
      </p>

      <p>
        A sub-agent tool can have its own{" "}
        <Link href="/docs/build/harnesses">harness</Link>, model, tools, and{" "}
        <Link href="/docs/policies/overview">policies</Link>. The <code>pass_history</code> flag
        controls whether the parent&apos;s conversation history is forwarded, and{" "}
        <code>max_sessions</code> limits concurrent invocations.
      </p>

      <h2>Tool inheritance</h2>

      <p>
        Use <code>inherit</code> to pass one of the parent&apos;s tools down to a sub-agent:
      </p>

      <pre>
        <code>
          {`tools:
  researcher:
    type: agent
    prompt: Research and summarize.
    tools:
      word_count: inherit    # gets word_count from parent`}
        </code>
      </pre>

      <p>
        The sub-agent receives the same tool definition the parent has, with no duplication.
      </p>

      <p>
        Use <code>spec: self</code> for a sub-agent that clones the entire parent spec. It gets the
        same tools, prompt, and configuration as the parent agent.
      </p>

      <h2>Combine tool types</h2>

      <p>
        A single agent can mix all tool types. The <code>tools</code> block is a flat map of names
        to definitions:
      </p>

      <pre>
        <code>
          {`tools:
  github:
    type: mcp
    command: uv
    args: [run, python, -m, my_package.github_mcp]

  summarize_file:
    type: function
    callable: my_package.tools.summarize_file

  reviewer:
    type: agent
    config: agents/reviewer.yaml`}
        </code>
      </pre>
    </>
  );
}
