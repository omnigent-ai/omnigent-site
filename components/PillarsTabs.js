"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const PILLARS = [
  {
    id: "composition",
    label: "Composition",
    title: "Composition",
    body: "Combine multiple models, harnesses, and techniques without rewriting code. Switch between Claude Code, Codex, Cursor, OpenCode, Hermes, Pi, and your own agents with one-line changes.",
    icon: {
      src: "/images/composability-icon.png",
      alt: "Omnigent starfish mascots stacked in layers to illustrate composability.",
      width: 450,
      height: 600,
    },
    visual: {
      src: "/images/composition.png",
      darkSrc: "/images/composition-dark.png",
      alt: "Omnigent web UI showing Debby coordinating parallel agents to compare Montreal and New York bagels.",
      width: 2314,
      height: 1668,
      fit: "contain",
    },
  },
  {
    id: "control",
    label: "Control",
    title: "Control",
    body: "Stateful, data-centric policies that track agent actions and enforce guardrails like cost budgets and access controls at the meta-harness layer, not via prompts.",
    icon: {
      src: "/images/sandbox.png",
      alt: "Omnigent's mascot supervising smaller agents playing in a sandbox, illustrating the OS-level sandbox that isolates every agent.",
      width: 600,
      height: 473,
    },
    visual: {
      src: "/images/control.png",
      darkSrc: "/images/control-dark.png",
      alt: "Omnigent approval prompt for a Bash tool call blocked by a session cost budget policy.",
      width: 1664,
      height: 1286,
      fit: "contain",
    },
  },
  {
    id: "collaboration",
    label: "Collaboration",
    title: "Collaboration",
    body: "Share live agent sessions via URL with full history, so teammates can review, comment, and steer together in real time.",
    icon: {
      src: "/images/high-five.png",
      alt: "Two Omnigent mascots high-fiving to celebrate collaboration.",
      width: 600,
      height: 600,
    },
    visual: {
      src: "/images/collaboration.png",
      darkSrc: "/images/collaboration-dark.png",
      alt: "Omnigent web UI showing a shared session with inline comments, an agent chat, and a code editor open side by side.",
      width: 2314,
      height: 1668,
      fit: "contain",
    },
  },
];

export default function PillarsTabs() {
  const [active, setActive] = useState("composition");
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    ready: false,
  });
  const [expandedVisual, setExpandedVisual] = useState(null);
  const tablistRef = useRef(null);
  const tabRefs = useRef({});
  const closeButtonRef = useRef(null);

  const updateIndicator = useCallback(() => {
    const tab = tabRefs.current[active];
    const list = tablistRef.current;
    if (!tab || !list) return;

    const listRect = list.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();

    setIndicator({
      left: tabRect.left - listRect.left,
      width: tabRect.width,
      ready: true,
    });
  }, [active]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  useEffect(() => {
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  useEffect(() => {
    if (!expandedVisual) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") setExpandedVisual(null);
    };

    window.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [expandedVisual]);

  const selectTab = (id) => {
    if (id !== active) setActive(id);
  };

  return (
    <div className="pillars-tabs">
      <div
        className="pillar-tablist"
        role="tablist"
        aria-label="What Omnigent gives you"
        ref={tablistRef}
      >
        <span
          className={
            indicator.ready
              ? "pillar-tab-indicator is-ready"
              : "pillar-tab-indicator"
          }
          aria-hidden="true"
          style={{
            width: indicator.width,
            left: indicator.left,
          }}
        />
        {PILLARS.map((pillar) => (
          <button
            key={pillar.id}
            ref={(node) => {
              tabRefs.current[pillar.id] = node;
            }}
            type="button"
            role="tab"
            id={`pillar-tab-${pillar.id}`}
            aria-selected={active === pillar.id}
            aria-controls={`pillar-panel-${pillar.id}`}
            className={
              active === pillar.id ? "pillar-tab is-active" : "pillar-tab"
            }
            onClick={() => selectTab(pillar.id)}
          >
            {pillar.label}
          </button>
        ))}
      </div>

      <div className="pillar-panel-stage">
        {PILLARS.map((pillar) => (
          <div
            key={pillar.id}
            className={
              active === pillar.id ? "pillar-panel is-active" : "pillar-panel"
            }
            role="tabpanel"
            id={`pillar-panel-${pillar.id}`}
            aria-labelledby={`pillar-tab-${pillar.id}`}
            aria-hidden={active !== pillar.id}
          >
            <div className="pillar-copy">
              <figure className="pillar-icon">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pillar.icon.src}
                  alt={pillar.icon.alt}
                  width={pillar.icon.width}
                  height={pillar.icon.height}
                />
              </figure>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </div>
            <div
              className={
                pillar.visual
                  ? "pillar-visual"
                  : "pillar-visual pillar-visual-placeholder"
              }
              aria-hidden={pillar.visual ? undefined : true}
            >
              {pillar.visual ? (
                <button
                  type="button"
                  className="pillar-visual-zoom"
                  onClick={() => setExpandedVisual(pillar.visual)}
                  aria-label={`View larger ${pillar.title} screenshot`}
                >
                  <Image
                    className={
                      (pillar.visual.fit === "contain"
                        ? "pillar-visual-image pillar-visual-image-contain"
                        : "pillar-visual-image") +
                      (pillar.visual.darkSrc ? " theme-light-only" : "")
                    }
                    src={pillar.visual.src}
                    alt={pillar.visual.alt}
                    width={pillar.visual.width}
                    height={pillar.visual.height}
                    sizes="(max-width: 820px) 100vw, 640px"
                  />
                  {pillar.visual.darkSrc ? (
                    <Image
                      className={
                        (pillar.visual.fit === "contain"
                          ? "pillar-visual-image pillar-visual-image-contain"
                          : "pillar-visual-image") + " theme-dark-only"
                      }
                      src={pillar.visual.darkSrc}
                      alt={pillar.visual.alt}
                      width={pillar.visual.width}
                      height={pillar.visual.height}
                      sizes="(max-width: 820px) 100vw, 640px"
                    />
                  ) : null}
                </button>
              ) : (
                "Image placeholder"
              )}
            </div>
          </div>
        ))}
      </div>

      {expandedVisual ? (
        <div
          className="pillar-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={expandedVisual.alt}
          onClick={() => setExpandedVisual(null)}
        >
          <div className="pillar-lightbox-backdrop" aria-hidden="true" />
          <button
            ref={closeButtonRef}
            type="button"
            className="pillar-lightbox-close"
            aria-label="Close screenshot"
            onClick={() => setExpandedVisual(null)}
          >
            ×
          </button>
          <div
            className="pillar-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              className={
                expandedVisual.darkSrc
                  ? "pillar-lightbox-image theme-light-only"
                  : "pillar-lightbox-image"
              }
              src={expandedVisual.src}
              alt={expandedVisual.alt}
              fill
              sizes="92vw"
              priority
            />
            {expandedVisual.darkSrc ? (
              <Image
                className="pillar-lightbox-image theme-dark-only"
                src={expandedVisual.darkSrc}
                alt={expandedVisual.alt}
                fill
                sizes="92vw"
                priority
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
