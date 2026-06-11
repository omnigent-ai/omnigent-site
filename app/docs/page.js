import Link from "next/link";

export const metadata = { title: "Documentation" };

export default function Page() {
  return (
    <>
      <h1>Documentation</h1>
      <p>
        Full reference for building, configuring, deploying, and collaborating with Omnigent.
        New here? Start with the <Link href="/quickstart/intro">Quickstart</Link>.
      </p>

      <h2>Build Your Omnigent</h2>
      <p>
        Define a custom agent in a YAML config. Choose a harness, model, tools, and policies.
      </p>
      <ul>
        <li><Link href="/docs/build/overview">Overview</Link></li>
        <li><Link href="/docs/build/harnesses">Harnesses</Link></li>
        <li><Link href="/docs/build/models">Models &amp; Credentials</Link></li>
        <li><Link href="/docs/build/prompts">Prompts &amp; Skills</Link></li>
        <li><Link href="/docs/build/tools">MCP &amp; Tools</Link></li>
        <li><Link href="/docs/build/policies">Policies Config</Link></li>
      </ul>

      <h2>Set Omnigent Policies</h2>
      <p>
        Control what your omnigent can and cannot do. Cost budgets, approval gates, access controls, and more.
      </p>
      <ul>
        <li><Link href="/docs/policies/overview">Overview</Link></li>
        <li><Link href="/docs/policies/builtin">Builtin Policies</Link></li>
        <li><Link href="/docs/policies/custom">Custom Policies</Link></li>
        <li><Link href="/docs/policies/os-sandbox">OS Sandbox</Link></li>
      </ul>

      <h2>Interact with Your Omnigent</h2>
      <p>
        Terminal, web UI, desktop app, and mobile. All synced to the same session.
      </p>
      <ul>
        <li><Link href="/docs/interact/overview">Overview</Link></li>
        <li><Link href="/docs/interact/terminal">Terminal</Link></li>
        <li><Link href="/docs/interact/web-ui">Web UI</Link></li>
        <li><Link href="/docs/interact/mobile">Mobile</Link></li>
        <li><Link href="/docs/interact/desktop">Desktop App</Link></li>
      </ul>

      <h2>Deploy Your Omnigent</h2>
      <p>
        Move from your laptop to a persistent server your team can access.
      </p>
      <ul>
        <li><Link href="/docs/deploy/overview">Overview</Link></li>
        <li><Link href="/docs/deploy/database">Database</Link></li>
        <li><Link href="/docs/deploy/docker">Docker</Link></li>
        <li><Link href="/docs/deploy/cloud">Cloud Platforms</Link></li>
        <li><Link href="/docs/deploy/cloud-sandbox">Cloud Sandbox</Link></li>
      </ul>

      <h2>Collaborate with Your Team</h2>
      <p>
        Share sessions, co-drive agents, and fork conversations.
      </p>
      <ul>
        <li><Link href="/docs/collaborate/overview">Overview</Link></li>
        <li><Link href="/docs/collaborate/auth">Auth &amp; SSO</Link></li>
      </ul>
    </>
  );
}
