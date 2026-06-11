import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import InstallTabs from "@/components/InstallTabs";
import { GitHubIcon, DiscordIcon, AppleIcon } from "@/components/icons";
import { GITHUB_URL, DISCORD_URL, MACOS_DOWNLOAD_URL } from "@/components/links";

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
            Build agents and use existing harnesses like Claude Code, Codex, and
            Pi behind one interface, then add what it takes to run them for real:
            a session API, policies, sandboxing, and a UI on every device.
          </p>
          <InstallTabs />
          <div className="hero-cta">
            <a href={GITHUB_URL} className="btn btn-primary" target="_blank" rel="noreferrer">
              <GitHubIcon /> View on GitHub
            </a>
            <a href={DISCORD_URL} className="btn" target="_blank" rel="noreferrer">
              <DiscordIcon /> Join the Discord
            </a>
          </div>
          <p className="hero-desktop">
            Desktop app:{" "}
            <a href={MACOS_DOWNLOAD_URL}>
              <AppleIcon size={14} /> Download for macOS
            </a>
          </p>
        </section>

        <section className="hero-demo" aria-label="Product demo">
          <div className="wrap-wide">
            <video
              className="hero-demo-video"
              src="/videos/demo.mov"
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <h2>Features</h2>
            <ul className="features">
              <li>
                <strong>Polly &amp; Debby:</strong> built-in multi-AI agents (a
                coding orchestrator and a model debate). Build your own in YAML.
              </li>
              <li>
                <strong>Contextual Policies:</strong> stateful spend caps, model
                routing, and risk-based escalation.
              </li>
              <li>
                <strong>Flexible OS sandbox:</strong> restrict filesystem,
                network, and env to run agents in YOLO mode safely.
              </li>
            </ul>
          </div>
        </section>

        {/* Three pillars — wider layout than the rest of the page */}
        <section className="section section-pillars">
          <div className="wrap-wide">
            <div className="pillars">
              <div className="pillar">
                <figure className="pillar-icon pillar-icon-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/composability-icon.svg"
                    alt="Omnigent mascots stacked in layers to illustrate composability."
                    width={80}
                    height={81}
                  />
                </figure>
                <h3>Composition</h3>
                <p>
                  The best results increasingly come from combining models and
                  techniques: an advisor model here, a router there, two
                  harnesses debating to raise quality. And the &ldquo;best&rdquo;
                  harness keeps changing as models evolve. How do you compose
                  those pieces, or switch harnesses, without rewriting
                  everything?
                </p>
              </div>

              <div className="pillar">
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/sandbox.png"
                    alt="Omnigent's mascot supervising smaller agents playing in a sandbox, illustrating the OS-level sandbox that isolates every agent."
                    width={420}
                    height={230}
                  />
                </figure>
                <h3>Control</h3>
                <p>
                  Agents are held back today because we don&rsquo;t fully trust
                  them. Can you let an agent run at full speed and still
                  guarantee it won&rsquo;t delete prod, leak sensitive data, or
                  quietly burn $1,000 on a bad idea? Right now the answer is
                  usually &ldquo;watch it closely,&rdquo; which defeats the
                  purpose.
                </p>
              </div>

              <div className="pillar">
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/high-five.svg"
                    alt="Two Omnigent mascots high-fiving to celebrate collaboration."
                    width={231}
                    height={102}
                  />
                </figure>
                <h3>Collaboration</h3>
                <p>
                  You just spent two hours getting something right with an agent,
                  whether that&rsquo;s a refactor or a market analysis. Why
                  can&rsquo;t you invite a colleague into that same session to
                  review it, or hand it off, the way you&rsquo;d share a doc?
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-no-top">
          <div className="wrap-wide">
            <hr />

            <p className="arch-outro">
              A runner wraps any agent in a sandboxed, uniform session. A server
              adds policies and a shared history, and exposes every session over
              the terminal, the web, and a REST API.
            </p>
            <figure className="framed section-graphic">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/architecture.png"
                alt="Omnigent architecture: CLI agents and custom agents run through a runner that sandboxes them, then a server that adds policies and history, reachable from a terminal, the web, and a REST API."
                width={930}
                height={430}
              />
            </figure>

            <hr />

            <h2>Try it</h2>
            <p className="muted">
              Install, then start an agent in your terminal. A local web UI opens
              too, for the browser or your phone.
            </p>
            <pre className="section-code">
              <code>{`pip install omnigent
omni                     # Polly, the default multi-agent orchestrator
omni claude              # or launch a specific harness
omni run my-agent/       # or run your own agent`}</code>
            </pre>
            <p>
              Read the <Link href="/quickstart/install">installation guide</Link>,
              then <Link href="/docs/use/custom-agents">write your own agent</Link> in
              a few lines of YAML.
            </p>
          </div>
        </section>

        <div className="wrap">
          <hr />

          {/* Build with us */}
          <section className="section center">
            <h2>Early days</h2>
            <p className="muted" style={{ maxWidth: "38rem", margin: "0 auto 1.8rem" }}>
              Omnigent is alpha and built in the open. Try it, break it, and
              tell us on Discord.
            </p>
            <div className="hero-cta">
              <a href={GITHUB_URL} className="btn btn-primary" target="_blank" rel="noreferrer">
                <GitHubIcon /> View on GitHub
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
