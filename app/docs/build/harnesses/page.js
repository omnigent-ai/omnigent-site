import { pageMeta } from "@/lib/og";
import Link from "next/link";

export const metadata = pageMeta("Harnesses", "The harness is the runtime that executes your agent loop. Swap one line of YAML to switch between Claude, Codex, and other runtimes.", {
  eyebrow: "Build",
});

export default function Page() {
  return (
    <>
      <h1>Harnesses</h1>

      <p>
        The harness is the runtime that executes your agent loop. Swap one line to switch runtimes.
      </p>

      <pre>
        <code>
          {`executor:
  harness: claude`}
        </code>
      </pre>

      <h2>Supported harnesses</h2>

      <table>
        <thead>
          <tr>
            <th>Harness</th>
            <th>Runtime</th>
            <th>Best for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>claude</code></td>
            <td>Claude Code</td>
            <td>Claude Code out of the box. Add tools, policies, and prompts to customize.</td>
          </tr>
          <tr>
            <td><code>codex</code></td>
            <td>Codex</td>
            <td>Codex out of the box. Add tools, policies, and prompts to customize.</td>
          </tr>
          <tr>
            <td><code>pi</code></td>
            <td>Pi</td>
            <td>
              Headless multi-model worker that runs on any gateway model. Ideal for review,
              exploration, and read-heavy tasks delegated by a supervisor agent.
            </td>
          </tr>
        </tbody>
      </table>

      <p>More harness integrations are on the way.</p>

      <h2>Swap harnesses</h2>

      <p>
        Tools, policies, and other config stay the same across harnesses. Just change the{" "}
        <code>harness</code> value in your YAML, or override it at runtime:
      </p>

      <pre>
        <code>
          {`omni run agent.yaml --harness codex`}
        </code>
      </pre>

      <p>
        See <Link href="/docs/build/models">Models &amp; Credentials</Link> for how to set up API
        keys and choose models.
      </p>
    </>
  );
}
