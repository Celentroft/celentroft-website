"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { dictionaries, type Key, type Lang } from "@/lib/i18n";

type Ctx = { lang: Lang; setLang: (lang: Lang) => void };

const LangContext = createContext<Ctx>({ lang: "en", setLang: () => {} });
const STORAGE_KEY = "lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Restore the saved choice, else follow the browser language (client only: no hydration mismatch).
  useEffect(() => {
    let next: Lang = navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "fr") next = saved;
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLangState(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** Translated string. `vars` fills {placeholders}. Usable from server components. */
export function T({ k, vars }: { k: Key; vars?: Record<string, string> }) {
  const { lang } = useLang();
  let text: string = dictionaries[lang][k];
  if (vars) for (const [name, value] of Object.entries(vars)) text = text.replaceAll(`{${name}}`, value);
  return <>{text}</>;
}

/**
 * Translated heading split into words, each in its own clipped line, so the stage can slide
 * them up one by one. Screen readers get the full sentence once (the words are aria-hidden).
 */
export function SplitT({ k, className }: { k: Key; className?: string }) {
  const { lang } = useLang();
  const text: string = dictionaries[lang][k];
  return (
    <span data-split className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.14em] align-bottom [margin-bottom:-0.14em]">
            <span className="wi inline-block will-change-transform">{word}</span>
            {" "}
          </span>
        ))}
      </span>
    </span>
  );
}

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div
      role="group"
      aria-label="Language"
      className="flex overflow-hidden rounded-md border border-border bg-card/60 font-mono text-xs"
    >
      {(["en", "fr"] as const).map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
          className={`px-2.5 py-1.5 uppercase transition-colors ${
            lang === code ? "bg-violet-600 text-white" : "text-muted-foreground hover:text-white"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
