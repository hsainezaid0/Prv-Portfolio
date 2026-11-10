"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Lang, Localized } from "@/content/profile";
import { en, type Dictionary } from "./en";
import { fr } from "./fr";
import { storage } from "@/lib/storage";

const dictionaries: Record<Lang, Dictionary> = { en, fr };

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dictionary;
  pick: (text: Localized) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  // The server always renders English; the browser then switches to the saved
  // or preferred language. Starting the same on both sides avoids hydration errors.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = storage.get("cyb-lang");
    if (saved === "en" || saved === "fr") setLangState(saved);
    else if (navigator.language.toLowerCase().startsWith("fr")) setLangState("fr");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    storage.set("cyb-lang", next);
  }, []);

  const value = useMemo<I18nValue>(
    () => ({ lang, setLang, t: dictionaries[lang], pick: (text) => text[lang] }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <I18nProvider>");
  return value;
}
