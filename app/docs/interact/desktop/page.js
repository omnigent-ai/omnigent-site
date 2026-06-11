import Link from "next/link";
import { MACOS_DOWNLOAD_URL } from "@/components/links";

export const metadata = { title: "Desktop App" };

export default function Page() {
  return (
    <>
      <h1>Desktop App</h1>

      <p>
        The Omnigent desktop app gives you the full{" "}
        <Link href="/docs/interact/web-ui">web UI</Link> in a native window, plus OS-level features
        a browser can{"'"}t provide: notifications when your agent needs attention, a dock badge
        showing how many sessions are waiting, and multiple independent windows.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/docs/desktop-app.png"
        alt="Omnigent native desktop app showing the session chat and file workspace"
        style={{ width: "100%", borderRadius: "8px" }}
      />

      <h2>Why use it over the browser?</h2>

      <ul>
        <li>
          <strong>OS notifications.</strong> Get notified when an agent finishes, asks for input, or
          a runner disconnects. Notifications show the first few lines of the agent{"'"}s message and
          only fire for sessions you{"'"}re not actively viewing.
        </li>
        <li>
          <strong>Dock badge.</strong> See at a glance how many sessions need your attention, without
          switching to the app.
        </li>
        <li>
          <strong>Multiple windows.</strong> Open additional windows with <code>Cmd+N</code> to
          watch multiple sessions or servers side by side.
        </li>
      </ul>

      <p>
        Everything else (sessions, file editor, inline comments, collaboration) works exactly the
        same as the web UI.
      </p>

      <h2>Install</h2>

      <table>
        <thead>
          <tr>
            <th>Platform</th>
            <th>Format</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>macOS</td>
            <td><code>.dmg</code></td>
            <td>
              <a href={MACOS_DOWNLOAD_URL}>Download</a>
            </td>
          </tr>
          <tr>
            <td>Linux</td>
            <td><code>.AppImage</code> or <code>.deb</code></td>
            <td>Coming soon</td>
          </tr>
          <tr>
            <td>Windows</td>
            <td>Installer (<code>.exe</code>)</td>
            <td>Coming soon</td>
          </tr>
        </tbody>
      </table>

      <h2>Get started</h2>

      <ol>
        <li>
          <strong>Launch the app.</strong> On first launch, you{"'"}ll see a setup screen.
        </li>
        <li>
          <strong>Enter your server URL.</strong> <code>http://localhost:6767</code> if running
          locally, or your deployed server URL (e.g.{" "}
          <code>https://your-app.onrender.com</code>).
        </li>
        <li>
          <strong>Start working.</strong> The app connects and shows the same UI you{"'"}d see in a
          browser.
        </li>
      </ol>

      <p>
        The app remembers your server URL for future launches. To change it later, go to{" "}
        <strong>Server {">"} Change Server</strong>.
      </p>

      <h2>Work with multiple servers</h2>

      <p>Each window connects to one server. To work with multiple servers at the same time:</p>

      <ol>
        <li>
          Go to <strong>Server {">"} New Window on Different Server</strong>
        </li>
        <li>Enter the URL of the second server</li>
      </ol>

      <p>Notifications and badge counts are combined across all connected servers.</p>
    </>
  );
}
