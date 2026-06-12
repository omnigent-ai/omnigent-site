import Link from "next/link";

export const metadata = { title: "Deploy Overview" };

export default function Page() {
  return (
    <>
      <h1>Deploy Your Omnigent</h1>

      <p>
        Everything in the previous sections runs on your laptop. That{"'"}s the fastest way to get
        started, but when you want your Omnigent accessible from your phone, shareable with
        teammates, or running while your laptop sleeps, you need to deploy.
      </p>

      <p>
        This section covers Omnigent{"'"}s architecture and the deployment options for each
        component.
      </p>

      <h2>Architecture</h2>

      <p>Omnigent has three components:</p>

            {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/docs/omnigent-architecture.png" alt="Omnigent architecture" style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }} />

      <h3>Server</h3>

      <p>The <strong>server</strong> is the central coordinator. It manages:</p>

      <ul>
        <li>
          <strong>Session history.</strong> Every conversation, message, and tool call is persisted in
          a <Link href="/docs/deploy/database">database</Link> (Postgres or SQLite).
        </li>
        <li>
          <strong>Artifacts.</strong> Files, Omnigent bundles, and uploads.
        </li>
        <li>
          <strong>Catalog.</strong> Registered Omnigent specs and built-in Omnigent.
        </li>
        <li>
          <strong>MCP proxy &amp; policies.</strong> Proxies MCP tool calls with server-side policy
          enforcement.
        </li>
        <li>
          <strong>Skills.</strong> Skill definitions that Omnigent can load.
        </li>
        <li>
          <strong>Auth &amp; accounts.</strong> User authentication (built-in accounts or OIDC/SSO).
        </li>
      </ul>

      <h3>Runner</h3>

      <p>
        The <strong>runner</strong> is the per-session process that executes Omnigent loops. It
        manages the harness (Claude Code, Codex, Claude SDK, etc.), runs tools, and streams events
        back to the server over WebSocket. The server starts runners on a <strong>host</strong>: a
        machine you register with the server.
      </p>

      <p>By default, the host is your laptop. Register it with:</p>

      <pre><code>{"omni host <server-url>"}</code></pre>

      <p>
        This is why your local Claude Code or Codex installation {'"'}just works.{'"'} Runners
        started on your laptop have direct access to your machine{"'"}s tools, files, and
        credentials.
      </p>

      <p>
        The runner can also be hosted in the cloud as a{" "}
        <Link href="/docs/deploy/cloud-runner">cloud runner</Link>, so your Omnigent executes in a
        cloud container instead of on your local machine. Supported hosting platforms:
      </p>

      <ul>
        <li>
          <a href="https://modal.com" target="_blank" rel="noreferrer">Modal</a>
        </li>
        <li>
          <a href="https://www.daytona.io" target="_blank" rel="noreferrer">Daytona</a>
        </li>
      </ul>

      <p>
        More platforms are on the way.
      </p>

      <h3>UI</h3>

      <p>
        The <Link href="/docs/interact/web-ui">web UI</Link>,{" "}
        <Link href="/docs/interact/terminal">terminal UI</Link>, and{" "}
        <Link href="/docs/interact/mobile">mobile UI</Link> all talk to the server. They never talk
        to the runner directly. This means:
      </p>

      <ul>
        <li>If the server is on your laptop, UI access is local only</li>
        <li>
          If the server is deployed to the cloud, any device can reach it, including your phone
        </li>
      </ul>

      <h2>Deploy the server to the cloud</h2>

      <p>
        The server and runner deploy independently. Moving the server to a cloud host gives you:
      </p>

      <ul>
        <li>
          <strong>Mobile &amp; remote access.</strong> The web UI is reachable from any device,
          anywhere.
        </li>
        <li>
          <strong>Shared history.</strong> Teammates can see and continue each other{"'"}s sessions
          (see <Link href="/docs/collaborate/overview">Team collaboration</Link>).
        </li>
        <li>
          <strong>Always-on availability.</strong> The server stays up even when your laptop is
          closed.
        </li>
        <li>
          <strong>Multi-user auth.</strong> Built-in accounts or SSO for your team.
        </li>
      </ul>

      <p>
        See <Link href="/docs/deploy/cloud">Cloud platforms</Link> and{" "}
        <Link href="/docs/deploy/docker">Docker</Link> for ways to host it.
      </p>

      <h2>Host the runner in the cloud</h2>

      <p>
        Moving the runner to a{" "}
        <Link href="/docs/deploy/cloud-runner">cloud runner</Link> gives you:
      </p>

      <ul>
        <li>
          <strong>No laptop dependency.</strong> Your Omnigent runs even when your machine is off.
        </li>
        <li>
          <strong>Cloud-native tooling.</strong> Your Omnigent can access cloud resources directly.
        </li>
        <li>
          <strong>Isolation.</strong> Each Omnigent runs in its own container, separate from your
          local environment.
        </li>
        <li>
          <strong>Scalability.</strong> Run many Omnigents in parallel without taxing your machine.
        </li>
      </ul>
    </>
  );
}
