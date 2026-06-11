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
            A common layer over Claude Code, Codex, Pi, and the agents you
            write yourself: swap or combine harnesses without rewriting, keep
            them in check with policies and sandboxing, and share a live
            session with your team — open from any device.
          </p>
          <InstallTabs />
          <div className="hero-cta">
            <a href={GITHUB_URL} className="btn btn-primary" target="_blank" rel="noreferrer">
              <GitHubIcon /> Star on GitHub
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

        <div className="wrap">
          {/* Architecture */}
          <section className="section">
            <h2>How it fits together</h2>
            <p className="arch-outro">
              A runner wraps any agent in a sandboxed, uniform session. A server
              adds policies and a shared history, and exposes every session over
              the terminal, the web, and a REST API.
            </p>
            <figure className="framed">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/architecture.png"
                alt="Omnigent architecture: CLI agents and custom agents run through a runner that sandboxes them, then a server that adds policies and history, reachable from a terminal, the web, and a REST API."
                width={930}
                height={430}
              />
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
                  The best results increasingly come from combining models and
                  techniques: an advisor model here, a router there, two
                  harnesses debating to raise quality. And the &ldquo;best&rdquo;
                  harness keeps changing as models evolve. How do you compose
                  those pieces, or switch harnesses, without rewriting
                  everything?
                </p>
                <figure style={{ margin: "1.6rem 0 0" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/composability-icon.svg"
                    alt="Omnigent mascots stacked in layers to illustrate composability."
                    width={80}
                    height={81}
                    style={{ width: "min(100%, 14rem)", height: "auto" }}
                  />
                </figure>
              </div>

              <div className="pillar">
                <h3>Control</h3>
                <p>
                  Agents are held back today because we don&rsquo;t fully trust
                  them. Can you let an agent run at full speed and still
                  guarantee it won&rsquo;t delete prod, leak sensitive data, or
                  quietly burn $1,000 on a bad idea? Right now the answer is
                  usually &ldquo;watch it closely,&rdquo; which defeats the
                  purpose.
                </p>
                <figure style={{ margin: "1.6rem 0 0" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/sandbox.png"
                    alt="Omnigent's mascot supervising smaller agents playing in a sandbox, illustrating the OS-level sandbox that isolates every agent."
                    width={420}
                    height={230}
                    style={{ maxWidth: "min(100%, 26rem)" }}
                  />
                </figure>
              </div>

              <div className="pillar">
                <h3>Collaboration</h3>
                <p>
                  You just spent two hours getting something right with an agent,
                  whether that&rsquo;s a refactor or a market analysis. Why
                  can&rsquo;t you invite a colleague into that same session to
                  review it, or hand it off, the way you&rsquo;d share a doc?
                </p>
                <figure style={{ margin: "1.6rem 0 0" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/high-five.svg"
                    alt="Two Omnigent mascots high-fiving to celebrate collaboration."
                    width={231}
                    height={102}
                    style={{ maxWidth: "min(100%, 18rem)" }}
                  />
                </figure>
              </div>
            </div>
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
              <code>{`pip install omnigent
omnigent                 # pick a model and start chatting
omnigent claude          # or launch a specific harness
omnigent run my-agent/   # or run your own agent`}</code>
            </pre>
            <p>
              Read the <Link href="/quickstart/install">installation guide</Link>,
              then <Link href="/docs/use/custom-agents">write your own agent</Link> in
              a few lines of YAML.
            </p>
          </section>

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
