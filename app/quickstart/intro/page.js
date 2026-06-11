import Link from "next/link";

export const metadata = { title: "Introduction" };

export default function Page() {
  return (
    <>
      <h1>Introduction</h1>

      <p>
        Omnigent is a <strong>meta-harness</strong>: use and build agents with
        any existing harness. It handles the challenges where a single harness
        stops:
      </p>

      <ul>
        <li>
          <strong>Composition.</strong> Orchestrate multiple harnesses in one
          config. Claude Code, Codex, and Pi work side by side, each on its own
          runtime.
        </li>
        <li>
          <strong>Control.</strong> Enforce cost limits, approval gates, file
          access restrictions, and model routing through declarative policies.
        </li>
        <li>
          <strong>Collaboration.</strong> Share live sessions with teammates,
          co-drive agents together, and fork conversations.
        </li>
      </ul>

      <p>
        Omnigent is useful for both managing existing coding agents and building
        custom agents from scratch. Work from a web UI, desktop app, terminal,
        or your phone, all synced to the same session.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/docs/homepage.png" alt="Omnigent homepage" style={{ width: "100%", borderRadius: "8px", margin: "1rem 0" }} />

      <h2>Workflow</h2>

      <h3>Manage existing coding agents</h3>

      <p>
        Already using Claude Code or Codex? Run them through Omnigent to get a
        web UI, persistent sessions, policies, and team collaboration on top.
      </p>

      <ol>
        <li>
          <strong>
            <Link href="/quickstart/install">Install</Link>.
          </strong>{" "}
          <code>pip install omnigent</code> and run <code>omni setup</code> for
          credentials.
        </li>
        <li>
          <strong>
            <Link href="/quickstart/coding-agent#1-run-it">Run it</Link>.
          </strong>{" "}
          <code>omni claude</code> or <code>omni codex</code>.
        </li>
        <li>
          <strong>
            <Link href="/quickstart/coding-agent#2-interact">Interact</Link>.
          </strong>{" "}
          Native terminal, web UI, and desktop app launch automatically, all
          synced.
        </li>
        <li>
          <strong>
            <Link href="/quickstart/coding-agent#3-set-policies">Set policies</Link>.
          </strong>{" "}
          Ask your omnigent to add cost routing, approval gates, or access
          controls in plain language.
        </li>
        <li>
          <strong>
            <Link href="/quickstart/coding-agent#4-deploy">Deploy</Link>.
          </strong>{" "}
          Move to a persistent server for mobile access and team sharing.
        </li>
        <li>
          <strong>
            <Link href="/quickstart/coding-agent#6-team-collaboration">
              Collaborate
            </Link>
            .
          </strong>{" "}
          Share sessions, co-drive, and fork conversations.
        </li>
        <li>
          <strong>
            <Link href="/docs/deploy/cloud-sandbox">Cloud sandbox</Link>.
          </strong>{" "}
          Run agents in remote containers so they keep working after you close
          your laptop.
        </li>
      </ol>

      <h3>Build custom agents</h3>

      <p>
        Want to create something new?{" "}
        <Link href="/docs/use/custom-agents">Write a YAML config</Link> with your
        own prompt, harness, tools, sub-agents, and{" "}
        <Link href="/docs/policies/overview">policies</Link>. Once your agent is
        running, the rest of the workflow (interact, deploy, collaborate,
        sandbox) is the same as above.
      </p>

      <h2>Get started</h2>

      <p>Pick the path that fits your use case:</p>

      <ul>
        <li>
          <strong>
            <Link href="/quickstart/coding-agent">Coding agent quickstart</Link>.
          </strong>{" "}
          Already using Claude Code or Codex? Add Omnigent{"'"}s web UI,
          sessions, and policies on top with one command.
        </li>
        <li>
          <strong>
            <Link href="/quickstart/multi-agent">Multi-agent tutorial</Link>.
          </strong>{" "}
          Run Debby for a multi-model debate, or Polly for multi-agent coding orchestration.
        </li>
        <li>
          <strong>
            <Link href="/quickstart/custom-omnigent">
              Custom omnigent quickstart
            </Link>
            .
          </strong>{" "}
          Build your own agent from scratch in a short YAML file, or try Polly
          to see multi-harness orchestration in action.
        </li>
      </ul>
    </>
  );
}
