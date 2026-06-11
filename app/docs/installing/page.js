import Link from "next/link";

export const metadata = { title: "Installing" };

export default function Page() {
  return (
    <>
      <h1>Installing</h1>
      <p className="lede-block">
        Omnigent runs on your laptop, a server, or a container. Install it with
        pip and you have a working agent a moment later.
      </p>

      <h2>Requirements</h2>
      <ul>
        <li><strong>Python 3.12 or newer.</strong></li>
        <li>
          <strong>Node.js 22 LTS+</strong> and <code>npm</code> — needed for the
          Claude Code / Codex / Pi coding harnesses. <code>omnigent run</code>{" "}
          installs the harness CLI you pick.
        </li>
        <li>
          <strong>tmux</strong> — the native <code>omnigent claude</code> /{" "}
          <code>omnigent codex</code> wrappers launch the agent through a local
          terminal (<code>brew install tmux</code> or <code>apt install tmux</code>).
        </li>
      </ul>

      <h2>Install</h2>
      <pre><code>pip install omnigent</code></pre>
      <p>Rerun the same command later to upgrade.</p>

      <div className="note">
        <p>
          On first run, Omnigent picks up any model credentials already in your
          environment — an <code>ANTHROPIC_API_KEY</code> or{" "}
          <code>OPENAI_API_KEY</code>, or a <code>claude</code> / <code>codex</code>{" "}
          CLI you&rsquo;re already signed into — and offers it as the default.
        </p>
      </div>

      <h2>Choosing a model</h2>
      <p>
        Run <code>omnigent setup</code> to add a credential, set a default, or
        remove one. Omnigent works with four kinds of credentials, and defaults
        are per agent, so a Claude default and a Codex default can coexist.
      </p>
      <table>
        <thead>
          <tr><th>Kind</th><th>What it is</th></tr>
        </thead>
        <tbody>
          <tr><td>API key</td><td>A first-party vendor key — Anthropic, OpenAI, …</td></tr>
          <tr><td>Subscription</td><td>A Claude Pro/Max or ChatGPT plan, via the official <code>claude</code> / <code>codex</code> CLIs</td></tr>
          <tr><td>Gateway</td><td>Any OpenAI- or Anthropic-compatible <code>base_url</code> + key — OpenRouter, LiteLLM, Ollama, vLLM, Azure, …</td></tr>
          <tr><td>Databricks</td><td>A Databricks workspace profile</td></tr>
        </tbody>
      </table>
      <p>
        You can also switch models mid-session with the <code>/model</code>{" "}
        command.
      </p>

      <div className="doc-next">
        Next: <Link href="/docs/coding">Running a coding agent →</Link>
      </div>
    </>
  );
}
