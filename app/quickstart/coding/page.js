import Link from "next/link";

export const metadata = { title: "Running a coding agent" };

export default function Page() {
  return (
    <>
      <h1>Running a coding agent</h1>
      <p className="lede-block">
        The fastest way to feel what Omnigent does is to start a coding agent.
        One command takes you from install to a working session in your
        terminal — and the same session is reachable from the browser and your
        phone.
      </p>

      <h2>Start chatting</h2>
      <p>
        Run <code>omnigent</code> with no arguments to pick a model and start
        chatting. It also launches a local web UI at{" "}
        <code>http://localhost:8000</code>, already signed in, so you can switch
        to the browser any time.
      </p>
      <pre><code>omnigent</code></pre>

      <h2>Launch a specific harness</h2>
      <p>
        Or start a named coding harness directly, in a session your team can
        join:
      </p>
      <pre><code>{`omnigent claude     # Claude Code
omnigent codex      # Codex`}</code></pre>

      <h2>Drive it from the browser</h2>
      <p>
        Prefer to work in the web UI? Start a server and register your machine
        as a host, then create chats from the browser — no terminal session
        needed.
      </p>
      <pre><code>{`omnigent server start   # local server + web UI in the background
omnigent host           # (separate terminal) register this machine as a host`}</code></pre>
      <p>
        Check it with <code>omnigent server status</code>; stop everything with{" "}
        <code>omnigent stop</code>.
      </p>

      <h2>Multiple agents in one session</h2>
      <p>
        A supervisor agent can delegate to sub-agents that are each good at
        different things, and review one another&rsquo;s work. The bundled{" "}
        <code>nessie</code> example is a multi-agent coding orchestrator: it
        decomposes a goal, hands it to Claude Code and Codex sub-agents each
        running in its own git worktree, then has them cross-review before you
        merge.
      </p>
      <pre><code>omnigent run examples/nessie/</code></pre>

      <div className="doc-next">
        Next: <Link href="/quickstart/custom-agent">Writing a custom agent →</Link>
      </div>
    </>
  );
}
