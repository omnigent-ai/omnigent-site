import { pageMeta } from "@/lib/og";
import Link from "next/link";
import ContentTabs from "@/components/ContentTabs";

export const metadata = pageMeta("Tutorial: Coding Agent", "Tutorial: see what Omnigent adds on top of Claude Code or Codex, including a web UI, mobile access, session sharing, and mid-conversation agent switching.", {
  eyebrow: "Quickstart",
});

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

      <pre><code>{`omni claude    # Claude Code
omni codex     # Codex`}</code></pre>

      <p>
        Pick whichever you already use. Either command launches the coding agent
        in your terminal and opens a web UI at{" "}
        <code>http://localhost:6767</code>. Both are connected to the same session
        and stream output in real time.
      </p>

      <h2>2. Give it a task</h2>

      <p>
        Ask it to do something in your project. For example:
      </p>

      <pre><code>{"Write a Python function that reads a CSV file and returns the top 5 rows sorted by the second column."}</code></pre>

      <p>
        Watch it work in the terminal. Then follow along in the web UI or the
        desktop app. Terminal, browser, and desktop app are three views of the
        same session: type in one, and the others update in real time.
      </p>

      <ContentTabs labels={["Web UI", "Desktop App"]}>
        <div>
          <p>
            Open <code>http://localhost:6767</code> in your browser. The web UI
            shows your conversation on the left and a right panel with four
            tabs: <strong>Files</strong> (browse and edit files the agent
            created), <strong>Agents</strong> (sub-agents if any),{" "}
            <strong>Shells</strong> (running terminals), and{" "}
            <strong>Todos</strong>. Everything syncs with the terminal in real
            time.
          </p>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/docs/single-harness-demo.gif" alt="Omnigent web UI running a coding agent session" style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }} />
        </div>
        <div>
          <p>
            Launch the <Link href="/docs/interact/desktop">desktop app</Link>{" "}
            and connect it to <code>http://localhost:6767</code>. You get the
            same session and the same panels as the web UI, plus OS
            notifications and a dock badge when the agent finishes or needs
            your input, which is handy when you switch away while it works.
          </p>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/docs/desktop-conversation.png" alt="Omnigent desktop app showing an agent conversation alongside the session workspace" style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }} />
        </div>
      </ContentTabs>

      <h2>3. Try native Omnigent features</h2>

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
      <img src="/images/docs/address-comment.png" alt="Addressing an inline comment on agent output" style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }} />

      <h3>Edit files directly</h3>
      <p>
        Open any file the agent created in the built-in editor. Make changes
        yourself with syntax highlighting. The agent can see your edits and
        continue from there.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/docs/file-editor.gif" alt="Editing a file in the Omnigent web UI" style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }} />

      <h3>Paste an image</h3>
      <p>
        Drag a screenshot, mockup, or diagram into the chat. The agent sees it
        alongside your text. Try pasting a screenshot of a UI bug or a design spec.
      </p>

      <h3>Fork a session and switch agents</h3>
      <p>
        Fork your current session to try a different approach without affecting
        the original. The fork copies the full conversation history up to that
        point, so you can experiment freely.
      </p>
      <p>
        Sessions in Omnigent belong to you, not to a specific agent, so a fork
        doesn{"'"}t have to continue with the agent it started with.{" "}
        <strong>
          Started in Claude Code? Fork the session and continue the fork with
          Codex (or vice versa).
        </strong>{" "}
        The new agent picks up the full conversation history and keeps
        going, so you can compare how each one tackles the same problem from the
        same starting point.
      </p>

      <h2>4. Add a policy in plain language</h2>

      <p>
        Type this into the chat:
      </p>

      <pre><code>{"Don't send any PII like emails or credit card numbers to the model. Ask me first if a message contains some."}</code></pre>

      <p>
        The agent attaches Omnigent{"'"}s built-in PII policy to the session. From
        now on, every outgoing model request is scanned, and anything containing
        PII is held for your approval before it leaves your machine. Try it: paste
        a log file with a fake email address and watch the policy step in. This
        is enforcement at the platform layer, something no coding agent can do
        on its own. Cost budgets, access controls, and more work the same way.
        See <Link href="/docs/policies/overview">Contextual Policies</Link>.
      </p>

      <h2>What{"'"}s next</h2>

      <ul>
        <li>
          <Link href="/quickstart/polly">Try Polly</Link> to
          see multi-agent coding orchestration in action.
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
