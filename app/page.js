import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import InstallTabs from "@/components/InstallTabs";
import CtaButtons from "@/components/CtaButtons";

export default function Home() {
  return (
    <>
      <Nav />

      <main>
        {/* Hero */}
        <section className="hero wrap">
          <span className="tag">Open source · Alpha</span>
          <h1 className="hero-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/omnigent-home-page-OG.png"
              alt="Omnigent, a meta-harness for AI agents"
              width={1200}
              height={300}
            />
          </h1>
          <p className="lede">
            A common layer over Claude Code, Codex, Pi, and the agents you
            write yourself: swap or combine harnesses without rewriting, keep
            them in check with policies and sandboxing, and pick the same live
            session back up anywhere, on your phone or with a teammate.
          </p>
          <InstallTabs />
          <CtaButtons />
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
                <strong><Link href="/docs/use/builtin-agents">Polly &amp; Debby</Link>:</strong> built-in multi-AI agents (a
                coding orchestrator and a model debate). Build your own in YAML.
              </li>
              <li>
                <strong><Link href="/docs/policies/overview">Contextual Policies</Link>:</strong> stateful spend caps, model
                routing, and risk-based escalation.
              </li>
              <li>
                <strong><Link href="/docs/policies/os-sandbox">Secure OS sandbox</Link>:</strong> lock down
                filesystem, network, and env access — credentials are injected only when explicitly
                granted, and credential files stay masked — to run agents in YOLO mode safely.
              </li>
            </ul>
          </div>
        </section>

        {/* Three pillars — wider layout than the rest of the page */}
        <section className="section section-pillars">
          <div className="wrap-wide">
            <h2>What Omnigent gives you</h2>
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

            <h2>Architecture</h2>
            <p className="arch-outro">
              A runner wraps any agent in a sandboxed, uniform session — on your
              laptop, or hosted in the cloud on Modal or Daytona. A server adds
              policies and a shared history, and exposes every session over the
              terminal, the web, and a REST API.
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

            <div className="try-it">
              <h2>Try it</h2>
              <p className="muted">
                Install, then start an agent in your terminal. A local web UI opens
                too, for the browser or your phone.
              </p>
              <pre className="section-code try-code">
                <code>{`pip install omnigent
omni polly     # Polly, the default multi-agent orchestrator`}</code>
              </pre>
              <p>
                Read the <Link href="/docs">Getting Started</Link> guide for more
                information.
              </p>
            </div>
          </div>
        </section>

        <div className="wrap">
          <hr />

          {/* Build with us */}
          <section className="section center">
            <p className="muted" style={{ maxWidth: "38rem", margin: "0 auto 1.8rem" }}>
              Omnigent is alpha and built in the open. Try it and give us
              feedback on GitHub and Discord.
            </p>
            <CtaButtons />
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
