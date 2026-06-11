"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const PILLARS = [
  {
    id: "composition",
    label: "Composition",
    title: "Composition",
    body:
      "Combine models, harnesses, and techniques for better results — and switch between them with one-line changes, no rewriting.",
    icon: {
      src: "/images/composability-icon.svg",
      alt: "Omnigent mascots stacked in layers to illustrate composability.",
      width: 80,
      height: 81,
    },
    visual: {
      src: "/images/composition.png",
      alt: "Omnigent web UI showing Debby coordinating parallel agents to compare Montreal and New York bagels.",
      width: 2902,
      height: 2036,
      fit: "contain",
    },
  },
  {
    id: "control",
    label: "Control",
    title: "Control",
    body:
      "Apply stateful, contextual policies that enforce cost and access guardrails at the harness layer — not in the prompt.",
    icon: {
      src: "/images/sandbox.png",
      alt: "Omnigent's mascot supervising smaller agents playing in a sandbox, illustrating the OS-level sandbox that isolates every agent.",
      width: 420,
      height: 230,
    },
    visual: {
      src: "/images/control.png",
      alt: "Omnigent approval prompt for a Bash tool call blocked by a session cost budget policy.",
      width: 1648,
      height: 1222,
    },
  },
  {
    id: "collaboration",
    label: "Collaboration",
    title: "Collaboration",
    body:
      "Share a live session by URL: review, comment, and steer together in real time, the way you'd share a doc.",
    icon: {
      src: "/images/high-five.svg",
      alt: "Two Omnigent mascots high-fiving to celebrate collaboration.",
      width: 231,
      height: 102,
    },
  },
];

export default function PillarsTabs() {
  const [active, setActive] = useState("composition");
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });
  const tablistRef = useRef(null);
  const tabRefs = useRef({});

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
            indicator.ready ? "pillar-tab-indicator is-ready" : "pillar-tab-indicator"
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
            className={active === pillar.id ? "pillar-tab is-active" : "pillar-tab"}
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
                <Image
                  className={
                    pillar.visual.fit === "contain"
                      ? "pillar-visual-image pillar-visual-image-contain"
                      : "pillar-visual-image"
                  }
                  src={pillar.visual.src}
                  alt={pillar.visual.alt}
                  width={pillar.visual.width}
                  height={pillar.visual.height}
                  sizes="(max-width: 820px) 100vw, 640px"
                />
              ) : (
                "Image placeholder"
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
