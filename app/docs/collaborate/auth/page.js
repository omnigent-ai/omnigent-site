import Link from "next/link";

export const metadata = { title: "Auth & SSO" };

export default function Page() {
  return (
    <>
      <h1>Auth &amp; SSO</h1>

      <p>
        Omnigent supports three ways to authenticate users. Pick the one that fits your setup:
      </p>

      <table>
        <thead>
          <tr>
            <th>Mode</th>
            <th>When to use</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><a href="#built-in-accounts">Built-in accounts</a></td>
            <td>
              Standalone deploy, no external IdP. Username/password with invite links.
            </td>
          </tr>
          <tr>
            <td><a href="#single-sign-on-oidc">Single sign-on (OIDC)</a></td>
            <td>Your own IdP: Google, GitHub, Okta, Microsoft.</td>
          </tr>
          <tr>
            <td><a href="#header-based-auth">Header-based auth</a></td>
            <td>
              Behind an existing SSO proxy that injects <code>X-Forwarded-Email</code>.
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="built-in-accounts">Built-in accounts</h2>

      <p>
        If you deployed with <Link href="/docs/deploy/docker">Docker</Link> or a{" "}
        <Link href="/docs/deploy/cloud">cloud platform</Link>, auth is already enabled with built-in
        accounts — the default mode.
      </p>

      <ol>
        <li>
          <p>For non-Docker deploys, enable it manually:</p>

          <pre><code>{"OMNIGENT_AUTH_ENABLED=1 omni server start"}</code></pre>
        </li>
        <li>
          <strong>Create the first admin.</strong> The server never auto-generates a password. While
          no admin exists it reports <code>needs_setup</code>: open the web UI and create the admin
          account there, or run <code>omni server</code> on a terminal and answer the username and
          password prompt. For headless deploys, preset the password with{" "}
          <code>--admin-password</code> or <code>OMNIGENT_ACCOUNTS_INIT_ADMIN_PASSWORD</code>.
        </li>
        <li>
          <strong>Invite teammates.</strong> Go to <strong>Admin {">"} Members {">"} Invite</strong>{" "}
          to create a single-use invite link. No email server needed; just send the link directly.
          Signup is invite-only.
        </li>
      </ol>

      <h2 id="single-sign-on-oidc">Single sign-on (OIDC)</h2>

      <p>
        Let your team sign in with Google, GitHub, Okta, or Microsoft. Adding an OIDC issuer flips
        the mode to SSO. No extra flag needed.
      </p>

      <p>
        Set the following in <code>deploy/docker/.env</code>:
      </p>

      <pre><code>{"OMNIGENT_OIDC_ISSUER=https://accounts.google.com\nOMNIGENT_DOMAIN=agents.yourcompany.com\nOMNIGENT_OIDC_CLIENT_ID=...\nOMNIGENT_OIDC_CLIENT_SECRET=..."}</code></pre>

      <pre><code>{"docker compose up -d    # restart to apply"}</code></pre>

      <p>
        The only outside step is creating an app with your provider (e.g. Google Cloud Console, or
        GitHub {">"} Settings {">"} Developer settings) to get the client ID and secret. Set its
        callback URL to <code>{"https://<your-domain>/auth/callback"}</code>.
      </p>

      <h2 id="header-based-auth">Header-based auth</h2>

      <p>
        If your server sits behind an existing SSO proxy (e.g. OAuth2 Proxy, Cloudflare Access) that
        injects a trusted header, Omnigent can read the user identity directly from{" "}
        <code>X-Forwarded-Email</code>. No additional auth configuration is needed on the Omnigent
        side.
      </p>

      <h2>Access control</h2>

      <p>Once auth is enabled, control who can sign in and what they can access.</p>

      <h3>Domain allowlist</h3>

      <p>
        Restrict sign-ups to specific email domains. In your server config (
        <code>/data/config.yaml</code>):
      </p>

      <pre><code>{"allowed_domains: [yourcompany.com]\nadmins: [you@yourcompany.com]"}</code></pre>

      <h3>Invite outsiders</h3>

      <p>
        Need to let in someone outside your domain, like a contractor? Set{" "}
        <code>OMNIGENT_OIDC_ALLOW_INVITES=1</code> and send them a one-time invite link.
      </p>

      <h2>Migration</h2>

      <p>
        Already using one auth mode and want to switch? These commands move your existing users
        across without losing sessions or admin rights.
      </p>

      <h3>From built-in accounts to SSO</h3>

      <p>
        If you started with built-in accounts and want to switch to OIDC, one command brings
        everyone across so they keep their sessions and admin rights:
      </p>

      <pre><code>{"omni debug migrate-accounts-to-oidc <database-url> --domain yourcompany.com --commit"}</code></pre>

      <p>
        Without <code>--commit</code> the command is a dry run that reports what would change
        without modifying anything.
      </p>
    </>
  );
}
