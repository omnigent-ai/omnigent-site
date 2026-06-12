import Link from "next/link";

export const metadata = { title: "Collaboration Overview" };

export default function Page() {
  return (
    <>
      <h1>Collaborate with Your Team</h1>

      <p>
        Omnigent is multi-user. Share a live session with a link, let a teammate co-drive your
        Omnigent, or fork a conversation so someone can continue independently. The same session
        works across <Link href="/docs/interact/terminal">terminal</Link>,{" "}
        <Link href="/docs/interact/web-ui">web UI</Link>, and{" "}
        <Link href="/docs/interact/mobile">mobile</Link> simultaneously.
      </p>

      <h2>Requirements</h2>

      <p>To collaborate, you need a server that teammates can reach and auth enabled:</p>

      <ol>
        <li>
          <strong><Link href="/docs/deploy/overview">Deploy a server</Link></strong> so teammates can
          connect from anywhere.
        </li>
        <li>
          <strong><Link href="/docs/collaborate/auth">Set up auth</Link></strong> to enable accounts
          or SSO and invite teammates.
        </li>
      </ol>

      <h2>Share a live session</h2>

      <p>
        Hit <strong>Share</strong> in the <Link href="/docs/interact/web-ui">web UI</Link> and send
        the link. Teammates see everything in real time: messages, tool calls, and file changes
        stream to every connected viewer.
      </p>

      <h2>Co-drive</h2>

      <p>
        A teammate attaches to your running session. Their messages execute on{" "}
        <strong>your</strong> machine. Great for pairing or handing the keyboard to a domain expert
        mid-investigation.
      </p>

      <p>
        In the <Link href="/docs/interact/web-ui">web UI</Link>, hit <strong>Share</strong> and send
        the link to your teammate.
      </p>

      <p>From the terminal:</p>

      <pre><code>{"omni attach <session_id>"}</code></pre>

      <p>
        Both participants see the same streaming output. Either can send messages. The Omnigent
        processes them in order.
      </p>

      <h2>Fork</h2>

      <p>
        Clone a conversation and continue independently from the fork point. The original session is
        unaffected.
      </p>

      <p>
        In the <Link href="/docs/interact/web-ui">web UI</Link>, click{" "}
        <strong>Clone Session</strong>.
      </p>

      <p>From the terminal:</p>

      <pre><code>{"omni run --fork <session_id>"}</code></pre>

      <p>
        Forking copies the full conversation history up to the fork point. From there, each session
        diverges independently.
      </p>
    </>
  );
}
