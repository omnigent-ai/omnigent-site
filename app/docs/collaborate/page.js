import Link from "next/link";

export const metadata = { title: "Pair Programming" };

export default function Page() {
  return (
    <>
      <h1>Pair Programming</h1>

      <p>
        Omnigent is multi-user. Once your server is reachable by your team (see{" "}
        <Link href="/docs/deploy/overview">Shared Server</Link>), you can share a live
        session with a link, let a teammate co-drive your Omnigent, or fork a conversation so someone
        can continue independently. The same session works across{" "}
        <Link href="/docs/interact/terminal">terminal</Link>,{" "}
        <Link href="/docs/interact/web-ui">web UI</Link>, and{" "}
        <Link href="/docs/interact/mobile">mobile</Link> simultaneously.
      </p>

      <h2>Co-drive</h2>

      <p>
        A teammate attaches to your running session and their messages execute on your machine.
        Great for pairing or handing the keyboard to a domain expert mid-investigation.
      </p>

      <ul>
        <li>
          In the <Link href="/docs/interact/web-ui">web UI</Link>, hit <strong>Share</strong> and
          send the link to your teammate.
          <ul>
            <li>
              Share grants one of two permission levels: <strong>VIEW</strong> (read-only, teammates
              watch the session stream) or <strong>EDIT</strong> (teammates can co-drive and send
              messages).
            </li>
          </ul>
        </li>
        <li>
          From the terminal, run:
          <pre><code>{"omni attach <session_id>"}</code></pre>
        </li>
      </ul>

      <p>
        Teammates see everything in real time: messages, tool calls, and file changes stream to every
        connected viewer.
      </p>

      <h3 id="code-execution-risk">Co-driving grants code execution on the host</h3>

      <p>
        Only share <strong>EDIT</strong> with people you trust to run arbitrary code on your machine.
        A session runs commands in a non-sandboxed process on whatever machine hosts it, so a teammate
        with EDIT can drive the agent and gets the same access to your filesystem, credentials, and
        network.
      </p>
      <p>
        To collaborate more safely, share read-only instead, or host the session on a{" "}
        <Link href="/docs/deploy/cloud-sandbox-host">cloud sandbox host</Link> so the agent runs in
        an isolated remote container rather than on your personal machine. To constrain what the
        agent can touch even on a trusted host, apply an{" "}
        <Link href="/docs/policies/os-sandbox">OS sandbox</Link> policy.
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
