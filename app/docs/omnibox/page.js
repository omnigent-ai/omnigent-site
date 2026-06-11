import Link from "next/link";

export const metadata = { title: "Omnibox" };

export default function Page() {
  return (
    <>
      <h1>Omnibox</h1>

      <p>
        Omnibox is Omnigent{"'"}s secure OS-level sandbox. It wraps any agent (Claude Code, Codex,
        or a custom agent) so you can run it unattended, in YOLO mode, without handing it your real
        credentials, file system, or network.
      </p>

      <p>
        The kernel enforces the rules, not the agent or its prompt: <code>bubblewrap</code> and{" "}
        <code>seccomp</code> on Linux, Seatbelt (<code>sandbox-exec</code>) on macOS. Every process
        the agent spawns inherits the boundary, so a prompt-injected or misbehaving agent can{"'"}t
        opt out.
      </p>

      <p>Omnibox combines three protections:</p>

      <ul>
        <li>
          <strong>Filesystem isolation.</strong> The agent sees only the paths you grant. Dotfiles
          like <code>~/.ssh</code> and <code>~/.aws/credentials</code> are masked by default, and{" "}
          <code>cwd</code> is read-only until you opt in.
        </li>
        <li>
          <strong>Network isolation.</strong> All HTTP(S) traffic goes through a default-deny proxy
          with an explicit allow-list. Private IPs and cloud metadata endpoints are blocked.
        </li>
        <li>
          <strong>Credential injection.</strong> The agent holds a fake token; the proxy swaps in
          the real one at the network boundary.
        </li>
      </ul>

      <h2>Filesystem isolation</h2>

      <p>
        Ungranted paths don{"'"}t exist from inside the sandbox, so a runaway agent can{"'"}t read
        your SSH keys or write outside the workspace. Broad read grants stay safe: granting{" "}
        <code>~</code> doesn{"'"}t expose <code>~/.ssh</code> or <code>~/.aws/credentials</code>,
        because dotfiles are masked unless you allow them.
      </p>

      <h2>Network isolation</h2>

      <p>
        Default-deny egress means data can{"'"}t leave except to hosts you allow, which shuts down
        exfiltration even if the agent is prompt-injected. Blocking private IPs and cloud metadata
        endpoints keeps the agent away from your internal services.
      </p>

      <h2>Credential injection</h2>

      <p>
        The agent can use a credential but never read it: only the placeholder appears in logs,
        transcripts, and model context. A leaked token is worthless, since it only works through
        the proxy, against allowed hosts.
      </p>

      <h2>Related</h2>

      <ul>
        <li>
          <Link href="/docs/policies/os-sandbox">OS sandbox configuration</Link> — the full
          reference: filesystem grants, egress rules, environment passthrough, and the{" "}
          <code>bubblewrap</code>/Seatbelt backends.
        </li>
        <li>
          <Link href="/docs/deploy/cloud-sandbox">Cloud sandbox</Link> — controls <em>where</em>{" "}
          the runner executes. Omnibox controls <em>what it can access</em>. They compose.
        </li>
        <li>
          <Link href="/docs/policies/overview">Contextual policies</Link> — govern behavior at the
          tool-call level. Omnibox is the hard boundary underneath.
        </li>
      </ul>
    </>
  );
}
