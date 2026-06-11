import Link from "next/link";

export const metadata = { title: "Omnibox" };

export default function Page() {
  return (
    <>
      <h1>Omnibox</h1>

      <p>
        Omnibox is Omnigent{"'"}s secure OS sandbox. It wraps any agent — Claude Code, Codex, or a
        custom agent — in an OS-level boundary so you can run it unattended, in YOLO mode, without
        giving it your real credentials, your real file system, or unrestricted network access.
      </p>

      <p>Omnibox combines three protections:</p>

      <ul>
        <li>
          <strong>Credential injection</strong> — the agent never holds your real credentials. It
          sees a fake token; Omnibox{"'"}s proxy swaps in the real one at the network boundary.
        </li>
        <li>
          <strong>Restricted file system</strong> — the agent only reads and writes the paths you
          grant. Dotfiles like <code>~/.ssh</code> and <code>~/.aws/credentials</code> are masked by
          default.
        </li>
        <li>
          <strong>Proxied network</strong> — all HTTP(S) traffic goes through a default-deny proxy
          with an explicit allow-list.
        </li>
      </ul>

      <h2>Credential injection</h2>

      <p>
        Secrets in environment variables are the weakest point of running agents with real access:
        anything in the agent{"'"}s environment can be read by the model, echoed into logs, or
        exfiltrated by a prompt-injected tool call. Omnibox removes the secret from the agent
        entirely.
      </p>

      <p>
        Instead of the real value, the agent{"'"}s environment contains a fake placeholder token.
        When the agent makes an API call with that token, the call passes through Omnibox{"'"}s
        network proxy, which recognizes the placeholder and substitutes the real credential before
        the request leaves the sandbox — but only for requests that match your egress allow-list.
      </p>

      <ul>
        <li>The agent can use the credential, but never read it.</li>
        <li>
          A leaked token is worthless: it only works through the proxy, against the hosts you
          allowed.
        </li>
        <li>
          Logs, transcripts, and model context contain only the placeholder, never the real secret.
        </li>
      </ul>

      <h2>Safe YOLO mode</h2>

      <p>
        Approval prompts exist because an agent with your shell can do anything you can. Omnibox
        changes that math: with writes confined to the workspace, secrets out of reach, and egress
        allow-listed, auto-approving every action is no longer a leap of faith. This is what makes
        unattended execution — long-running tasks, background agents,{" "}
        <Link href="/docs/deploy/cloud-sandbox">cloud sandboxes</Link> — practical.
      </p>

      <h2>How it relates to other features</h2>

      <ul>
        <li>
          <strong><Link href="/docs/policies/os-sandbox">OS sandbox configuration</Link></strong> —
          the full reference for the sandbox itself: filesystem grants, egress rules, environment
          passthrough, and the per-platform backends (bubblewrap on Linux, Seatbelt on macOS).
        </li>
        <li>
          <strong><Link href="/docs/deploy/cloud-sandbox">Cloud sandbox</Link></strong> — controls{" "}
          <em>where</em> the runner executes (a remote host). Omnibox controls{" "}
          <em>what the agent can access</em>, wherever it runs. They compose: a cloud sandbox can
          run Omnibox inside it.
        </li>
        <li>
          <strong><Link href="/docs/policies/overview">Contextual policies</Link></strong> — govern
          agent <em>behavior</em> (budgets, approvals, access rules) at the tool-call level. Omnibox
          enforces a hard boundary at the OS level underneath them.
        </li>
      </ul>
    </>
  );
}
