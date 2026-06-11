import Link from "next/link";

export const metadata = { title: "Tutorial: Coding Agent" };

export default function Page() {
  return (
    <>
      <h1>Tutorial: Coding Agent</h1>

      <p>
        Already using Claude Code or Codex? This tutorial shows you what Omnigent
        adds on top: a web UI with file editing and inline comments, mobile access,
        session sharing, and the ability to fork or switch agents mid-conversation.
        None of this is possible with a native coding agent alone.
      </p>

      <p>
        <strong>Time:</strong> 5 minutes. <strong>Everything runs locally.</strong>
      </p>

      <h2>1. Start your coding agent</h2>

      <pre><code>{"omni claude"}</code></pre>

      <p>
        This launches Claude Code in your terminal and opens a web UI at{" "}
        <code>http://localhost:6767</code>. Both are connected to the same session
        and stream output in real time.
      </p>

      <h2>2. Give it a task</h2>

      <p>
        Ask it to do something in your project. For example:
      </p>

      <pre><code>{"Write a Python function that reads a CSV file and returns the top 5 rows sorted by the second column."}</code></pre>

      <p>
        Watch it work in the terminal. Then open{" "}
        <code>http://localhost:6767</code> in your browser.
      </p>

      <h2>3. Try what native Claude Code can{"'"}t do</h2>

      <p>
        Now that your agent has produced some output, try these features in
        the web UI:
      </p>

      <h3>Comment on the agent{"'"}s work</h3>
      <p>
        Click on a specific part of the agent{"'"}s output and leave an inline
        comment like {'"'}make this more concise{'"'} or {'"'}use pandas instead{'"'}.
        The agent sees exactly what you{"'"}re referring to and revises it.
        No need to describe the location in chat.
      </p>

      <h3>Edit files directly</h3>
      <p>
        Open any file the agent created in the built-in editor. Make changes
        yourself with syntax highlighting. The agent can see your edits and
        continue from there.
      </p>

      <h3>Paste an image</h3>
      <p>
        Drag a screenshot, mockup, or diagram into the chat. The agent sees it
        alongside your text. Try pasting a screenshot of a UI bug or a design spec.
      </p>

      <h3>Switch to a different agent</h3>
      <p>
        Mid-conversation, switch to a different coding agent (e.g. Codex) without
        losing history. The new agent picks up where the old one left off.
      </p>

      <h2>4. Add a policy in plain language</h2>

      <p>
        Type this into the chat:
      </p>

      <pre><code>{"Ask me before running any shell commands."}</code></pre>

      <p>
        The agent adds a policy to the session. From now on, it pauses and asks
        for your approval before executing anything in the shell. You can add
        cost limits, access controls, and more the same way. See{" "}
        <Link href="/docs/policies/overview">Contextual Policies</Link>.
      </p>

      <h2>What{"'"}s next</h2>

      <ul>
        <li>
          <Link href="/quickstart/multi-agent">Try multi-AI agents</Link> to
          see Claude and GPT debate each other.
        </li>
        <li>
          <Link href="/quickstart/collaborate">Collaborate from anywhere</Link> to
          deploy a server and share sessions with teammates.
        </li>
        <li>
          <Link href="/docs/use/custom-agents">Build a custom agent</Link> with
          your own tools, prompts, and policies.
        </li>
      </ul>
    </>
  );
}
