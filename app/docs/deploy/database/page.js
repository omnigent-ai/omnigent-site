import Link from "next/link";

export const metadata = { title: "Database" };

export default function Page() {
  return (
    <>
      <h1>Database</h1>

      <p>
        The Omnigent server needs a database to persist session history, user accounts, and
        artifacts. Two backends are supported. Both use the same schema and migrations.
      </p>

      <h2>Postgres (recommended)</h2>

      <p>
        Postgres is the production choice. It is required if you run more than one server instance.
      </p>

      <ul>
        <li>
          Auto-provisioned on <Link href="/docs/deploy/cloud">Render and Railway</Link>.
        </li>
        <li>
          For other platforms, bring your own. The fastest option is{" "}
          <a href="https://pg.new" target="_blank" rel="noreferrer">Neon</a>: create a database and
          set <code>DATABASE_URL</code>.
        </li>
        <li>
          Any <code>postgres://</code> or <code>postgresql://</code> URL works. The entrypoint
          normalizes it automatically.
        </li>
      </ul>

      <pre><code>{"DATABASE_URL=postgresql://user:pass@host:5432/omnigents"}</code></pre>

      <h2>SQLite</h2>

      <p>SQLite is the zero-dependency option for demos and single-instance deploys.</p>

      <pre><code>{"DATABASE_URL=sqlite:////data/artifacts/chat.db"}</code></pre>

      <p>
        The <code>.db</code> file lives on the platform{"'"}s persistent disk or volume.
      </p>

      <h2>Comparison</h2>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Postgres</th>
            <th>SQLite</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Multi-instance</td>
            <td>Yes</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Managed backups</td>
            <td>Yes (with managed Postgres)</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Setup required</td>
            <td>Database provisioning</td>
            <td>None</td>
          </tr>
          <tr>
            <td>Best for</td>
            <td>Production</td>
            <td>Demos, single-user</td>
          </tr>
        </tbody>
      </table>

      <div className="note">
        <p>
          <strong>Warning:</strong> On Hugging Face free Spaces, disk is ephemeral. Data resets on
          every restart.
        </p>
      </div>

      <h2>First boot</h2>

      <p>
        First boot against a remote Postgres runs migrations over the network. This takes
        approximately one minute on services like Neon. Subsequent boots are fast.
      </p>

      <p>
        Make sure your platform{"'"}s healthcheck grace period tolerates the initial migration time.
        A 120-second grace period is typically sufficient.
      </p>
    </>
  );
}
