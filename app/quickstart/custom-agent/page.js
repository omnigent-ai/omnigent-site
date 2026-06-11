import Link from "next/link";

export const metadata = { title: "Writing a custom agent" };

export default function Page() {
  return (
    <>
      <h1>Writing a custom agent</h1>
      <p className="lede-block">
        An agent is a short YAML file: your prompt, your tools, and optional
        helper sub-agents. The harness underneath is an implementation detail
        you can change in one line.
      </p>

      <h2>A minimal agent</h2>
      <pre><code>{`name: my_agent
prompt: You are a helpful data analyst.

executor:
  harness: claude-sdk          # or: codex, openai-agents, native-claude, native-codex

tools:
  # A local Python function (schema auto-generated from the signature)
  word_count:
    type: function
    callable: mypackage.mymodule.word_count

  # A sub-agent the supervisor can delegate to
  researcher:
    type: agent
    prompt: Search for relevant information and summarize it.
    tools:
      word_count: inherit`}</code></pre>

      <p>Run it like any other agent:</p>
      <pre><code>omnigent run path/to/my_agent.yaml</code></pre>

      <h2>Switching harnesses</h2>
      <p>
        The <code>executor.harness</code> field is the only thing that changes
        when you move the same agent from one runtime to another — Claude Agent
        SDK, OpenAI Agents, Codex, or Pi. Everything you wrote above it stays the
        same.
      </p>

      <h2>Composing sub-agents</h2>
      <p>
        Add agents under <code>tools</code> and the supervisor can delegate to
        them. This is how you build the patterns that improve quality — advisor
        models, routing, and multi-agent debate. For a worked example, the{" "}
        <code>polly</code> sample sends every question to a Claude head and a GPT
        head in parallel and lays both answers side by side; load its{" "}
        <code>debate</code> skill and the two heads critique each other before
        converging.
      </p>

      <div className="note">
        <p>
          Custom agents get the same batteries as coding agents: a UI, a REST
          API, mobile access, history, and policies — without writing any of
          that yourself.
        </p>
      </div>

      <div className="doc-next">
        Next: <Link href="/quickstart/policies">Policies →</Link>
      </div>
    </>
  );
}
