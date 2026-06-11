import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Command from "@/components/Command";
import { GitHubIcon, DiscordIcon } from "@/components/icons";
import { GITHUB_URL, DISCORD_URL } from "@/components/links";

export default function Home() {
  return (
    <>
      <Nav />

      <main>
        {/* Hero */}
        <section className="hero wrap">
          <span className="tag">Open source · Alpha</span>
          <h1>
            The framework above your agent harnesses. Runs them together,
            governed and shareable. Use with Claude Code, Codex, or Pi.
          </h1>
          <Command>pip install omnigents</Command>
          <div className="hero-cta">
            <a href={GITHUB_URL} className="btn btn-primary" target="_blank" rel="noreferrer">
              <GitHubIcon /> View on GitHub
            </a>
            <a href={DISCORD_URL} className="btn" target="_blank" rel="noreferrer">
              <DiscordIcon /> Join the Discord
            </a>
          </div>
        </section>

        <div className="wrap">
          {/* Architecture */}
          <section className="section">
            <h2>How it fits together</h2>
            <p className="lede-block">
              A <strong>runner</strong> wraps any agent in a uniform session. A{" "}
              <strong>server</strong> adds sandboxing, policies, and a shared
              history, and exposes every session over the terminal, the web, and
              a REST API.
            </p>
            <figure className="framed">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/architecture.png"
                alt="Omnigent architecture: CLI agents and custom agents run through a runner, then a server that adds sandboxing, policies, and history, reachable from a terminal, the web, and a REST API."
                width={930}
                height={430}
              />
              <figcaption>One runner and one server behind every agent.</figcaption>
            </figure>
          </section>

          <hr />

          {/* Quick start */}
          <section className="section">
            <h2>Try it</h2>
            <p className="muted">
              Install, then start an agent in your terminal. A local web UI opens
              too, for the browser or your phone.
            </p>
            <pre>
              <code>{`pip install omnigents
omnigents                 # pick a model and start chatting
omnigents claude          # or launch a specific harness
omnigents run my-agent/   # or run your own agent`}</code>
            </pre>
            <p>
              Read the <Link href="/docs/installing">installation guide</Link>,
              then <Link href="/docs/custom-agent">write your own agent</Link> in
              a few lines of YAML.
            </p>
          </section>

          <hr />

          {/* FAQ */}
          <section className="section">
            <h2>FAQ</h2>

            <h3>What is Omnigent?</h3>
            <p className="muted">
              A framework that runs AI agents behind one interface. It wraps
              Claude Code, Codex, and Pi, plus custom agents you write in YAML,
              and gives each one a server, a UI, sandboxing, and policies.
            </p>

            <h3>Which models can I use?</h3>
            <p className="muted">
              Bring your own: an API key, a Claude or ChatGPT plan, an OpenAI- or
              Anthropic-compatible gateway (OpenRouter, LiteLLM, Ollama, Azure,
              vLLM), or a Databricks workspace.
            </p>

            <h3>How do I run my own agent?</h3>
            <p className="muted">
              Write a short YAML file with a prompt and a harness, then run{" "}
              <code>omnigents run</code> on it. See the{" "}
              <Link href="/docs/custom-agent">custom agent guide</Link>.
            </p>

            <h3>Is it safe to let an agent run on my machine?</h3>
            <p className="muted">
              Every command runs in an OS-level sandbox (bwrap on Linux, seatbelt
              on macOS), and policies can pause, block, or cap what an agent does.
            </p>

            <h3>Do I need Databricks?</h3>
            <p className="muted">
              No. Omnigent is open source and runs on your own machine and
              models. A Databricks workspace is just one supported model
              provider.
            </p>

            <h3>Is it ready for production?</h3>
            <p className="muted">
              No. It is alpha. Expect rough edges, and tell us where it breaks on
              Discord.
            </p>
          </section>

          <hr />

          {/* Build with us */}
          <section className="section center">
            <h2>It&rsquo;s early, on purpose</h2>
            <p className="muted" style={{ maxWidth: "38rem", margin: "0 auto 1.8rem" }}>
              Omnigent is alpha and built in the open. Try it and tell us where
              it breaks. The Discord is the fastest way to reach us.
            </p>
            <div className="hero-cta">
              <a href={GITHUB_URL} className="btn btn-primary" target="_blank" rel="noreferrer">
                <GitHubIcon /> Star on GitHub
              </a>
              <a href={DISCORD_URL} className="btn" target="_blank" rel="noreferrer">
                <DiscordIcon /> Join the Discord
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
