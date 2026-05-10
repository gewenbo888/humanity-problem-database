"use client";

import { useApp, t } from "@/contexts/Providers";
import { useState } from "react";

type Occ = { id: string; label: { en: string; zh: string }; automate: number; augment: number; moat: number };

export default function Matrix({ data, hue }: { data: { occupations: Occ[] }; hue: string }) {
  const { lang } = useApp();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"automate" | "augment" | "moat">("automate");

  const sorted = [...data.occupations].sort((a, b) => b[sortBy] - a[sortBy]);
  const filtered = sorted.filter((o) => !search || t(o.label, lang).toLowerCase().includes(search.toLowerCase()));

  const cell = (frac: number, color: string) => {
    const pct = Math.round(frac * 100);
    return (
      <div className="relative h-7 bg-[var(--bg-alt)]/30 overflow-hidden">
        <div className="absolute inset-y-0 left-0" style={{ width: `${pct}%`, background: color, opacity: 0.4 }} />
        <span className="relative font-mono text-[11px] leading-7 px-2">{pct}%</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-[1fr_220px] gap-3">
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={lang === "zh" ? "搜职业…" : "Search occupations…"} className="px-3 py-2 font-mono text-[12px]" />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-3 py-2 font-mono text-[12px] bg-[var(--bg)] border border-[var(--rule)]">
          <option value="automate">{lang === "zh" ? "排序：替代率" : "sort: automate"}</option>
          <option value="augment">{lang === "zh" ? "排序：增强率" : "sort: augment"}</option>
          <option value="moat">{lang === "zh" ? "排序：护城河" : "sort: moat"}</option>
        </select>
      </div>

      <div className="border border-[var(--rule)]">
        <div className="grid grid-cols-[1fr_120px_120px_120px] font-mono text-[10px] uppercase tracking-wider bg-[var(--bg-alt)] border-b border-[var(--rule)]">
          <div className="px-3 py-2 text-[var(--ink-soft)]">{lang === "zh" ? "职业" : "occupation"}</div>
          <div className="px-3 py-2 text-[var(--ink-soft)] border-l border-[var(--rule)]">{lang === "zh" ? "替代" : "automate"}</div>
          <div className="px-3 py-2 text-[var(--ink-soft)] border-l border-[var(--rule)]">{lang === "zh" ? "增强" : "augment"}</div>
          <div className="px-3 py-2 text-[var(--ink-soft)] border-l border-[var(--rule)]">{lang === "zh" ? "护城河" : "moat"}</div>
        </div>
        {filtered.map((o) => (
          <div key={o.id} className="grid grid-cols-[1fr_120px_120px_120px] border-b border-[var(--rule)] last:border-b-0">
            <div className="px-3 py-2 font-display text-base">{t(o.label, lang)}</div>
            <div className="border-l border-[var(--rule)]">{cell(o.automate, "#bd5d2c")}</div>
            <div className="border-l border-[var(--rule)]">{cell(o.augment, hue)}</div>
            <div className="border-l border-[var(--rule)]">{cell(o.moat, "#5fa379")}</div>
          </div>
        ))}
      </div>

      <p className="font-mono text-[11px] text-[var(--ink-soft)]">
        {lang === "zh"
          ? "提示：替代 + 增强 + 护城河 = 100%。每一职业按其任务被拆解后所得。"
          : "Note: automate + augment + moat = 100% per occupation. Each is the share of that occupation's task decomposition."}
      </p>
    </div>
  );
}
