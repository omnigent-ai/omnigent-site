import Link from "next/link";

export const metadata = { title: "Terminal" };

export default function Page() {
  return (
    <>
      <h1>Terminal</h1>

      <p>
        The terminal is Omnigent{"'"}s default interface: keyboard-first, with streaming output and
        real-time tool execution. If you already live in a terminal, this is the fastest way to work
        with your agent.
      </p>

      <h2>Start a terminal session</h2>

      <p>
        The terminal interface requires <code>tmux</code>, so install it first if you don{"'"}t have
        it:
      </p>

      <pre><code>{"# macOS\nbrew install tmux\n\n# Debian / Ubuntu\napt install tmux"}</code></pre>

      <p>Then start a session by pointing Omnigent at an agent config:</p>

      <pre><code>{"omni run agent.yaml"}</code></pre>

      <p>
        From here, the agent streams its output as it thinks and acts. Tool calls run in real time,
        so you watch file writes, shell commands, and API calls land as they happen. The session also
        stays in sync with the <Link href="/docs/interact/web-ui">Web UI</Link> both ways: run the
        agent in your terminal and glance at the browser whenever you want file diffs or inline
        comments.
      </p>

      <h2>When to use the terminal</h2>

      <p>The terminal shines when you want to stay close to the command line:</p>

      <ul>
        <li>
          <strong>Fast iteration.</strong> Keyboard-first, no context switching to a browser.
        </li>
        <li>
          <strong>SSH environments.</strong> Works over SSH where a browser isn{"'"}t available.
        </li>
        <li>
          <strong>Low-bandwidth connections.</strong> Text-only, minimal overhead.
        </li>
        <li>
          <strong>Scripting and automation.</strong> Composable with other CLI tools.
        </li>
      </ul>
    </>
  );
}
