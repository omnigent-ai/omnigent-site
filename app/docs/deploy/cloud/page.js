import Link from "next/link";

export const metadata = { title: "Cloud Platforms" };

export default function Page() {
  return (
    <>
      <h1>Cloud platforms</h1>

      <p>Deploy the Omnigent server to a cloud platform with managed infrastructure.</p>

      <h2>Platforms</h2>

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
            <td><strong>Render</strong></td>
            <td>Managed Postgres</td>
            <td>
              <a href="https://render.com/deploy?repo=https://github.com/Omnigents/omnigents" target="_blank" rel="noreferrer">
                One-click deploy
              </a>
            </td>
          </tr>
          <tr>
            <td><strong>Railway</strong></td>
            <td>Managed Postgres</td>
            <td>Import repo from GitHub</td>
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

      <h2>Render</h2>

      <p>
        <a href="https://render.com/deploy?repo=https://github.com/Omnigents/omnigents" target="_blank" rel="noreferrer">
          One-click deploy
        </a>
        . Render provisions the app and managed Postgres over HTTPS.
      </p>

      <h2>Railway</h2>

      <p>Import the repo and Railway handles the rest, including managed Postgres.</p>

      <p>
        Both Render and Railway default to built-in <code>accounts</code> auth, so multi-user works
        out of the box. First boot creates an admin (password in the service logs). To switch to
        OIDC, set the <code>OMNIGENT_OIDC_*</code> environment variables. See{" "}
        <Link href="/docs/collaborate/auth">Auth &amp; SSO</Link> for details.
      </p>

      <h2>Fly.io</h2>

      <p>
        Deploy with <code>fly deploy</code> using SQLite on a persistent volume. Configuration files
        are in <code>deploy/fly/</code> in the repo.
      </p>

      <pre><code>{"cd deploy/fly\nfly deploy"}</code></pre>

      <div className="note">
        <p>
          The server idles around ~275 MB RSS. Fly{"'"}s default 256 MB machine will OOM-loop. The{" "}
          <code>fly.toml</code> in the repo pins a 1 GB machine. If you changed it, run{" "}
          <code>fly scale memory 1024</code>.
        </p>
      </div>

      <h2>Hugging Face Spaces</h2>

      <p>
        Demo-grade Docker Space with SQLite. See <code>deploy/hf-spaces/</code> in the repo.
      </p>

      <div className="note">
        <p>
          <strong>Warning:</strong> On Hugging Face free Spaces, disk is ephemeral. Data resets on
          every restart. Use this for demos only.
        </p>
      </div>
    </>
  );
}
