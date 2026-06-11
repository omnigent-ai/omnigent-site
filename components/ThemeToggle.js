"use client";

import { useEffect, useState } from "react";
import { SunIcon, MoonIcon, MonitorIcon } from "./icons";

// Order the button cycles through on each click.
const MODES = ["auto", "light", "dark"];

const LABELS = {
  auto: "system",
  light: "light",
  dark: "dark",
};

function applyTheme(mode) {
  // Explicit choices set data-theme so the CSS overrides win over the
  // prefers-color-scheme media query. "auto" leaves theming to the OS.
  document.documentElement.setAttribute("data-theme", mode);
}

export default function ThemeToggle() {
  // Render a stable default on the server and first client paint to avoid a
  // hydration mismatch; the inline script in <head> has already applied the
  // real theme to <html>, so there is no flash of the page itself.
  const [mode, setMode] = useState("auto");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let stored = null;
    try {
      stored = localStorage.getItem("theme");
    } catch (e) {
      /* localStorage unavailable (e.g. private mode) */
    }
    setMode(stored === "light" || stored === "dark" || stored === "auto" ? stored : "auto");
    setMounted(true);
  }, []);

  // When following the system preference, react to live OS theme flips so the
  // page updates without a reload. The CSS media query handles the repaint;
  // this keeps things consistent and is a no-op for explicit choices.
  useEffect(() => {
    if (mode !== "auto" || typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("auto");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [mode]);

  function cycle() {
    const next = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
    setMode(next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      /* ignore persistence failures */
    }
    applyTheme(next);
  }

  const Icon = mode === "light" ? SunIcon : mode === "dark" ? MoonIcon : MonitorIcon;
  const label = `Theme: ${LABELS[mode]} (click to change)`;

  return (
    <button
      type="button"
      className="nav-icon theme-toggle"
      onClick={cycle}
      aria-label={label}
      title={label}
    >
      {/* Keep markup stable until mounted so SSR and first client render match. */}
      {mounted ? <Icon size={20} /> : <MonitorIcon size={20} />}
    </button>
  );
}
