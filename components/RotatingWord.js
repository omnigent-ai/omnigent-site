"use client";

import { useState, useEffect } from "react";

// Cycles through `items` in place, editor-autocomplete style. Renders the
// first item on the server, so the H1 is still meaningful without JS / for SEO.
export default function RotatingWord({ items, interval = 2200 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((n) => (n + 1) % items.length),
      interval
    );
    return () => clearInterval(id);
  }, [items.length, interval]);

  return (
    <span className="rotator" key={index} aria-live="polite">
      {items[index]}
    </span>
  );
}
