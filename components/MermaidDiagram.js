"use client";

import { useEffect, useId, useRef, useState } from "react";

const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

function themeVariables(dark) {
  return dark
    ? {
        background: "#1f1b27",
        primaryColor: "#3a1f30",
        primaryTextColor: "#f4eef2",
        primaryBorderColor: "#ff4fb3",
        lineColor: "#a59faf",
        secondaryColor: "#221d2b",
        tertiaryColor: "#15131a",
        edgeLabelBackground: "#1f1b27",
        clusterBkg: "#221d2b",
        clusterBorder: "#443c4f",
      }
    : {
        background: "#ffffff",
        primaryColor: "#fce6f4",
        primaryTextColor: "#15131a",
        primaryBorderColor: "#ed1c9c",
        lineColor: "#5c5765",
        secondaryColor: "#f6f3f7",
        tertiaryColor: "#faf7f9",
        edgeLabelBackground: "#ffffff",
        clusterBkg: "#faf7f9",
        clusterBorder: "#d9d3dd",
      };
}

export default function MermaidDiagram({ chart, label }) {
  const generatedId = useId();
  const diagramId = `mermaid-${generatedId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const containerRef = useRef(null);
  const [dark, setDark] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const media = window.matchMedia(DARK_MODE_QUERY);
    const updateTheme = () => setDark(media.matches);
    updateTheme();
    media.addEventListener("change", updateTheme);
    return () => media.removeEventListener("change", updateTheme);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: themeVariables(dark),
        });
        const renderId = `${diagramId}-${dark ? "dark" : "light"}`;
        const { svg, bindFunctions } = await mermaid.render(renderId, chart);
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = svg;
        bindFunctions?.(containerRef.current);
        setError("");
      } catch (renderError) {
        if (cancelled) return;
        console.error("Unable to render Mermaid diagram", renderError);
        setError("Unable to render this lifecycle diagram.");
      }
    }

    renderDiagram();
    return () => {
      cancelled = true;
    };
  }, [chart, dark, diagramId]);

  return (
    <figure className="mermaid-figure">
      {error ? (
        <p className="mermaid-error" role="alert">
          {error}
        </p>
      ) : (
        <div
          ref={containerRef}
          className="mermaid-diagram"
          role="img"
          aria-label={label}
        />
      )}
      <figcaption>{label}</figcaption>
    </figure>
  );
}
