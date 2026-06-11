import Link from "next/link";

export const metadata = { title: "Omnibox" };

export default function Page() {
  return (
    <>
      <h1>Omnibox</h1>

      <p>
        Omnibox is Omnigent{"'"}s secure OS-level sandbox. It wraps any agent (Claude Code, Codex,
        or a custom agent) in a sandbox enforced by the operating system itself, so you can run it
        unattended, in YOLO mode, without handing it your real credentials, your real file system,
        or unrestricted network access.
      </p>

      <p>
        The enforcement happens at the OS level, not in the agent or its prompt. On Linux, Omnibox
        uses bubblewrap namespaces and seccomp; on macOS, Seatbelt (<code>sandbox-exec</code>).
        Every process the agent spawns, including shells, scripts, and build tools, inherits the
        same boundary. A prompt-injected or misbehaving agent can{"'"}t opt out, because the
        kernel, not the model, enforces the rules.
      </p>

      <p>Omnibox combines three OS-level protections:</p>

      <ul>
        <li>
          <strong>Filesystem isolation.</strong> The agent can only see and write the paths you
          grant; everything else doesn{"'"}t exist from inside the sandbox. Dotfiles like{" "}
          <code>~/.ssh</code> and <code>~/.aws/credentials</code> are masked by default, and{" "}
          <code>cwd</code> is read-only until you opt directories back in.
        </li>
        <li>
          <strong>Network isolation.</strong> The sandbox has no direct network access. All HTTP(S)
          traffic goes through a default-deny proxy with an explicit allow-list of methods, hosts,
          and paths. Private IPs and cloud metadata endpoints are blocked by default.
        </li>
        <li>
          <strong>Credential injection.</strong> The agent never holds your real credentials. It
          sees a fake token, and Omnibox{"'"}s proxy swaps in the real one at the network boundary.
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
        the request leaves the sandbox, and only for requests that match your egress allow-list.
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
        allow-listed, auto-approving every action is no longer a leap of faith. That{"'"}s what
        makes unattended execution practical: long-running tasks, background agents, and{" "}
        <Link href="/docs/deploy/cloud-sandbox">cloud sandboxes</Link>.
      </p>

      <h2>How it relates to other features</h2>

      <ul>
        <li>
          <strong><Link href="/docs/policies/os-sandbox">OS sandbox configuration</Link>.</strong>{" "}
          The full reference for the sandbox itself: filesystem grants, egress rules, environment
          passthrough, and the per-platform backends (bubblewrap on Linux, Seatbelt on macOS).
        </li>
        <li>
          <strong><Link href="/docs/deploy/cloud-sandbox">Cloud sandbox</Link>.</strong> Controls{" "}
          <em>where</em> the runner executes (a remote host). Omnibox controls{" "}
          <em>what the agent can access</em>, wherever it runs. They compose: a cloud sandbox can
          run Omnibox inside it.
        </li>
        <li>
          <strong><Link href="/docs/policies/overview">Contextual policies</Link>.</strong> These
          govern agent <em>behavior</em> (budgets, approvals, access rules) at the tool-call level.
          Omnibox enforces a hard boundary at the OS level underneath them.
        </li>
      </ul>
    </>
  );
}
