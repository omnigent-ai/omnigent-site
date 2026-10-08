import { pageMeta } from "@/lib/og";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = pageMeta(
  "FAQ",
  "Answers to common questions about Omnigent: what it is, how it works, and how to get started.",
  {
    eyebrow: "Help",
    path: "/faq",
  },
);

export default function Page() {
  return (
    <>
      <Nav />

      <main>
        <div className="wrap">
          <section className="section">
            <h1>FAQ</h1>

            <h2 className="faq-question">What is Omnigent?</h2>
            <p className="muted">
              A framework that runs AI agents behind one interface. It wraps
              Claude Code, Codex, and Pi, plus custom agents you write in YAML,
              and gives each one a server, a UI, sandboxing, and policies.
            </p>

            <h2 className="faq-question">Which models can I use?</h2>
            <p className="muted">
              Bring your own: an API key, a Claude or ChatGPT plan, an OpenAI-
              or Anthropic-compatible gateway (OpenRouter, LiteLLM, Ollama,
              Azure, vLLM), or a Databricks workspace.
            </p>

            <h2 className="faq-question">How do I run my own agent?</h2>
            <p className="muted">
              Write a short YAML file with a prompt and a harness, then run{" "}
              <code>omni run</code> on it. See the{" "}
              <Link href="/docs/use/custom-agents">custom agent guide</Link>.
            </p>

            <h2 className="faq-question">
              Is it safe to let an agent run on my machine?
            </h2>
            <p className="muted">
              Every command runs in an OS-level sandbox (bwrap on Linux,
              seatbelt on macOS), and policies can pause, block, or cap what an
              agent does.
            </p>

            <h2 className="faq-question">Do I need Databricks?</h2>
            <p className="muted">
              No. Omnigent is open source and runs on your own machine and
              models. A Databricks workspace is just one supported model
              provider.
            </p>

            <h2 className="faq-question">Is it ready for production?</h2>
            <p className="muted">
              Teams use Omnigent for real work today. It also moves quickly:
              releases ship often and can include breaking changes, which recent{" "}
              <Link href="/releases">release notes</Link> call out. Pin a
              version, read the notes before you upgrade, and tell us on Discord
              where it breaks.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
