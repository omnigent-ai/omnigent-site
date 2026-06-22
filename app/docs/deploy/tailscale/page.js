import { pageMeta } from "@/lib/og";

export const metadata = pageMeta("Tailscale", "Access your Omnigent server from any device on your Tailscale network — phone, tablet, or remote machine — without exposing it to the public internet.", {
  eyebrow: "Deploy",
  path: "/docs/deploy/tailscale",
});

export default function Page() {
  return (
    <>
      <h1>Tailscale</h1>

      <p>
        Tailscale lets you access your Omnigent server from any device on your private network
        (phone, tablet, remote machine) without exposing it to the public internet. Your devices
        connect peer-to-peer over WireGuard — no port forwarding, no firewall rules.
      </p>

      <h2>Basic setup</h2>

      <p>
        Install Tailscale on your laptop and on every device you want to access Omnigent from, then
        sign in with the same account. Run the Omnigent server as usual, and expose it via{" "}
        <code>tailscale serve</code>:
      </p>

      <pre><code>{"tailscale serve https / http://localhost:8000"}</code></pre>

      <p>
        Your server is now reachable at{" "}
        <code>https://{"<machine>"}.ts.net</code> from any device on your tailnet.
      </p>

      <p>
        Set two environment variables so the server trusts that origin and issues correct session
        cookies:
      </p>

      <pre><code>{"OMNIGENT_WS_ALLOWED_ORIGINS=https://<machine>.ts.net\nOMNIGENT_ACCOUNTS_BASE_URL=https://<machine>.ts.net"}</code></pre>

      <p>
        Without <code>OMNIGENT_WS_ALLOWED_ORIGINS</code>, the browser on your phone will get
        WebSocket errors and a <em>{"\""}Forbidden: this endpoint requires a trusted Origin
        header{"\"" }</em> error on chat. Without <code>OMNIGENT_ACCOUNTS_BASE_URL</code>, session
        cookies won{"'"}t use the secure <code>__Host-</code> prefix and magic-link URLs will point
        at the wrong host.
      </p>

      <h2>Cloud sandbox hosts</h2>

      <p>
        Cloud sandboxes (Modal, Daytona, E2B) run the Omnigent host process inside a remote
        container. That process dials <em>out</em> to <code>server_url</code> over WebSocket to
        receive work — so the server must be reachable from the sandbox provider{"'"}s cloud
        network, not just from your tailnet.
      </p>

      <p>
        A server behind plain <code>tailscale serve</code> is only reachable from your tailnet, so
        cloud sandbox hosts can{"'"}t connect back to it. <strong>Tailscale Funnel</strong> fixes
        this: it makes a specific port reachable from the public internet via Tailscale{"'"}s
        infrastructure, while keeping the same <code>{"<machine>"}.ts.net</code> hostname.
      </p>

      <pre><code>{"tailscale funnel 8000"}</code></pre>

      <p>
        With Funnel on, set <code>server_url</code> in your sandbox config to the public Tailscale
        URL:
      </p>

      <pre><code>{"sandbox:\n  provider: modal          # or daytona, e2b, …\n  server_url: https://<machine>.ts.net"}</code></pre>

      <div className="note">
        <p>
          Funnel makes the server reachable from the public internet, so enable auth (
          <code>OMNIGENT_AUTH_ENABLED=1</code>) when using it. See{" "}
          <a href="/docs/collaborate/auth">Auth &amp; SSO</a> for setup.
        </p>
      </div>

      <h2>Summary</h2>

      <table>
        <thead>
          <tr>
            <th>Goal</th>
            <th>Command</th>
            <th>Reachable from</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Access from phone / tablet on your tailnet</td>
            <td><code>tailscale serve https / http://localhost:8000</code></td>
            <td>Tailnet only</td>
          </tr>
          <tr>
            <td>Access from cloud sandbox hosts</td>
            <td><code>tailscale funnel 8000</code></td>
            <td>Public internet + tailnet</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
