import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import InstallTabs from "@/components/InstallTabs";
import CtaButtons from "@/components/CtaButtons";
import PillarsTabs from "@/components/PillarsTabs";

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
              src="/images/hero-logo.svg"
              alt="Omnigent, a meta-harness for AI agents"
              width={366}
              height={101}
            />
          </h1>
          <p className="lede">
            A common layer over Claude Code, Codex, Pi, and the agents you
            write yourself: swap or combine harnesses without rewriting, keep
            them in check with policies and sandboxing, and collaborate in
            real time on the same live session, from any device.
          </p>
          <InstallTabs />
          <CtaButtons />
          <p className="hero-desktop">
            One native app for all your agents — every session, in a single place.
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
                <strong><Link href="/docs/use/builtin-agents">Polly &amp; Debby</Link>:</strong> built-in multi-AI agents (a
                coding orchestrator and a model debate). Build your own in YAML.
              </li>
              <li>
                <strong><Link href="/docs/policies/overview">Contextual Policies</Link>:</strong> stateful spend caps, model
                routing, and risk-based escalation.
              </li>
              <li>
                <strong><Link href="/docs/omnibox">Secure OS Sandbox</Link>:</strong> restrict filesystem
                and network access. Hide credentials from the agent, and broker access to them.
                Run YOLO mode safely.
              </li>
            </ul>
          </div>
        </section>

        {/* Three pillars — wider layout than the rest of the page */}
        <section className="section section-pillars">
          <div className="wrap-wide">
            <h2>What Omnigent gives you</h2>
            <PillarsTabs />
          </div>
        </section>

        <section className="section section-no-top">
          <div className="wrap-wide">
            <hr />

            <h2>Architecture</h2>
            <p className="arch-outro">
              A runner wraps any agent in a sandboxed, uniform session. A server
              adds policies and shared history, and exposes every session over the
              terminal, the web, a native app, mobile, and a REST API.
            </p>
            <figure className="section-graphic">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/architecture.svg"
                alt="Omnigent architecture: CLI agents and custom agents run through a runner (on your machine, Modal, or Daytona), then a server that adds policies and history, reachable from a terminal, the web, native and mobile apps, and a REST API."
                width={1200}
                height={545}
              />
            </figure>

            <hr />

            <div className="try-it">
              <h2>Try it</h2>
              <pre className="section-code try-code">
                <code>{`pip install omnigent
omni debby     # run a built-in multi-agent debate
omni claude    # run your agent with a web UI and collaboration`}</code>
              </pre>
              <p>
                Read the <Link href="/quickstart/install">Getting Started</Link> guide for more
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
