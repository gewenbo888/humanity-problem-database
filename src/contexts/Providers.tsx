"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "zh";
type Theme = "light" | "dark";
type AppCtx = { lang: Lang; setLang: (l: Lang) => void; theme: Theme; toggleTheme: () => void };
const Ctx = createContext<AppCtx | null>(null);

const LS_LANG = "civlab.lang";
const LS_THEME = "civlab.theme";

function initLang(): Lang {
  if (typeof window === "undefined") return "en";
  const v = localStorage.getItem(LS_LANG);
  if (v === "en" || v === "zh") return v;
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}
function initTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const v = localStorage.getItem(LS_THEME);
  if (v === "light" || v === "dark") return v;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function Providers({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [theme, setTheme] = useState<Theme>("dark");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLangState(initLang());
    setTheme(initTheme());
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    localStorage.setItem(LS_LANG, lang);
    localStorage.setItem(LS_THEME, theme);
  }, [lang, theme, hydrated]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  const v = useMemo<AppCtx>(() => ({ lang, setLang, theme, toggleTheme }), [lang, setLang, theme, toggleTheme]);
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>;
}

export function useApp(): AppCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp outside provider");
  return c;
}

export function t<T extends { en: string; zh: string }>(o: T, lang: Lang): string {
  return lang === "zh" ? o.zh : o.en;
}
