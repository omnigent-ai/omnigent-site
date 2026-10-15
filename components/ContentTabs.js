"use client";

import { Children, createContext, useContext, useId, useState } from "react";

const ContentTabsContext = createContext(null);

// One selector controls all interface-specific examples within the provider.
export function ContentTabsProvider({
  labels,
  defaultLabel = labels[0],
  children,
}) {
  const [selectedLabel, setSelectedLabel] = useState(defaultLabel);
  const id = useId();
  const active = Math.max(0, labels.indexOf(selectedLabel));
  return (
    <ContentTabsContext.Provider value={{ selectedLabel }}>
      <TabSelector
        labels={labels}
        active={active}
        onSelect={setSelectedLabel}
        id={id}
        panelId={() => `${id}-content`}
      />
      <div
        id={`${id}-content`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${active}`}
        tabIndex={0}
      >
        {children}
      </div>
    </ContentTabsContext.Provider>
  );
}

function TabSelector({ labels, active, onSelect, id, panelId }) {
  function onKeyDown(event, index) {
    let next;
    switch (event.key) {
      case "ArrowRight":
        next = (index + 1) % labels.length;
        break;
      case "ArrowLeft":
        next = (index - 1 + labels.length) % labels.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = labels.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    onSelect(labels[next]);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  }

  return (
    <div
      className="setup-tabs setup-tabs--full"
      role="tablist"
      aria-label="Example interface"
    >
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          role="tab"
          id={`${id}-tab-${i}`}
          aria-controls={panelId(i)}
          aria-selected={active === i}
          tabIndex={active === i ? 0 : -1}
          className={`setup-tab${active === i ? " active" : ""}`}
          onClick={() => onSelect(label)}
          onKeyDown={(event) => onKeyDown(event, i)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function ContentTabs({ labels, children }) {
  const shared = useContext(ContentTabsContext);
  const [localLabel, setLocalLabel] = useState(labels[0]);
  const selectedLabel = shared ? shared.selectedLabel : localLabel;
  const active = Math.max(0, labels.indexOf(selectedLabel));
  const panels = Children.toArray(children);
  const id = useId();

  if (shared) {
    // Keep every example mounted so code-copy controls initialize for all
    // interfaces, including ones selected after the page loads.
    return panels.map((panel, i) => (
      <div key={labels[i]} hidden={active !== i}>
        {panel}
      </div>
    ));
  }

  return (
    <div>
      <TabSelector
        labels={labels}
        active={active}
        onSelect={setLocalLabel}
        id={id}
        panelId={(i) => `${id}-panel-${i}`}
      />
      {panels.map((panel, i) =>
        active === i ? (
          <div
            key={labels[i]}
            id={`${id}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${i}`}
            hidden={active !== i}
            tabIndex={0}
          >
            {panel}
          </div>
        ) : null,
      )}
    </div>
  );
}
