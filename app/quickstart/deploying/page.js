import Link from "next/link";

export const metadata = { title: "Deploying the server" };

export default function Page() {
  return (
    <>
      <h1>Deploying the server</h1>
      <p className="lede-block">
        Run Omnigent on a host with a stable URL and your sessions become
        reachable from anywhere — including your phone. The web UI is built for
        mobile, so chat, sub-agents, terminals, and files stay in sync with your
        laptop.
      </p>

      <div className="note">
        <p>
          No deploy needed on your own network — just open your machine&rsquo;s
          LAN address on your phone (e.g. <code>http://192.168.x.x:8000</code>,
          not <code>localhost</code>).
        </p>
      </div>

      <h2>Docker</h2>
      <p>On your own box, a VPS, or a home server:</p>
      <pre><code>{`cd deploy/docker
./bootstrap.sh          # generates the DB password + cookie secret into .env
docker compose up -d    # Omnigent server + Postgres`}</code></pre>

      <h2>Connect your laptop to the host</h2>
      <p>
        Sign in once (the token is reused by <code>run</code> / <code>attach</code>{" "}
        / <code>host</code>), then register your machine so new sessions run on
        it:
      </p>
      <pre><code>{`omnigent login https://your-host
omnigent host  https://your-host`}</code></pre>
      <p>Or point a one-off run at it directly:</p>
      <pre><code>omnigent run path/to/agent.yaml --server https://your-host</code></pre>

      <h2>Bring in your team</h2>
      <p>
        Run Omnigent locally and it&rsquo;s just you — single user, no login.
        When you&rsquo;re ready for teammates, turn on multi-user accounts with
        one environment variable (the Docker deploy sets this for you):
      </p>
      <pre><code>OMNIGENTS_AUTH_ENABLED=1 omnigent server start</code></pre>
      <p>
        With auth on, open <strong>Admin → Members → Invite</strong> to create a
        single-use invite link — no email server needed. Want people to sign in
        with the accounts they already have? Add an OIDC issuer (Google, GitHub,
        Okta, Microsoft) to your server config to switch on single sign-on.
      </p>

      <div className="doc-next muted">
        See the full deployment guides — Render, AWS, OIDC, and custom domains —
        in the <Link href="/quickstart/installing">project repository</Link>.
      </div>
    </>
  );
}
