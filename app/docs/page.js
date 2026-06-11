import Link from "next/link";

export const metadata = { title: "Documentation" };

export default function Page() {
  return (
    <>
      <h1>Documentation</h1>

      <p style={{ background: "var(--bg-soft)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "0.8rem 1rem", margin: "0 0 1.5rem" }}>
        <strong>New here?</strong> Start with the{" "}
        <Link href="/quickstart/install">Quickstart</Link> to get running in
        under a minute.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/docs/desktop-app.png" alt="Omnigent native desktop app" style={{ width: "100%", borderRadius: "12px", margin: "0 0 1.5rem" }} />

      <p>
        Use the sidebar to navigate. The docs are organized by what you want to do:
      </p>
      <ul>
        <li><strong>Use Omnigent:</strong> run coding agents, try built-in multi-AI agents (Polly, Debby), or build your own custom agent.</li>
        <li><strong>Interact:</strong> work from terminal, web UI, mobile, or desktop app, all synced to the same session in real time.</li>
        <li><strong>Contextual Policies:</strong> enforce cost budgets, approval gates, and access controls that track state across the session, not just static rules.</li>
        <li><strong>Deploy:</strong> go from your laptop to a persistent server so your team can access agents from anywhere, with cloud runners for unattended execution.</li>
        <li><strong>Collaborate:</strong> share a live session with a link, co-drive an agent with teammates, or fork a conversation to explore a different direction.</li>
      </ul>
    </>
  );
}
