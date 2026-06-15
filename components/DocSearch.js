"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

// Lazy-loaded Pagefind client. The index lives at /pagefind/pagefind.js, a
// static asset emitted by scripts/build-search-index.mjs after `next build`.
// webpackIgnore keeps the bundler from trying to resolve it at build time — it
// is fetched in the browser only when the user first opens search.
async function loadPagefind(ref) {
  if (ref.current) return ref.current;
  const pf = await import(/* webpackIgnore: true */ "/pagefind/pagefind.js");
  if (pf.init) await pf.init();
  ref.current = pf;
  return pf;
}

export default function DocSearch({ variant = "header" }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false); // false until first results arrive
  const [error, setError] = useState(false); // index unavailable (e.g. `next dev`)
  const pagefindRef = useRef(null);
  const inputRef = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setActive(0);
  }, []);

  // Global ⌘K / Ctrl+K to open.
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus the input when the modal opens.
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const runSearch = useCallback(async (q) => {
    if (!q.trim()) {
      setResults([]);
      setReady(false);
      return;
    }
    try {
      const pf = await loadPagefind(pagefindRef);
      const search = await pf.debouncedSearch(q);
      if (search === null) return; // superseded by a newer keystroke
      const data = await Promise.all(
        search.results.slice(0, 8).map((r) => r.data())
      );
      if (!mounted.current) return;
      setResults(data);
      setActive(0);
      setReady(true);
    } catch {
      // The index is a build artifact (/pagefind), absent under `next dev`.
      if (mounted.current) setError(true);
    }
  }, []);

  useEffect(() => {
    runSearch(query);
  }, [query, runSearch]);

  const go = useCallback(
    (url) => {
      if (!url) return;
      close();
      router.push(url);
    },
    [close, router]
  );

  function onInputKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = results[active];
      if (hit) go(hit.url);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  const trigger = (
    <button
      type="button"
      className={`docsearch-trigger docsearch-trigger--${variant}`}
      onClick={() => setOpen(true)}
      aria-label="Search docs"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="docsearch-trigger-label">Search docs</span>
      <kbd className="docsearch-kbd">⌘K</kbd>
    </button>
  );

  const modal =
    open && typeof document !== "undefined"
      ? createPortal(
          <div className="docsearch-overlay" onMouseDown={close}>
            <div
              className="docsearch-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Search documentation"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="docsearch-input-row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  ref={inputRef}
                  className="docsearch-input"
                  type="text"
                  placeholder="Search documentation…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  autoComplete="off"
                  spellCheck={false}
                />
                <kbd className="docsearch-kbd">Esc</kbd>
              </div>

              <div className="docsearch-results">
                {error && (
                  <p className="docsearch-empty">
                    Search index unavailable. Run a production build
                    (<code>bun run build</code>) to generate it.
                  </p>
                )}
                {!error && query.trim() && ready && results.length === 0 && (
                  <p className="docsearch-empty">
                    No results for &ldquo;{query}&rdquo;
                  </p>
                )}
                {results.map((r, i) => (
                  <a
                    key={r.url}
                    href={r.url}
                    className={`docsearch-result ${i === active ? "is-active" : ""}`}
                    onMouseEnter={() => setActive(i)}
                    onClick={(e) => {
                      e.preventDefault();
                      go(r.url);
                    }}
                  >
                    <span className="docsearch-result-title">
                      {r.meta?.title || r.url}
                    </span>
                    <span
                      className="docsearch-result-excerpt"
                      dangerouslySetInnerHTML={{ __html: r.excerpt }}
                    />
                  </a>
                ))}
              </div>

              <div className="docsearch-footer">
                <span><kbd className="docsearch-kbd">↑</kbd><kbd className="docsearch-kbd">↓</kbd> to navigate</span>
                <span><kbd className="docsearch-kbd">↵</kbd> to select</span>
                <span><kbd className="docsearch-kbd">Esc</kbd> to close</span>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {trigger}
      {modal}
    </>
  );
}
