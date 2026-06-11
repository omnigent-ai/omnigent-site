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
          <h1>A meta-harness for AI agents</h1>
          <p className="lede">
            Omnigent wraps the agents you already use — Claude Code, Codex, the
            Claude and OpenAI SDKs — behind one interface, then adds what it
            takes to run them for real: a session API, policies, sandboxing, and
            a UI on every device.
          </p>
          <Command>pip install omnigent</Command>
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
          <p className="center muted" style={{ maxWidth: "40rem", margin: "0 auto" }}>
            Built at Databricks for our own engineers, researchers, and product
            teams, and released under Apache 2.0. It is a layer above any single
            harness — so the agent you describe today keeps working when a better
            model or harness ships next month.
          </p>

          <hr />

          {/* Architecture */}
          <section className="section">
            <h2>How it fits together</h2>
            <p className="lede-block">
              A <strong>runner</strong> wraps any CLI agent or custom agent in a
              uniform session interface. A <strong>server</strong> adds
              sandboxing, reliability, a history catalog, policies, MCPs,
              artifacts, and skills. Because everything sits behind one
              interface, every session is reachable from a terminal, the web, a
              native app, your phone, and a REST API — for a coding agent and a
              custom agent alike.
            </p>
            <figure className="framed">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/architecture.png"
                alt="The Omnigent architecture: CLI agents and custom agents feed into a runner that handles sandboxing and reliability, then a server that adds history, catalog, policies, MCPs, artifacts, and skills, exposed through a terminal UI, web UI, native app, mobile UI, and REST API."
                width={930}
                height={430}
              />
              <figcaption>
                One runner, one server, five front-ends — no extra work per agent.
              </figcaption>
            </figure>
          </section>

          <hr />

          {/* Three pillars */}
          <section className="section">
            <h2>What Omnigent gives you</h2>
            <div className="pillars">
              <div className="pillar">
                <h3>Composition</h3>
                <p>
                  You describe an agent declaratively, in a small YAML file,
                  above the level of any one harness. The same definition runs
                  on the Claude Agent SDK, OpenAI Agents, Codex, or Pi, and
                  switching the harness underneath is a one-line change. The
                  patterns that move quality — advisor models, difficulty-based
                  routing, multi-agent debate, supervisors delegating to
                  sub-agents — become easy to express and reuse, whether your
                  agent writes code or runs a research question past two model
                  vendors and has them argue it out.
                </p>
              </div>

              <div className="pillar">
                <h3>Control</h3>
                <p>
                  Policies check every action and either allow it, block it, or
                  pause to ask you first. They are stateful: a policy can notice
                  that a session already read a sensitive table and then refuse
                  to let that same session reach an external endpoint.
                  Cost-based policies warn on spend, cap what a sub-agent can
                  burn, and route easy work to cheaper models. Underneath sits a
                  strong OS-level sandbox that makes a real &ldquo;YOLO
                  mode&rdquo; safe for any harness — so you can let an agent run
                  at full speed without watching it every second.
                </p>
                <figure style={{ margin: "1.6rem 0 0" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/sandbox.png"
                    alt="Omnigent's mascot supervising smaller agents playing in a sandbox — an illustration of the OS-level sandbox that isolates every agent."
                    width={420}
                    height={230}
                    style={{ maxWidth: "min(100%, 26rem)" }}
                  />
                  <figcaption>
                    Every agent runs in an isolated sandbox, supervised but free
                    to move.
                  </figcaption>
                </figure>
              </div>

              <div className="pillar">
                <h3>Collaboration</h3>
                <p>
                  Share a live agent session the way you would share a doc.
                  Teammates can watch your agent work in real time, leave
                  comments for it to address, co-drive it on your machine, or
                  fork the conversation to continue on their own. Every session
                  is saved in a central history store, so the work doesn&rsquo;t
                  live only on one laptop — and you can pick it back up from your
                  phone.
                </p>
              </div>
            </div>
          </section>

          <hr />

          {/* Quick start */}
          <section className="section">
            <h2>Try it</h2>
            <p className="muted">
              Install Omnigent, then start an agent in your terminal. It also
              launches a local web UI you can open in the browser or on your
              phone.
            </p>
            <pre>
              <code>{`pip install omnigent
omnigent                       # pick a model and start chatting
omnigent claude                # or launch a specific harness
omnigent run path/to/agent.yaml  # or run your own agent`}</code>
            </pre>
            <p>
              Read the <Link href="/docs/installing">installation guide</Link> to
              get set up, then{" "}
              <Link href="/docs/custom-agent">write your own agent</Link> in a few
              lines of YAML.
            </p>
          </section>

          <hr />

          {/* Build with us */}
          <section className="section center">
            <h2>It&rsquo;s early, on purpose</h2>
            <p className="muted" style={{ maxWidth: "38rem", margin: "0 auto 1.8rem" }}>
              Omnigent is alpha. We&rsquo;re developing it in the open and would
              love for you to try it, file issues, and tell us where it breaks.
              The Discord is the fastest way to reach the team.
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
