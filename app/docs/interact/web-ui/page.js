import Link from "next/link";

export const metadata = { title: "Web UI" };

export default function Page() {
  return (
    <>
      <h1>Web UI</h1>

      <p>
        The web UI starts automatically with every session. When the server launches, the URL is
        printed in your terminal. Open it in any browser to get started.
      </p>

            {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/docs/single-harness-demo.gif" alt="Omnigent web UI" style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }} />

      <h2>Session management</h2>

      <p>
        See all your sessions in one place. Resume any previous conversation, start new ones, switch
        between them. Switch agents mid-conversation directly from the UI.
      </p>

      <p>Sessions persist across browser refreshes and server restarts.</p>

      <h2>File editor</h2>

      <p>
        A full markdown editor with syntax highlighting for browsing and editing every file your
        omnigent touches.
      </p>

      <p>
        Your omnigent drafts a documentation page. You open it in the editor, read it properly
        formatted, and make direct edits. Your omnigent generates a config file. You review it with
        full syntax highlighting.
      </p>

      <p>
        Use cases: updating documentation sites, reviewing omnigent-generated plans, editing configs.
      </p>

            {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/docs/file-editor.gif" alt="Omnigent file editor" style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }} />

      <h2>Code viewer and diffs</h2>

      <p>
        Review what your omnigent changed before accepting. Syntax-highlighted diffs show exactly
        what was added, modified, or removed.
      </p>

      <h2>Inline comments and addressing</h2>

      <p>
        Instead of typing in chat {'"'}change the third paragraph to be more concise,{'"'} you click
        on that paragraph and leave a comment: {'"'}too verbose, tighten this up.{'"'} The omnigent
        sees exactly what you{"'"}re referring to and revises it.
      </p>

      <p>
        <strong>Addressing</strong> closes the loop: resolve a comment and the omnigent acts on the
        feedback. The workflow is: omnigent proposes, you annotate, omnigent revises.
      </p>

      <p>Where this matters most:</p>

      <ul>
        <li>
          <strong>Reviewing plans before execution.</strong> Annotate the steps you want changed
          before the omnigent starts building.
        </li>
        <li>
          <strong>Editing drafted docs.</strong> Leave line-level feedback instead of rewriting in
          chat.
        </li>
        <li>
          <strong>Iterating on configs.</strong> Flag the fields that need adjustment.
        </li>
      </ul>

            {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/docs/address-comment.png" alt="Addressing an inline comment" style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }} />

      <h2>Multi-modal input</h2>

      <p>
        Paste images, screenshots, diagrams, and mockups directly into the conversation. The
        omnigent sees them alongside your text. Useful for frontend work where describing a layout
        issue in words is slower than screenshotting it.
      </p>

      <h2>Collaboration</h2>

      <p>
        Share your session with teammates for real-time co-driving. Multiple people see the same
        conversation, leave comments, and interact with the omnigent simultaneously.
      </p>

      <p>
        See <Link href="/docs/collaborate/overview">Collaboration</Link> for details on sharing,
        permissions, and multi-user workflows.
      </p>
    </>
  );
}
