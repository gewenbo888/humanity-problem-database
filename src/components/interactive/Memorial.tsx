"use client";

import { useApp, t } from "@/contexts/Providers";
import { useMemo, useState } from "react";

type Case = { id: string; year: number; label: { en: string; zh: string }; domain: string; mode: string[]; loss: { en: string; zh: string }; blurb: { en: string; zh: string } };

export default function Memorial({ data, hue }: { data: { cases: Case[] }; hue: string }) {
  const { lang } = useApp();
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState<string | null>(null);

  const allModes = useMemo(() => Array.from(new Set(data.cases.flatMap((c) => c.mode))), [data.cases]);
  const allDomains = useMemo(() => Array.from(new Set(data.cases.map((c) => c.domain))), [data.cases]);

  const filtered = data.cases.filter((c) => {
    if (filter === "all") return true;
    return c.domain === filter || c.mode.includes(filter);
  });
  // Sort by year ascending
  filtered.sort((a, b) => a.year - b.year);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5 font-mono text-[10px] uppercase tracking-wider">
        <button onClick={() => setFilter("all")} className={`px-2 py-1 border ${filter === "all" ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--rule)] text-[var(--ink-soft)]"}`}>all</button>
        {allDomains.map((d) => (
          <button key={d} onClick={() => setFilter(d)} className={`px-2 py-1 border ${filter === d ? "" : "text-[var(--ink-soft)]"}`} style={{ borderColor: filter === d ? hue : "var(--rule)", color: filter === d ? hue : undefined }}>{d}</button>
        ))}
        <span className="font-mono text-[10px] text-[var(--ink-soft)] mx-2 self-center">|</span>
        {allModes.map((m) => (
          <button key={m} onClick={() => setFilter(m)} className={`px-2 py-1 border ${filter === m ? "" : "text-[var(--ink-soft)]"}`} style={{ borderColor: filter === m ? hue : "var(--rule)", color: filter === m ? hue : undefined }}>{m}</button>
        ))}
      </div>

      <ol className="relative border-l border-[var(--rule)] pl-6 md:pl-8 space-y-6">
        {filtered.map((c) => (
          <li key={c.id} className="relative">
            <span className="absolute -left-[28px] md:-left-[36px] top-2 w-2.5 h-2.5 rounded-full" style={{ background: hue }} />
            <div className="font-mono text-[11px] uppercase tracking-wider" style={{ color: hue }}>{c.year} · {c.domain}</div>
            <button onClick={() => setOpen(open === c.id ? null : c.id)} className="font-display text-2xl mt-1 text-left hover:text-[var(--accent)] transition-colors">{t(c.label, lang)}</button>
            <p className="font-body text-sm md:text-base text-[var(--ink-soft)] mt-2 leading-relaxed">{t(c.blurb, lang)}</p>
            {open === c.id && (
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                <div className="border border-[var(--rule)] p-3">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-soft)]">{lang === "zh" ? "失败模式" : "failure mode"}</div>
                  <div className="font-mono text-[12px] mt-1" style={{ color: hue }}>{c.mode.join(" · ")}</div>
                </div>
                <div className="border border-[var(--rule)] p-3">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-soft)]">{lang === "zh" ? "损失" : "loss"}</div>
                  <div className="font-display text-base mt-1">{t(c.loss, lang)}</div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
