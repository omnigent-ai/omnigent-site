import { pageMeta } from "@/lib/og";
import Link from "next/link";

export const metadata = pageMeta("Mobile", "Access the same Omnigent session on terminal, browser, and phone simultaneously. Start on your laptop, continue on your phone.", {
  eyebrow: "Interact",
  path: "/docs/interact/mobile",
});

export default function Page() {
  return (
    <>
      <h1>Mobile</h1>

      <p>
        The same session is accessible on terminal, browser, and phone simultaneously. Start on your
        laptop, continue on your phone.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/docs/mobile-demo.gif" alt="Omnigent running on a mobile browser" style={{ display: "block", maxWidth: "320px", width: "100%", height: "auto", borderRadius: "8px", margin: "1rem 0" }} />

      <h2>The use case</h2>

      <p>
        Long-running agents don{"'"}t need you at your desk. Start a coding task, head to lunch,
        check progress from your phone. Your Omnigent hits a question. Answer it from the coffee
        line. Want to review what it produced? Browse the files right there.
      </p>

      <p>Everything syncs in real time across devices.</p>

      <h2>How to access</h2>

      <p>
        <code>localhost:6767</code> is only reachable from the machine running the server. To access
        from your phone:
      </p>

      <p>
        <strong>Same network.</strong> Use your machine{"'"}s local IP instead of localhost (e.g.,{" "}
        <code>http://192.168.x.x:6767</code>). Your phone needs to be on the same Wi-Fi network.
      </p>

      <p>
        <strong>From anywhere.</strong> Deploy the Omnigent server beyond localhost. See{" "}
        <Link href="/docs/deploy/overview">the deployment docs</Link> for options.
      </p>

      <p>No app to install. Just open the URL in your mobile browser.</p>

      <h2>What works on mobile</h2>

      <p>
        The full Web UI, touch-optimized: chat, monitor sub-agents, browse files, view code changes,
        and leave inline comments.
      </p>

      {/* TODO: Add screenshot of mobile file browser view */}
    </>
  );
}
