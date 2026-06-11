export const metadata = { title: "Docker" };

export default function Page() {
  return (
    <>
      <h1>Docker</h1>

      <p>
        Deploy the Omnigent server with Docker Compose. The stack includes the server and a Postgres
        database.
      </p>

      <h2>Quick start</h2>

      <pre><code>{"cd deploy/docker\n./bootstrap.sh          # generates DB password + cookie secret into .env\ndocker compose up -d    # Omnigent server + Postgres"}</code></pre>

      <p>Then connect your laptop:</p>

      <pre><code>{"omni login https://your-host\nomni host https://your-host"}</code></pre>

      <h2>Environment variables</h2>

      <p>
        Key variables in <code>.env</code>:
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
          First boot prompts you to create an admin account.
        </p>
      </div>
    </>
  );
}
