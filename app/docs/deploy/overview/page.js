import { pageMeta } from "@/lib/og";
import Link from "next/link";

export const metadata = pageMeta("Shared Server", "Deploy the Omnigent server so your agents are reachable from your phone, shareable with teammates, and running while your laptop sleeps.", {
  eyebrow: "Deploy",
  path: "/docs/deploy/overview",
});

export default function Page() {
  return (
    <>
      <h1>Shared Server</h1>

      <p>
        Everything in the previous sections runs on your laptop. That{"'"}s the fastest way to get
        started, but when you want your Omnigent accessible from your phone, shareable with
        teammates, or running while your laptop sleeps, you need to deploy.
      </p>

      <p>
        This section covers Omnigent{"'"}s architecture, the options for hosting the server, and the
        options for hosting the runner.
      </p>

      <p>Omnigent has three components: the server, the runner, and the UI.</p>

      <figure className="section-graphic" style={{ margin: "1rem 0" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/architecture.svg"
          alt="Omnigent architecture: CLI agents and custom agents run through a runner (on your machine, Modal, or Daytona), then a server that adds policies and history, reachable from a terminal, the web, native and mobile apps, and a REST API."
          width={1541}
          height={700}
        />
      </figure>

      <h2>Server</h2>

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
          <strong>Catalog.</strong> Registered and built-in Omnigent specs.
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

      <p>There are a few options for hosting the server on the cloud:</p>

      <h3>Docker Compose</h3>

      <p>
        Deploy the Omnigent server with Docker Compose. The stack includes the server and a Postgres
        database.
      </p>

      <pre><code>{"cd deploy/docker\n./bootstrap.sh          # generates DB password + cookie secret into .env\ndocker compose up -d    # Omnigent server + Postgres"}</code></pre>

      <p>
        Key variables in <code>.env</code> (See{" "}
          <Link href="/docs/collaborate/auth">Auth &amp; SSO</Link> for details on multi-user auth):
      </p>

      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>DATABASE_URL</code></td>
            <td>Postgres connection string</td>
          </tr>
          <tr>
            <td><code>OMNIGENT_AUTH_ENABLED</code></td>
            <td>Enable multi-user auth (default: <code>1</code> in Docker)</td>
          </tr>
          <tr>
            <td><code>OMNIGENT_OIDC_COOKIE_SECRET</code></td>
            <td>Session cookie secret</td>
          </tr>
          <tr>
            <td><code>OMNIGENT_OIDC_ISSUER</code></td>
            <td>OIDC issuer URL (enables SSO)</td>
          </tr>
          <tr>
            <td><code>OMNIGENT_OIDC_CLIENT_ID</code></td>
            <td>OIDC client ID</td>
          </tr>
          <tr>
            <td><code>OMNIGENT_OIDC_CLIENT_SECRET</code></td>
            <td>OIDC client secret</td>
          </tr>
        </tbody>
      </table>

      <div className="note">
        <p>
          No admin password is auto-generated. On first boot the server reports{" "}
          <code>needs_setup</code>: open the web UI and create the admin account there, or set{" "}
          <code>OMNIGENT_ACCOUNTS_INIT_ADMIN_PASSWORD</code> in <code>.env</code> to preset it for
          headless deploys.
        </p>
      </div>

      <h3>Cloud platforms</h3>

      <p>Deploy the server to a cloud platform with managed infrastructure.</p>

      <table>
        <thead>
          <tr>
            <th>Platform</th>
            <th>Database</th>
            <th>Deploy method</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Railway</strong></td>
            <td>Managed Postgres</td>
            <td>Import repo from GitHub</td>
          </tr>
          <tr>
            <td><strong>Render</strong></td>
            <td>Managed Postgres</td>
            <td>
              <a href="https://render.com/deploy?repo=https://github.com/omnigent-ai/omnigent" target="_blank" rel="noreferrer">
                One-click deploy
              </a>
            </td>
          </tr>
          <tr>
            <td><strong>Fly.io</strong></td>
            <td>SQLite on volume</td>
            <td><code>fly deploy</code> from CLI</td>
          </tr>
          <tr>
            <td><strong>Hugging Face Spaces</strong></td>
            <td>SQLite (ephemeral)</td>
            <td>Docker Space</td>
          </tr>
        </tbody>
      </table>

      <p>
        <strong>Railway &amp; Render.</strong> On Railway, import the repo and it handles the
        rest, including managed Postgres; Render provisions the app and managed Postgres over
        HTTPS via{" "}
        <a href="https://render.com/deploy?repo=https://github.com/omnigent-ai/omnigent" target="_blank" rel="noreferrer">
          one-click deploy
        </a>
        . Both default to built-in{" "}
        <code>accounts</code> auth, so multi-user works out of the box.
      </p>

      <p>
        <strong>Fly.io.</strong> Deploy with <code>fly deploy</code> using SQLite on a persistent
        volume. Configuration files are in <code>deploy/fly/</code> in the repo.
      </p>

      <pre><code>{"cd deploy/fly\nfly deploy"}</code></pre>

      <div className="note">
        <p>
          The server idles around ~275 MB RSS. Fly{"'"}s default 256 MB machine will OOM-loop. The{" "}
          <code>fly.toml</code> in the repo pins a 1 GB machine. If you changed it, run{" "}
          <code>fly scale memory 1024</code>.
        </p>
      </div>

      <p>
        <strong>Hugging Face Spaces.</strong> Demo-grade Docker Space with SQLite. See{" "}
        <code>deploy/hf-spaces/</code> in the repo.
      </p>

      <div className="note">
        <p>
          <strong>Warning:</strong> On Hugging Face Spaces, disk is ephemeral by default and
          persistent storage is a paid add-on. Data resets on
          every restart. Use this for demos only.
        </p>
      </div>

      <h2>Runner</h2>

      <p>
        The <strong>runner</strong> is the per-session process that executes Omnigent loops. It
        manages the harness (Claude Code, Codex, Claude SDK, etc.), runs tools, and streams events
        back to the server over WebSocket. The server starts runners on a <strong>host</strong>: a
        machine you register with the server.
      </p>

      <p>By default, the host is your laptop. Register it with:</p>

      <pre><code>{"omni login <server-url>  // if auth is enabled\nomni host <server-url>"}</code></pre>

      <p>
        This is why your local Claude Code or Codex installation {'"'}just works.{'"'} Runners
        started on your laptop have direct access to your machine{"'"}s tools, files, and
        credentials.
      </p>

      <p>
        However, moving the runner to a{" "}
        <Link href="/docs/deploy/cloud-sandbox-host">cloud sandbox host</Link> gives you:
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

      <p>
        We currently support the <a href="https://modal.com" target="_blank" rel="noreferrer">Modal</a> and <a href="https://www.daytona.io" target="_blank" rel="noreferrer">Daytona</a> platforms, with more integrations on the way. Check out the <Link href="/docs/deploy/cloud-sandbox-host">Cloud Sandbox Host</Link> page for more detailed setup instructions.
      </p>

      <h2>UI</h2>

      <p>
        The <Link href="/docs/interact/web-ui">web UI</Link>,{" "}
        <Link href="/docs/interact/terminal">terminal UI</Link>, and{" "}
        <Link href="/docs/interact/mobile">mobile UI</Link> all talk to the server. They never talk
        to the runner directly. This means:
      </p>

      <ul>
        <li>If the server is on your laptop, UI access is local only</li>
        <li>
          If the server is deployed to the cloud, any device can reach it, including your phone. Notably, cloud-hosted servers also allow you to collaborate with other users on the same server.
        </li>
      </ul>

      <h2 id="collaboration">Collaboration</h2>

      <p>
        Once the server is cloud-hosted, Omnigent is multi-user: share a live session with a link,
        let a teammate co-drive your Omnigent, or fork a conversation so someone can continue
        independently. This has moved to its own page &mdash; see{" "}
        <Link href="/docs/collaborate">Pair Programming</Link> for co-drive, sharing with VIEW/EDIT
        permissions, and forking.
      </p>
    </>
  );
}
