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
        <li>Filesystem isolation</li>
        <li>Network isolation</li>
        <li>Credential injection</li>
      </ul>

      <h2>Filesystem isolation</h2>

      <p>
        The agent sees only the paths you grant; everything else doesn{"'"}t exist from inside the
        sandbox. Even <code>cwd</code> is read-only until you opt directories back in, so a runaway
        agent can{"'"}t read your SSH keys or write outside the workspace.
      </p>

      <p>
        Broad read grants stay safe: granting <code>~</code> doesn{"'"}t expose{" "}
        <code>~/.ssh</code> or <code>~/.aws/credentials</code>, because dotfiles are masked unless
        you allow them.
      </p>

      <h2>Network isolation</h2>

      <p>
        All HTTP(S) traffic goes through a default-deny proxy with an explicit allow-list of
        methods, hosts, and paths. Data can{"'"}t leave except to hosts you chose, which shuts down
        exfiltration even if the agent is prompt-injected.
      </p>

      <p>
        Private IPs and cloud metadata endpoints are blocked by default, so the agent can{"'"}t
        reach your internal services.
      </p>

      <h2>Credential injection</h2>

      <p>
        The agent holds a fake placeholder token instead of the real secret. When a request
        matching your allow-list leaves the sandbox, the proxy swaps in the real credential. The
        agent can use a credential but never read it.
      </p>

      <p>
        Only the placeholder appears in logs, transcripts, and model context. A leaked token is
        worthless, since it only works through the proxy, against allowed hosts.
      </p>

      <h2>Related</h2>

      <ul>
        <li>
          <Link href="/docs/policies/os-sandbox">OS sandbox configuration</Link>: the full
          reference, covering filesystem grants, egress rules, environment passthrough, and the{" "}
          <code>bubblewrap</code>/Seatbelt backends.
        </li>
        <li>
          <Link href="/docs/deploy/cloud-sandbox">Cloud sandbox</Link>: controls <em>where</em>{" "}
          the runner executes. Omnibox controls <em>what it can access</em>. They compose.
        </li>
        <li>
          <Link href="/docs/policies/overview">Contextual policies</Link>: govern behavior at the
          tool-call level. Omnibox is the hard boundary underneath.
        </li>
      </ul>
    </>
  );
}
