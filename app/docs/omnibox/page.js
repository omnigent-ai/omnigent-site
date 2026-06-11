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
        <code>seccomp</code> on Linux, Seatbelt (<code>sandbox-exec</code>) on macOS. Every process the agent spawns
        inherits the boundary, so a prompt-injected or misbehaving agent can{"'"}t opt out.
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

      <h2>Credential injection</h2>

      <p>
        Anything in an agent{"'"}s environment can be read by the model, echoed into logs, or
        exfiltrated by a prompt-injected tool call. So Omnibox never puts the secret there: the
        agent gets a placeholder token, and when a request matching your egress allow-list leaves
        the sandbox, the proxy substitutes the real credential.
      </p>

      <ul>
        <li>The agent can use the credential, but never read it.</li>
        <li>
          A leaked token is worthless: it only works through the proxy, against allowed hosts.
        </li>
        <li>Logs, transcripts, and model context only ever contain the placeholder.</li>
      </ul>

      <h2>Safe YOLO mode</h2>

      <p>
        Approval prompts exist because an agent with your shell can do anything you can. With
        writes confined to the workspace, secrets out of reach, and egress allow-listed,
        auto-approving every action is no longer a leap of faith. That{"'"}s what makes
        long-running tasks, background agents, and{" "}
        <Link href="/docs/deploy/cloud-sandbox">cloud sandboxes</Link> practical.
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
