"use client";

import { useState } from "react";

export default function ContentTabs({ labels, children }) {
  const [active, setActive] = useState(0);
  const panels = Array.isArray(children) ? children : [children];

  return (
    <div>
      <div className="setup-tabs setup-tabs--full" role="tablist">
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={active === i}
            className={`setup-tab${active === i ? " active" : ""}`}
            onClick={() => setActive(i)}
          >
            {label}
          </button>
        ))}
      </div>
      {panels[active]}
    </div>
  );
}
