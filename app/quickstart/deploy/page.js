import Link from "next/link";

export const metadata = { title: "Deploy & Collaborate Tutorial" };

export default function Page() {
  return (
    <>
      <h1>Deploy &amp; Collaborate</h1>

      <p>
        This tutorial walks you through deploying an Omnigent server that multiple
        people can use, then sharing a live session with a teammate.
      </p>

      <h2>1. Deploy to Railway</h2>
      <p>
        Railway is the quickest way to get a multi-user Omnigent server running.
        It provisions the app and a managed Postgres database automatically.
      </p>
      <ol>
        <li>
          Go to{" "}
          <a href="https://railway.app" target="_blank" rel="noreferrer">railway.app</a>{" "}
          and import the Omnigent repo from GitHub.
        </li>
        <li>Railway detects the Dockerfile and deploys automatically.</li>
        <li>Once deployed, note your server URL (e.g. <code>https://omnigent-production-xxxx.up.railway.app</code>).</li>
      </ol>

      <h2>2. Connect your laptop</h2>
      <pre><code>{`omni login https://your-server.up.railway.app
omni host https://your-server.up.railway.app`}</code></pre>
      <p>
        <code>login</code> authenticates you. <code>host</code> registers your
        machine so the server can dispatch agent work to it.
      </p>

      <h2>3. Start a session</h2>
      <p>
        Open your server URL in a browser. You{"'"}ll see the Omnigent web UI.
        Start a new session with any agent.
      </p>

      <h2>4. Invite a teammate</h2>
      <p>
        Click <strong>Share</strong> on any session to get a shareable link. Send
        it to a teammate. They open it in their browser and join the session in
        real time.
      </p>
      <p>Once in a shared session, both of you can:</p>
      <ul>
        <li>Watch the agent{"'"}s output as it streams.</li>
        <li>Send messages to the agent.</li>
        <li>Comment on and annotate the agent{"'"}s work.</li>
        <li>Fork the session to explore a different direction.</li>
      </ul>

      <h2>5. Try co-driving</h2>
      <p>
        From the terminal, your teammate can also join via CLI:
      </p>
      <pre><code>{`omni attach <session_id>`}</code></pre>
      <p>
        Both participants see the same streaming output and can send messages.
        The agent processes them in order.
      </p>

      <h2>Next steps</h2>
      <ul>
        <li>
          <Link href="/docs/collaborate/auth">Set up SSO</Link> for your team
          with Google, GitHub, or Okta.
        </li>
        <li>
          <Link href="/docs/deploy/cloud-sandbox">Add cloud sandboxes</Link> so
          agents can run independently in the cloud.
        </li>
        <li>
          See <Link href="/docs/deploy/overview">Deploy Overview</Link> for
          Docker, Render, Fly.io, and other options.
        </li>
      </ul>
    </>
  );
}
