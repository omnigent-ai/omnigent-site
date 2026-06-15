import Link from "next/link";

export const metadata = {
  title: "Tutorial: Collaborate from Anywhere",
  // TODO(seo): review/refine this share-card description (auto-derived from page intro).
  description:
    "Tutorial: deploy a server to access agents from your phone, share live sessions with teammates, and run agents on cloud sandbox hosts.",
};

export default function Page() {
  return (
    <>
      <h1>Tutorial: Collaborate from Anywhere</h1>

      <p>
        So far everything runs on your laptop. This tutorial takes you beyond
        that: deploy a server so you can access your agents from your phone,
        share live sessions with teammates, and run agents on cloud sandbox
        hosts that keep working after you close your laptop.
      </p>

      <p>
        <strong>Time:</strong> 15 minutes. <strong>Requires a Railway account (free tier works).</strong>
      </p>

      <h2>1. Deploy to Railway</h2>

      <p>
        Railway is the quickest way to get a multi-user Omnigent server running.
      </p>

      <ol>
        <li>
          Go to{" "}
          <a href="https://railway.app" target="_blank" rel="noreferrer">
            railway.app
          </a>{" "}
          and import the{" "}
          <a href="https://github.com/omnigent-ai/omnigent" target="_blank" rel="noreferrer">
            Omnigent repo
          </a>{" "}
          from GitHub.
        </li>
        <li>Railway detects the Dockerfile and deploys automatically with a managed Postgres database.</li>
        <li>
          Once deployed, note your server URL (something like{" "}
          <code>https://omnigent-production-xxxx.up.railway.app</code>).
        </li>
      </ol>

      <h2>2. Connect your laptop</h2>

      <pre><code>{`omni login https://your-server.up.railway.app
omni host https://your-server.up.railway.app`}</code></pre>

      <p>
        <code>login</code> authenticates you.{" "}
        <code>host</code> registers your machine so the server can dispatch
        agent work to it. You{"'"}re now running agents through the deployed server.
      </p>

      <h2>3. Access from your phone</h2>

      <p>
        Open <code>https://your-server.up.railway.app</code> on your phone{"'"}s
        browser (the same URL from step 1). You see the same web UI with the
        same sessions. Start a task on your laptop, check progress from your
        phone over lunch, answer an approval prompt from the coffee line.
      </p>

      <h2>4. Share a session with a teammate</h2>

      <p>
        In the web UI, click <strong>Share</strong> on any session. Send the link
        to a teammate. They open it in their browser and join in real time.
      </p>

      <p>Now both of you can:</p>

      <ul>
        <li>Watch the agent{"'"}s output as it streams.</li>
        <li>Send messages to the agent.</li>
        <li>Comment on the agent{"'"}s work.</li>
        <li>Fork the session to try a different direction without affecting the original.</li>
      </ul>

      <div className="note">
        <p>
          <strong>Only share EDIT with people you trust to run arbitrary code on your machine.</strong>{" "}
          A teammate with EDIT can drive the agent, which runs code on whatever machine hosts the
          session. Share read-only when you can. See{" "}
          <Link href="/docs/collaborate#code-execution-risk">
            Co-driving grants code execution on the host
          </Link>{" "}
          for details.
        </p>
      </div>

      <h2>5. Run a cloud sandbox host</h2>

      <p>
        Want the agent to keep working after you close your laptop? Launch a
        cloud sandbox host from the web UI. The agent runs in a remote container
        and you check results whenever you{"'"}re ready.
      </p>

      <p>
        Set it up by adding a <code>sandbox</code> section to your server config.
        See <Link href="/docs/deploy/cloud-sandbox-host">Cloud Sandbox Host</Link>{" "}
        for the full setup guide.
      </p>

      <h2>What{"'"}s next</h2>

      <ul>
        <li>
          <Link href="/docs/collaborate/auth">Set up SSO</Link> with Google,
          GitHub, or Okta for your team.
        </li>
        <li>
          <Link href="/docs/deploy/overview">Explore other deployment options</Link>:
          Docker, Render, Fly.io.
        </li>
        <li>
          <Link href="/docs/use/custom-agents">Build a custom agent</Link> that
          your whole team can use.
        </li>
      </ul>
    </>
  );
}
