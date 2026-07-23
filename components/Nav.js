"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitHubIcon, DiscordIcon, LinkedInIcon } from "./icons";
import { GITHUB_URL, DISCORD_URL, LINKEDIN_URL } from "./links";
import DocSearch from "./DocSearch";

export default function Nav({ menuToggle }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu on route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close the mobile menu when the viewport grows past the breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 821px)");
    const onChange = () => setMobileOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="nav">
      <div className="nav-inner">
        {menuToggle && <div className="nav-menu-toggle">{menuToggle}</div>}
        <Link href="/" className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="theme-light-only"
            src="/images/logo.svg"
            alt="Omnigent"
            height={45}
            width={172}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="theme-dark-only"
            src="/images/logo-dark.svg"
            alt="Omnigent"
            height={45}
            width={172}
          />
        </Link>
        <nav className="nav-links">
          <Link href="/quickstart/install" className="nav-link">
            Get Started
          </Link>
          <Link href="/docs/use/coding-agents" className="nav-link">
            Docs
          </Link>
          <Link href="/reference" className="nav-link">
            API
          </Link>
          <Link href="/releases" className="nav-link">
            Releases
          </Link>
          <Link href="/blog" className="nav-link">
            Blog
          </Link>
          <a
            href={GITHUB_URL}
            className="nav-icon"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <GitHubIcon size={20} />
          </a>
          <a
            href={DISCORD_URL}
            className="nav-icon"
            target="_blank"
            rel="noreferrer"
            aria-label="Discord"
          >
            <DiscordIcon size={20} />
          </a>
          <a
            href={LINKEDIN_URL}
            className="nav-icon"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedInIcon size={20} />
          </a>
        </nav>
        <div className="nav-right">
          <DocSearch />
          <button
            type="button"
            className="nav-mobile-toggle"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="nav-mobile-menu">
          <Link href="/quickstart/install" className="nav-mobile-link">
            Get Started
          </Link>
          <Link href="/docs/use/coding-agents" className="nav-mobile-link">
            Docs
          </Link>
          <Link href="/reference" className="nav-mobile-link">
            API
          </Link>
          <Link href="/releases" className="nav-mobile-link">
            Releases
          </Link>
          <Link href="/blog" className="nav-mobile-link">
            Blog
          </Link>
          <Link href="/faq" className="nav-mobile-link">
            FAQ
          </Link>
          <div className="nav-mobile-divider" />
          <div className="nav-mobile-icons">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="nav-mobile-icon"
            >
              <GitHubIcon size={20} /> GitHub
            </a>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              className="nav-mobile-icon"
            >
              <DiscordIcon size={20} /> Discord
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="nav-mobile-icon"
            >
              <LinkedInIcon size={20} /> LinkedIn
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
