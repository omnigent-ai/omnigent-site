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
        <code>http://localhost:6767</code> in your browser to see the web UI.
      </p>

      <p>
        The web UI shows your conversation on the left and a right panel with
        four tabs: <strong>Files</strong> (browse and edit files the agent
        created), <strong>Agents</strong> (sub-agents if any),{" "}
        <strong>Terminals</strong> (running shells), and{" "}
        <strong>Todos</strong>. Everything syncs with the terminal in real time.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/docs/single-harness-demo.gif" alt="Omnigent web UI running a coding agent session" style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }} />

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

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/docs/leave-comment.png" alt="Leaving an inline comment on agent output" style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }} />

      <h3>Edit files directly</h3>
      <p>
        Open any file the agent created in the built-in editor. Make changes
        yourself with syntax highlighting. The agent can see your edits and
        continue from there.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/docs/markdown-editor.gif" alt="Editing a file in the Omnigent web UI" style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }} />

      <h3>Paste an image</h3>
      <p>
        Drag a screenshot, mockup, or diagram into the chat. The agent sees it
        alongside your text. Try pasting a screenshot of a UI bug or a design spec.
      </p>

      <h3>Fork a session</h3>
      <p>
        Fork your current session to try a different approach without affecting
        the original. The fork copies the full conversation history up to that
        point, so you can experiment freely.
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
          <Link href="/quickstart/multi-ai">Try multi-AI agents</Link> to
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
