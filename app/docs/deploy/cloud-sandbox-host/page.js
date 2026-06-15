import Link from "next/link";

export const metadata = {
  title: "Cloud Sandbox Host",
  // TODO(seo): review/refine this share-card description (auto-derived from page intro).
  description:
    "Move the Omnigent runner from your laptop to a remote container so your agent keeps working in an isolated cloud environment.",
};

export default function Page() {
  return (
    <>
      <h1>Cloud Sandbox Host</h1>

      <p>
        A cloud sandbox host moves the Omnigent runner from your laptop to a remote container. Your agent
        keeps working after you close your laptop, in an isolated environment with cloud compute.
      </p>

      <div className="note">
        <p>
          Looking to restrict what your agent can access on the filesystem and network instead?
          That{"'"}s <Link href="/docs/omnibox">Omnibox</Link>.
        </p>
      </div>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Local runner</th>
            <th>Cloud sandbox host</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Availability</strong></td>
            <td>Stops when laptop closes</td>
            <td>Runs independently</td>
          </tr>
          <tr>
            <td><strong>Compute</strong></td>
            <td>Your CPU and memory</td>
            <td>Cloud compute</td>
          </tr>
          <tr>
            <td><strong>Environment</strong></td>
            <td>Local files</td>
            <td>Isolated, reproducible</td>
          </tr>
          <tr>
            <td><strong>Best for</strong></td>
            <td>Interactive work</td>
            <td>Long-running tasks</td>
          </tr>
        </tbody>
      </table>

      <p>
        Omnigent currently supports{" "}
        <a href="https://modal.com" target="_blank" rel="noreferrer">Modal</a> and{" "}
        <a href="https://www.daytona.io" target="_blank" rel="noreferrer">Daytona</a> as hosting
        platforms for cloud sandbox hosts, with more on the way.
      </p>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>
              <a href="https://modal.com" target="_blank" rel="noreferrer">Modal</a>
            </th>
            <th>
              <a href="https://www.daytona.io" target="_blank" rel="noreferrer">Daytona</a>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Runner lifetime</strong></td>
            <td>24 hours (platform cap)</td>
            <td>No cap (runs until deleted)</td>
          </tr>
          <tr>
            <td><strong>Credential injection</strong></td>
            <td>Named secrets (Modal secret store)</td>
            <td>Env vars copied from server</td>
          </tr>
          <tr>
            <td><strong>Free-tier egress</strong></td>
            <td>Full egress</td>
            <td>Allowlisted domains only</td>
          </tr>
        </tbody>
      </table>

      <h2>Server-managed (recommended)</h2>

      <p>
        Configure your server once and anyone on the team can launch a cloud sandbox host from the
        web UI.
      </p>

      <h3>1. Install</h3>

      <pre><code>{"pip install 'omnigent[modal]'       # for Modal\npip install 'omnigent[daytona]'     # for Daytona"}</code></pre>

      <h3>2. Set provider credentials</h3>

      <p>
        <strong>Modal:</strong> run <code>modal setup</code> to authenticate, or set{" "}
        <code>MODAL_TOKEN_ID</code> and <code>MODAL_TOKEN_SECRET</code> on the server.
      </p>

      <p>
        <strong>Daytona:</strong> create an API key in the{" "}
        <a href="https://app.daytona.io" target="_blank" rel="noreferrer">Daytona dashboard</a>{" "}
        (Dashboard {">"} Keys) and set it on the server:
      </p>

      <pre><code>{"export DAYTONA_API_KEY=dtn_…"}</code></pre>

      <h3>3. Configure the cloud sandbox host</h3>

      <p>
        Add a <code>sandbox</code> section to your server config YAML (
        <code>~/.omnigent/config.yaml</code> on a laptop, <code>/data/config.yaml</code> in
        Docker). This is the same file where you define{" "}
        <Link href="/docs/policies/overview">server-wide policies</Link>.
      </p>

      <p>
        Only <code>provider</code> and <code>server_url</code> are required. The provider block is
        optional.
      </p>

      <p><strong>Modal:</strong></p>

      <pre><code>{"sandbox:\n  provider: modal\n  server_url: https://your-server.example.com\n  modal:\n    image: ghcr.io/omnigent-ai/omnigent-host:latest  # optional, official image by default\n    secrets: [omnigent-llm]                        # Modal secrets with LLM API keys"}</code></pre>

      <p>
        <code>secrets</code> injects{" "}
        <a href="https://modal.com/docs/guide/secrets" target="_blank" rel="noreferrer">
          Modal secrets
        </a>{" "}
        (API keys, gateway URLs) into the cloud sandbox host. Values stay in Modal{"'"}s secret
        store.
      </p>

      <p><strong>Daytona:</strong></p>

      <pre><code>{"sandbox:\n  provider: daytona\n  server_url: https://your-server.example.com\n  daytona:\n    image: docker.io/you/omnigent-host:latest      # optional, official image by default\n    env: [OPENAI_API_KEY, ANTHROPIC_API_KEY]        # server env vars to copy into sandbox"}</code></pre>

      <p>
        <code>env</code> lists env var names to copy from the server{"'"}s environment into each
        cloud sandbox host. Values never live in the config file. A listed variable that isn{"'"}t set fails the
        launch loudly.
      </p>

      <div className="note">
        <p>
          <strong>Daytona free-tier egress:</strong> Daytona Tier 1/2 organizations restrict outbound
          traffic to a{" "}
          <a href="https://www.daytona.io/docs/en/network-limits" target="_blank" rel="noreferrer">
            fixed allowlist
          </a>
          . Your <code>server_url</code> and model endpoints must be reachable from Daytona{"'"}s
          cloud. <strong>Tier 3+</strong> ($500 usage top-up) lifts the restriction. On free tier,
          use a Cloudflare Worker relay on the allowlisted <code>*.workers.dev</code> domain (see{" "}
          <code>deploy/daytona-relay/</code> in the repo). Modal has full egress on its entry tier.
        </p>
      </div>

      <h3>4. Launch from the web UI</h3>

      <p>
        Start a new session and select <strong>New Sandbox</strong> in the host picker. The server
        provisions the cloud host, starts the runner, and connects it back automatically. This works
        the same on both hosting platforms.
      </p>

      <h2>CLI</h2>

      <p>
        Create and manage cloud sandbox hosts from the command line. The commands are the same across
        hosting platforms, just switch the <code>--provider</code> flag.
      </p>

      <pre><code>{"omni sandbox create --provider modal          # or --provider daytona\nomni sandbox connect --provider modal \\\n  --sandbox-id <id> --server <url>"}</code></pre>
    </>
  );
}
