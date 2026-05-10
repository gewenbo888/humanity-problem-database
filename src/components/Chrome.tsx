"use client";

import { useApp, t } from "@/contexts/Providers";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PLATFORM_BY_ID, PLATFORMS } from "@/data/spec";
import { PLATFORM_ID } from "@/data/self";

const HUB_URL = "https://civlab.psyverse.fun";

export const SUBDOMAIN_FOR: Record<string, string> = Object.fromEntries(
  PLATFORMS.map((p) => [p.id, `https://${p.slug}.psyverse.fun`])
);

export default function Chrome({ children }: { children: React.ReactNode }) {
  const { lang, setLang, theme, toggleTheme } = useApp();
  const [open, setOpen] = useState(false);
  const self = PLATFORM_BY_ID[PLATFORM_ID];

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--bg)]/80 border-b border-[var(--rule)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3 group">
            <span className="font-display text-2xl" style={{ color: self.hue }}>{self.glyph}</span>
            <span className="hidden sm:flex flex-col leading-tight">
              <span className="font-display text-base tracking-tight">{t(self.name, lang)}</span>
              <span className="font-mono text-[10px] text-[var(--ink-soft)]">{self.slug}.psyverse.fun</span>
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-5 font-mono text-[12px] uppercase tracking-wider">
            <a href="#overview" className="text-[var(--ink-soft)] hover:text-[var(--accent)]">{lang === "zh" ? "概览" : "Overview"}</a>
            <a href="#demo"     className="text-[var(--ink-soft)] hover:text-[var(--accent)]">{lang === "zh" ? "演示" : "Demo"}</a>
            <a href="#modules"  className="text-[var(--ink-soft)] hover:text-[var(--accent)]">{lang === "zh" ? "模块" : "Modules"}</a>
            <a href="#features" className="text-[var(--ink-soft)] hover:text-[var(--accent)]">{lang === "zh" ? "功能" : "Features"}</a>
            <a href="#data"     className="text-[var(--ink-soft)] hover:text-[var(--accent)]">{lang === "zh" ? "数据" : "Data"}</a>
            <a href={HUB_URL}   className="text-[var(--accent)] hover:underline">civlab ↗</a>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === "en" ? "zh" : "en")} className="font-mono text-[11px] tracking-wider px-2.5 py-1 border border-[var(--rule)] hover:border-[var(--accent)] uppercase">
              {lang === "en" ? "中文" : "EN"}
            </button>
            <button onClick={toggleTheme} className="font-mono text-[11px] px-2.5 py-1 border border-[var(--rule)] hover:border-[var(--accent)]">{theme === "dark" ? "☾" : "☀"}</button>
            <button onClick={() => setOpen(true)} className="lg:hidden font-mono text-[11px] px-2.5 py-1 border border-[var(--rule)]">☰</button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[var(--bg)]/95 backdrop-blur-lg" onClick={() => setOpen(false)}>
            <div className="max-w-md mx-auto px-8 pt-24" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setOpen(false)} className="absolute top-4 right-4 px-3 py-1 border border-[var(--rule)] font-mono text-xs">✕</button>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-3">{lang === "zh" ? "本平台" : "This platform"}</div>
              <ul className="space-y-2 mb-8">
                {[
                  { href: "#overview", l: { en: "Overview", zh: "概览" } },
                  { href: "#demo",     l: { en: "Demo",     zh: "演示" } },
                  { href: "#modules",  l: { en: "Modules",  zh: "模块" } },
                  { href: "#features", l: { en: "Features", zh: "功能" } },
                  { href: "#data",     l: { en: "Data",     zh: "数据" } },
                ].map((it) => (
                  <li key={it.href}>
                    <a href={it.href} onClick={() => setOpen(false)} className="block py-1 font-display text-xl border-b border-[var(--rule)]">{t(it.l, lang)}</a>
                  </li>
                ))}
              </ul>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-3">{lang === "zh" ? "其他平台" : "Other platforms"}</div>
              <ul className="space-y-1">
                {PLATFORMS.filter((p) => p.id !== PLATFORM_ID).map((p) => (
                  <li key={p.id}>
                    <a href={SUBDOMAIN_FOR[p.id]} className="flex items-baseline justify-between py-1 border-b border-[var(--rule)]">
                      <span><span style={{ color: p.hue }}>{p.glyph}</span> <span className="font-display">{t(p.name, lang)}</span></span>
                      <span className="font-mono text-[10px] text-[var(--ink-soft)]">{p.slug}</span>
                    </a>
                  </li>
                ))}
                <li><a href={HUB_URL} className="block py-1 font-mono text-[var(--accent)]">civlab ↗</a></li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-[80vh]">{children}</main>

      <footer className="border-t border-[var(--rule)] mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 font-mono text-[11px] text-[var(--ink-soft)] grid md:grid-cols-3 gap-4">
          <div>
            <div className="font-display text-base text-[var(--ink)]">{t(self.name, lang)}</div>
            <div className="opacity-70 mt-1">{self.slug}.psyverse.fun</div>
          </div>
          <div>
            <div className="uppercase tracking-wider mb-1.5">{lang === "zh" ? "属于" : "Part of"}</div>
            <a href={HUB_URL} className="hover:text-[var(--accent)] underline underline-offset-2">civlab · civilization-scale lab</a>
          </div>
          <div className="md:text-right">
            <a href="https://psyverse.fun" className="hover:text-[var(--accent)]">psyverse.fun</a>
          </div>
        </div>
      </footer>
    </>
  );
}
