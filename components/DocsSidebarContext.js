"use client";

import { createContext, useContext, useState, useCallback } from "react";

const DocsSidebarContext = createContext(null);

export function DocsSidebarProvider({ children }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <DocsSidebarContext.Provider value={{ open, toggle, close }}>
      {children}
    </DocsSidebarContext.Provider>
  );
}

export function useDocsSidebar() {
  return useContext(DocsSidebarContext);
}
