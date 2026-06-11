import Link from "next/link";

export const metadata = { title: "Custom Omnigent Quickstart" };

export default function Page() {
  return (
    <>
      <h1>Custom Omnigent Quickstart</h1>

      <p>
        Why build on Omnigent instead of writing your own agent from scratch?
        Because you get the entire platform for free: a web UI, persistent sessions,
        team collaboration, multi-device access, deployment infrastructure, and{" "}
        <Link href="/docs/policies/overview">contextual policies</Link> that no
        other framework provides. You focus on what your agent does. Omnigent handles
        everything around it.
      </p>

      <p>
        A custom omnigent is defined in a short YAML file. No imperative code needed.
      </p>

      <h2>1. Start from a template</h2>

      <p>
        Create a file called <code>my_agent.yaml</code>:
      </p>

      <pre>
        <code>
          {"name: my_agent\nprompt: You are a helpful data analyst.\n\nexecutor:\n  harness: claude-sdk"}
        </code>
      </pre>

      <p>
        That{"'"}s a complete agent. A name, a prompt, and a harness. Everything
        else is optional.
      </p>

      <h2>2. Run it</h2>

      <pre>
        <code>{"omni run my_agent.yaml"}</code>
      </pre>

      <p>
        This launches the agent with the terminal and web UI, just like the{" "}
        <Link href="/quickstart/coding-agent">coding agent quickstart</Link>.
      </p>

      <h2>3. Iterate</h2>

      <p>
        Make it yours. Each change takes effect the next time you start a
        session.
      </p>

      <p>
        <strong>Change the prompt.</strong> For longer prompts, point to a
        markdown file:
      </p>

      <pre>
        <code>{"instructions: AGENTS.md"}</code>
      </pre>

      <p>
        <strong>Add tools.</strong> Give the agent new capabilities with Python
        functions, MCP servers, or sub-agents:
      </p>

      <pre>
        <code>
          {"tools:\n  query_db:\n    type: function\n    callable: mypackage.db.run_query\n\n  github:\n    type: mcp\n    command: uv\n    args: [run, python, -m, my_package.github_mcp]"}
        </code>
      </pre>

      <p>
        <strong>Give it file access.</strong> By default agents can{"'"}t read or
        write files:
      </p>

      <pre>
        <code>
          {"os_env:\n  type: caller_process\n  cwd: .\n  sandbox:\n    write_paths: [.]\n    allow_network: true"}
        </code>
      </pre>

      <p>
        See <Link href="/docs/use/custom-agents">Custom Agents</Link> for the
        full config reference.
      </p>

      <h2>Multi-harness: try Polly</h2>

      <p>
        Want to see multiple harnesses working together? Polly is a built-in
        example that orchestrates Claude Code, Codex, and Pi as sub-agents on
        the same task:
      </p>

      <pre>
        <code>
          {"omni                        # launches Polly by default\nomni run examples/polly/    # or run it explicitly"}
        </code>
      </pre>

      <p>
        Polly is a supervisor that breaks your task into sub-tasks and delegates
        each one to a different harness. Open the web UI to watch sub-agents
        working in parallel, each in its own git worktree, each opening its own
        PR.
      </p>

      <p>
        See the{" "}
        <a
          href="https://github.com/omnigent-ai/omnigent/tree/main/examples/polly"
          target="_blank"
          rel="noreferrer"
        >
          Polly config on GitHub
        </a>{" "}
        to learn how multi-harness orchestration is configured.
      </p>

      <h2>4. Everything else applies</h2>

      <p>
        Once your agent is running, the rest of the workflow from the{" "}
        <Link href="/quickstart/coding-agent">coding agent quickstart</Link> applies:
        interact, set policies, deploy, mobile, collaboration, and sandboxing.
      </p>
    </>
  );
}
