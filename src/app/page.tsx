"use client";

import { useApp, t } from "@/contexts/Providers";
import { PLATFORM_BY_ID } from "@/data/spec";
import { PLATFORM_ID } from "@/data/self";
import Interactive from "@/components/Interactive";

export default function PlatformPage() {
  const { lang } = useApp();
  const s = PLATFORM_BY_ID[PLATFORM_ID];

  return (
    <>
      {/* HERO */}
      <section id="overview" className="relative">
        <div className="absolute inset-0 pointer-events-none opacity-25"
          style={{ background: `radial-gradient(circle at 30% 30%, ${s.hue} 0%, transparent 55%)` }} />
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-16 md:pt-28 pb-16">
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase mb-5 flex flex-wrap gap-x-3 gap-y-1 items-center">
            <span style={{ color: s.hue }}>civlab</span>
            <span className="text-[var(--ink-soft)]">·</span>
            <span className="text-[var(--ink-soft)]">{s.slug}.psyverse.fun</span>
            <span className="text-[var(--ink-soft)]">·</span>
            <span className="text-[var(--ink-soft)]">{s.interactiveKind}</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl xl:text-8xl leading-[1.02] tracking-tight max-w-5xl">
            <span style={{ color: s.hue }}>{s.glyph}</span>{" "}
            {t(s.name, lang)}
          </h1>
          <p className="mt-8 max-w-3xl font-display italic text-xl md:text-2xl text-[var(--ink-soft)] leading-snug">
            {t(s.oneLine, lang)}
          </p>
          <div className="mt-8 max-w-3xl font-body text-base md:text-lg leading-relaxed">
            {t(s.body, lang).split("\n\n").map((p, i) => <p key={i} className="mb-4">{p}</p>)}
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO */}
      <section id="demo" className="border-t border-[var(--rule)]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-20">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-3">{lang === "zh" ? "可交互演示" : "Interactive demo"}</div>
          <h2 className="font-display text-3xl md:text-4xl mb-8">
            {lang === "zh" ? "动手玩——而不是读截图。" : "Use it — don't read about it."}
          </h2>
          <Interactive />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-t border-[var(--rule)]">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-20">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-3">{lang === "zh" ? "功能" : "Features"}</div>
          <h2 className="font-display text-3xl md:text-4xl mb-8">{lang === "zh" ? "本平台对外承诺什么。" : "What this platform promises."}</h2>
          <div className="grid sm:grid-cols-2 gap-px bg-[var(--rule)]">
            {s.features.map((f, i) => (
              <article key={i} className="bg-[var(--bg)] p-6 flex flex-col gap-2">
                <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: s.hue }}>0{i + 1}</div>
                <h3 className="font-display text-lg leading-tight">{t(f.name, lang)}</h3>
                <p className="font-body text-sm text-[var(--ink-soft)] leading-relaxed">{t(f.body, lang)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section id="modules" className="border-t border-[var(--rule)]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-20">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-3">{lang === "zh" ? "模块" : "Modules"}</div>
          <h2 className="font-display text-3xl md:text-4xl mb-8">{lang === "zh" ? "组成本平台的模块。" : "Modules that compose this platform."}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--rule)]">
            {s.modules.map((m, i) => (
              <div key={m.id} className="bg-[var(--bg)] p-5 flex flex-col gap-2 min-h-[10rem]">
                <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: s.hue }}>{String(i + 1).padStart(2, "0")} · {m.id}</div>
                <h3 className="font-display text-base leading-tight">{t(m.name, lang)}</h3>
                <p className="font-body text-[12.5px] text-[var(--ink-soft)] leading-relaxed">{t(m.body, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DATA MODEL */}
      <section id="data" className="border-t border-[var(--rule)]">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-3">{lang === "zh" ? "数据模型" : "Data model"}</div>
          <h2 className="font-display text-3xl md:text-4xl mb-8">{t(s.dataModel.name, lang)}</h2>
          <div className="border border-[var(--rule)]">
            <div className="grid grid-cols-[160px_140px_1fr] font-mono text-[10px] uppercase tracking-wider bg-[var(--bg-alt)]/50 border-b border-[var(--rule)]">
              <div className="px-4 py-3 text-[var(--ink-soft)]">{lang === "zh" ? "字段" : "field"}</div>
              <div className="px-4 py-3 text-[var(--ink-soft)] border-l border-[var(--rule)]">{lang === "zh" ? "类型" : "type"}</div>
              <div className="px-4 py-3 text-[var(--ink-soft)] border-l border-[var(--rule)]">{lang === "zh" ? "说明" : "note"}</div>
            </div>
            {s.dataModel.fields.map((f, i) => (
              <div key={i} className="grid grid-cols-[160px_140px_1fr] border-b border-[var(--rule)] last:border-b-0">
                <div className="px-4 py-3 font-mono text-sm" style={{ color: s.hue }}>{f.key}</div>
                <div className="px-4 py-3 font-mono text-xs text-[var(--ink-soft)] border-l border-[var(--rule)]">{f.type}</div>
                <div className="px-4 py-3 font-body text-sm border-l border-[var(--rule)]">{t(f.note, lang)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
