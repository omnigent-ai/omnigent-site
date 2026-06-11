import Link from "next/link";

export const metadata = { title: "Sandboxes" };

export default function Page() {
  return (
    <>
      <h1>Sandboxes</h1>
      <p className="lede-block">
        A strong OS-level sandbox isolates every agent, so you can let one run at
        full speed without it reaching the rest of your machine. It makes a real
        &ldquo;YOLO mode&rdquo; safe for any harness.
      </p>

      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/sandbox.png"
          alt="Omnigent's mascot supervising smaller agents at play inside a sandbox tray."
          width={420}
          height={230}
          style={{ maxWidth: "min(100%, 24rem)" }}
        />
      </figure>

      <h2>What the sandbox does</h2>
      <p>
        The runner places each agent in an isolated environment with controlled
        access to the filesystem, the network, and the host. Combined with{" "}
        <Link href="/quickstart/policies">policies</Link>, this is what lets you grant
        autonomy on purpose: the sandbox sets the hard boundary, and policies
        decide, action by action, what happens inside it.
      </p>

      <div className="note">
        <p>
          Hardening the sandbox turned the team into better security researchers
          along the way — we found and reported bugs in four-plus open-source
          agent sandboxes while building this one.
        </p>
      </div>

      <h2>On the roadmap</h2>
      <p>
        Cloud sandboxes — Daytona, Modal, exe.dev, and more — are coming, so a
        session can run in the cloud as easily as on your laptop. Omnigent is
        alpha and this area is moving quickly; the{" "}
        <Link href="/quickstart/installing">repo</Link> has the current state.
      </p>

      <div className="doc-next">
        Next: <Link href="/quickstart/deploying">Deploying the server →</Link>
      </div>
    </>
  );
}
