"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// React context that lets a server-rendered page tell the global LangToggle
// (in the header) "the EN counterpart of this URL is currently gated by
// humanReviewed:false — show me as disabled instead of letting the user
// click into a 308 → ES round-trip."

interface TranslationGateContextValue {
  blocked: boolean;
  setBlocked: (value: boolean) => void;
}

const TranslationGateContext = createContext<TranslationGateContextValue>({
  blocked: false,
  setBlocked: () => {},
});

export function TranslationGateProvider({ children }: { children: ReactNode }) {
  const [blocked, setBlocked] = useState(false);
  return (
    <TranslationGateContext.Provider value={{ blocked, setBlocked }}>
      {children}
    </TranslationGateContext.Provider>
  );
}

export function useTranslationGate() {
  return useContext(TranslationGateContext);
}

/**
 * Helper component a page renders inline to mark the current route as
 * EN-blocked. Call sites:
 *   <SetTranslationBlocked blocked={!property.humanReviewed} />
 * Resets to false on unmount so other routes don't inherit the state.
 */
export function SetTranslationBlocked({ blocked }: { blocked: boolean }) {
  const { setBlocked } = useContext(TranslationGateContext);
  useEffect(() => {
    setBlocked(blocked);
    return () => setBlocked(false);
  }, [blocked, setBlocked]);
  return null;
}
