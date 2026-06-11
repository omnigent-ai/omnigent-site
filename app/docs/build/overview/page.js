import Link from "next/link";

export const metadata = { title: "Build Your Omnigent" };

export default function Page() {
  return (
    <>
      <h1>Build Your Omnigent</h1>

      <p>
        A custom omnigent is defined in a YAML config file. No imperative code, no framework
        subclassing. The YAML file <strong>is</strong> the agent.
      </p>

      <h2>Start from an example</h2>

      <p>
        The{" "}
        <a
          href="https://github.com/Omnigents/omnigents/tree/main/examples"
          target="_blank"
          rel="noreferrer"
        >
          examples folder
        </a>{" "}
        contains ready-to-run omnigent you can try immediately:
      </p>

      <ul>
        <li>
          <a
            href="https://github.com/Omnigents/omnigents/tree/main/examples/polly"
            target="_blank"
            rel="noreferrer"
          >
            <strong>polly</strong>
          </a>
          : a multi-harness orchestrator that delegates to Claude Code, Codex, and Pi sub-agents.
        </li>
        <li>
          <a
            href="https://github.com/Omnigents/omnigents/tree/main/examples/debby"
            target="_blank"
            rel="noreferrer"
          >
            <strong>debby</strong>
          </a>
          : a brainstorming partner that fans every question to both Claude and GPT.
        </li>
      </ul>

      <p>Browse their configs to see how a small YAML file defines very different agent behaviors.</p>

      <h2>Create it with your coding agent</h2>

      <p>
        The recommended way to create a custom omnigent is to ask your coding agent to build it for
        you:
      </p>

      <pre>
        <code>
          {`You:  Build me a documentation reviewer agent. It should use Claude as
      the model, have access to the file system and GitHub, and follow
      our style guide at docs/STYLE.md.

Agent: Created "docs-reviewer" agent. Opening a new session with it now.
       You can select it from the session dropdown anytime.`}
        </code>
      </pre>

      <p>
        The agent writes the YAML config behind the scenes and registers it so you can reuse it. If
        you want to tweak the config later, the YAML file is there to edit directly.
      </p>

      <h2>What you can configure</h2>

      <p>Every omnigent config supports these sections. Each links to its detailed reference:</p>

      <h3>
        <Link href="/docs/build/harnesses">Harnesses</Link>
      </h3>

      <p>The harness is the runtime that executes your agent loop. Swap one line to switch runtimes.</p>

      <pre>
        <code>
          {`executor:
  harness: claude-sdk`}
        </code>
      </pre>

      <h3>
        <Link href="/docs/build/models">Models &amp; Credentials</Link>
      </h3>

      <p>Pick the LLM that powers your harness.</p>

      <pre>
        <code>
          {`executor:
  harness: claude-sdk
  model: claude-sonnet-4-6`}
        </code>
      </pre>

      <h3>
        <Link href="/docs/build/prompts">Prompts &amp; Skills</Link>
      </h3>

      <p>
        Set the system prompt inline, or point at a file. Skills are reusable instruction bundles
        the agent can load on demand.
      </p>

      <pre>
        <code>
          {`prompt: You are a concise coding assistant.

# Or from a file:
instructions: AGENTS.md`}
        </code>
      </pre>

      <h3>
        <Link href="/docs/build/tools">MCP &amp; Tools</Link>
      </h3>

      <p>Wire in MCP servers, Python functions, or sub-agents.</p>

      <pre>
        <code>
          {`tools:
  github:
    type: mcp
    command: uv
    args: [run, python, -m, github_mcp]
  summarize:
    type: function
    callable: my_package.tools.summarize_file`}
        </code>
      </pre>

      <h3>
        <Link href="/docs/build/policies">Policies</Link>
      </h3>

      <p>Declarative guardrails that enforce ALLOW, ASK, or DENY decisions on agent behavior.</p>

      <pre>
        <code>
          {`policies:
  rate_limit:
    type: function
    handler: omnigent.policies.builtins.safety.max_tool_calls_per_session
    factory_params:
      limit: 50`}
        </code>
      </pre>

      <h2>Full example</h2>

      <p>
        Combine everything into a single <code>config.yaml</code>:
      </p>

      <pre>
        <code>
          {`spec_version: 1
name: coding_agent
prompt: |
  You are a coding agent. Inspect files before editing, run targeted tests,
  and summarize changes with validation results.

executor:
  harness: claude-sdk
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
    description: Search repository files for a pattern.
    callable: my_package.tools.repo_search

policies:
  rate_limit:
    type: function
    handler: omnigent.policies.builtins.safety.max_tool_calls_per_session
    factory_params:
      limit: 50`}
        </code>
      </pre>

      <p>
        Every omnigent lives in its own directory with <code>config.yaml</code> at the root. Skill
        bundles, sub-agent configs, and MCP tool manifests go in sibling folders. See{" "}
        <Link href="/docs/interact/overview">Interact</Link> for how to run it.
      </p>
    </>
  );
}
