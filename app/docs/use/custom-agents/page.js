import Link from "next/link";

export const metadata = { title: "Custom Agents" };

export default function Page() {
  return (
    <>
      <h1>Custom Agents</h1>
      <p>
        A custom agent is defined in a short YAML file. No imperative code, no
        framework subclassing. The YAML file <strong>is</strong> the agent. You get
        the entire Omnigent platform for free: web UI, persistent sessions, team
        collaboration, deployment infrastructure, and{" "}
        <Link href="/docs/policies/overview">contextual policies</Link>.
      </p>

      <h2>Create it with your coding agent</h2>
      <p>
        The recommended way to create a custom agent is to ask your coding agent to
        build it for you in natural language:
      </p>
      <pre><code>{`You: Build me a documentation reviewer agent. It should use Claude as
     the model, have access to the file system and GitHub, and follow
     our style guide at docs/STYLE.md.

Agent: Created "docs-reviewer" agent. Opening a new session with it now.
       You can select it from the session dropdown anytime.`}</code></pre>
      <p>
        The agent writes the YAML behind the scenes and registers it so you can
        reuse it. If you want to tweak the config later, the YAML file is there
        to edit directly.
      </p>

      <h2>The config file</h2>
      <p>
        Every custom agent lives in its own directory with a <code>config.yaml</code> at
        the root. You can place the directory anywhere on disk. Run it with:
      </p>
      <pre><code>{`omni run ./my-agent/              # directory containing config.yaml`}</code></pre>

      <h2>What you can configure</h2>
      <p>The config file supports these sections:</p>

      <h3><Link href="/docs/build/harnesses">Harnesses</Link></h3>
      <p>
        The harness is the runtime that executes your agent loop. Swap one line
        to switch runtimes.
      </p>
      <pre><code>{`executor:
  type: omnigent
  config:
    harness: claude`}</code></pre>

      <h3><Link href="/docs/build/models">Models &amp; Credentials</Link></h3>
      <p>Pick the LLM that powers your harness.</p>
      <pre><code>{`executor:
  type: omnigent
  config:
    harness: claude
  model: claude-sonnet-4-6`}</code></pre>

      <h3><Link href="/docs/build/prompts">Prompts &amp; Skills</Link></h3>
      <p>Set the system prompt inline, or point at a file.</p>
      <pre><code>{`prompt: You are a concise coding assistant.

# Or from a file:
instructions: AGENTS.md`}</code></pre>

      <h3><Link href="/docs/build/tools">MCP &amp; Tools</Link></h3>
      <p>Wire in MCP servers, Python functions, or sub-agents.</p>
      <pre><code>{`tools:
  github:
    type: mcp
    command: uv
    args: [run, python, -m, github_mcp]
  summarize:
    type: function
    callable: my_package.tools.summarize_file`}</code></pre>

      <h3><Link href="/docs/policies/overview">Policies</Link></h3>
      <p>Declarative guardrails in YAML.</p>
      <pre><code>{`policies:
  rate_limit:
    type: function
    handler: omnigent.policies.builtins.safety.max_tool_calls_per_session
    factory_params:
      limit: 50`}</code></pre>

      <h2>Putting it all together</h2>
      <pre><code>{`spec_version: 1
name: coding_agent
prompt: |
  You are a coding agent. Inspect files before editing, run targeted tests,
  and summarize changes with validation results.

executor:
  type: omnigent
  config:
    harness: claude
  model: claude-sonnet-4-6

os_env:
  type: caller_process
  cwd: .
  sandbox:
    write_paths: [.]
    allow_network: true

tools:
  repo_search:
    type: function
    callable: my_package.tools.repo_search

policies:
  rate_limit:
    type: function
    handler: omnigent.policies.builtins.safety.max_tool_calls_per_session
    factory_params:
      limit: 50`}</code></pre>

    </>
  );
}
