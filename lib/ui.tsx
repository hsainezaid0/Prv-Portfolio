"use client";

// Shared UI state: theme, command palette, assistant, terminal focus requests.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { storage } from "./storage";

export type Theme = "dark" | "light";

/** Screen point the theme change spreads from (usually the toggle button). */
export type Origin = { x: number; y: number };

type UIValue = {
  theme: Theme;
  setTheme: (theme: Theme, origin?: Origin) => void;
  toggleTheme: (origin?: Origin) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  chatOpen: boolean;
  openChat: (question?: string) => void;
  closeChat: () => void;
  pendingQuestion: string | null;
  consumePendingQuestion: () => string | null;
};

const UIContext = createContext<UIValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  // The inline script in layout.tsx already set data-theme; read it after mount.
  const [theme, setThemeState] = useState<Theme>("dark");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);

  useEffect(() => {
    setThemeState(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    // Follow the OS setting live, unless the visitor picked a theme themselves.
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (storage.get("cyb-theme")) return;
      const next: Theme = e.matches ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      setThemeState(next);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next: Theme, origin?: Origin) => {
    const root = document.documentElement;
    const apply = () => {
      root.dataset.theme = next;
      setThemeState(next);
    };
    storage.set("cyb-theme", next);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (typeof document.startViewTransition !== "function" || reduce) {
      apply(); // fallback: colors simply fade (CSS transition on body)
      return;
    }

    // The new theme grows as a circle from the click point until it covers the screen.
    const x = origin?.x ?? window.innerWidth - 40;
    const y = origin?.y ?? 40;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    root.classList.add("theme-switching"); // pause CSS color transitions so the snapshot is final
    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 700, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
    transition.finished.catch(() => {}).finally(() => root.classList.remove("theme-switching"));
  }, []);

  const value = useMemo<UIValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme: (origin) => setTheme(theme === "dark" ? "light" : "dark", origin),
      paletteOpen,
      setPaletteOpen,
      chatOpen,
      openChat: (question) => {
        if (question) setPendingQuestion(question);
        setChatOpen(true);
      },
      closeChat: () => setChatOpen(false),
      pendingQuestion,
      consumePendingQuestion: () => {
        const q = pendingQuestion;
        setPendingQuestion(null);
        return q;
      },
    }),
    [theme, setTheme, paletteOpen, chatOpen, pendingQuestion],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIValue {
  const value = useContext(UIContext);
  if (!value) throw new Error("useUI must be used inside <UIProvider>");
  return value;
}
