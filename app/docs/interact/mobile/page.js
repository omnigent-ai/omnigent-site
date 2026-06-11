import Link from "next/link";

export const metadata = { title: "Mobile" };

export default function Page() {
  return (
    <>
      <h1>Mobile</h1>

      <p>
        The same session is accessible on terminal, browser, and phone simultaneously. Start on your
        laptop, continue on your phone.
      </p>

      {/* TODO: Add screenshot of mobile web UI showing a conversation */}

      <h2>The use case</h2>

      <p>
        Long-running agents don{"'"}t need you at your desk. Start a coding task, head to lunch,
        check progress from your phone. Your omnigent hits a question. Answer it from the coffee
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
        <code>http://192.168.x.x:8000</code>). Your phone needs to be on the same Wi-Fi network.
      </p>

      <p>
        <strong>From anywhere.</strong> Deploy the Omnigent server beyond localhost. See{" "}
        <Link href="/docs/deploy/overview">Deploy</Link> for options.
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
