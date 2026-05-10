"use client";

import { useApp, t } from "@/contexts/Providers";
import { useMemo, useState } from "react";

type DBKind = "systems" | "problems";

type SystemEntry = { id: string; domain: string; label: { en: string; zh: string }; blurb: { en: string; zh: string }; choke: { en: string; zh: string } };
type ProblemEntry = { id: string; label: { en: string; zh: string }; impact: number; tractability: number; crowd: number; note: { en: string; zh: string } };

export default function Database({ data, hue, kind }: { data: any; hue: string; kind: DBKind }) {
  const { lang } = useApp();
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"impact" | "marginal" | "tractability">("marginal");

  if (kind === "systems") {
    const list: SystemEntry[] = data.systems;
    const domains = ["all", ...Array.from(new Set(list.map((s) => s.domain)))];
    const filtered = list.filter((s) => {
      if (domain !== "all" && s.domain !== domain) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!t(s.label, lang).toLowerCase().includes(q) && !t(s.blurb, lang).toLowerCase().includes(q)) return false;
      }
      return true;
    });
    return (
      <div className="space-y-4">
        <div className="grid sm:grid-cols-[1fr_180px] gap-3">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === "zh" ? "搜索系统…" : "Search systems…"}
            className="px-3 py-2 font-mono text-[12px]" />
          <select value={domain} onChange={(e) => setDomain(e.target.value)}
            className="px-3 py-2 font-mono text-[12px] bg-[var(--bg)] border border-[var(--rule)]">
            {domains.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--ink-soft)]">{filtered.length} {lang === "zh" ? "条" : "results"}</div>
        <div className="grid sm:grid-cols-2 gap-px bg-[var(--rule)]">
          {filtered.map((s) => (
            <button key={s.id} onClick={() => setOpen(open === s.id ? null : s.id)} className="bg-[var(--bg)] hover:bg-[var(--bg-alt)] transition-colors p-4 text-left flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: hue }}>{s.domain}</span>
              </div>
              <div className="font-display text-lg leading-tight">{t(s.label, lang)}</div>
              <div className="font-body text-[12.5px] leading-relaxed text-[var(--ink-soft)]">{t(s.blurb, lang)}</div>
              {open === s.id && (
                <div className="mt-2 pt-2 border-t border-[var(--rule)] font-body text-[12px]">
                  <span className="font-mono uppercase tracking-wider text-[var(--accent)] text-[10px]">{lang === "zh" ? "咽喉点" : "chokepoint"}</span>
                  <p className="mt-1 text-[var(--ink-soft)]">{t(s.choke, lang)}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // problems
  const list: ProblemEntry[] = data.problems;
  const augmented = list.map((p) => ({ ...p, marginal: (p.impact * p.tractability) / Math.max(p.crowd, 1) }));
  const sorted = [...augmented].sort((a, b) => {
    if (sortBy === "impact") return b.impact - a.impact;
    if (sortBy === "tractability") return b.tractability - a.tractability;
    return b.marginal - a.marginal;
  });
  const filtered = sorted.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t(p.label, lang).toLowerCase().includes(q) || t(p.note, lang).toLowerCase().includes(q);
  });
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-[1fr_220px] gap-3">
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={lang === "zh" ? "搜索问题…" : "Search problems…"} className="px-3 py-2 font-mono text-[12px]" />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 font-mono text-[12px] bg-[var(--bg)] border border-[var(--rule)]">
          <option value="marginal">{lang === "zh" ? "边际优先 (impact×T÷crowd)" : "marginal (impact×T÷crowd)"}</option>
          <option value="impact">{lang === "zh" ? "影响" : "impact"}</option>
          <option value="tractability">{lang === "zh" ? "可处理" : "tractability"}</option>
        </select>
      </div>
      <div className="border border-[var(--rule)]">
        <div className="grid grid-cols-[1fr_90px_90px_90px] font-mono text-[10px] uppercase tracking-wider bg-[var(--bg-alt)] border-b border-[var(--rule)]">
          <div className="px-3 py-2 text-[var(--ink-soft)]">{lang === "zh" ? "问题" : "problem"}</div>
          <div className="px-3 py-2 text-[var(--ink-soft)] text-right border-l border-[var(--rule)]">{lang === "zh" ? "影响/年" : "impact/yr"}</div>
          <div className="px-3 py-2 text-[var(--ink-soft)] text-right border-l border-[var(--rule)]">T</div>
          <div className="px-3 py-2 text-[var(--ink-soft)] text-right border-l border-[var(--rule)]">{lang === "zh" ? "FTE" : "FTE"}</div>
        </div>
        {filtered.map((p) => (
          <button key={p.id} onClick={() => setOpen(open === p.id ? null : p.id)} className="block w-full text-left">
            <div className="grid grid-cols-[1fr_90px_90px_90px] border-b border-[var(--rule)] hover:bg-[var(--bg-alt)] transition-colors">
              <div className="px-3 py-2.5 font-display text-base">{t(p.label, lang)}</div>
              <div className="px-3 py-2.5 font-mono text-[12px] text-right border-l border-[var(--rule)]" style={{ color: hue }}>{(p.impact / 1_000_000).toFixed(2)}M</div>
              <div className="px-3 py-2.5 font-mono text-[12px] text-right border-l border-[var(--rule)] text-[var(--ink-soft)]">{p.tractability.toFixed(2)}</div>
              <div className="px-3 py-2.5 font-mono text-[12px] text-right border-l border-[var(--rule)] text-[var(--ink-soft)]">{p.crowd.toLocaleString()}</div>
            </div>
            {open === p.id && (
              <div className="px-3 py-3 bg-[var(--bg-alt)]/40 border-b border-[var(--rule)]">
                <p className="font-body text-[13px] text-[var(--ink-soft)] leading-relaxed">{t(p.note, lang)}</p>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-wider" style={{ color: hue }}>
                  marginal score: {p.marginal.toExponential(2)}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
