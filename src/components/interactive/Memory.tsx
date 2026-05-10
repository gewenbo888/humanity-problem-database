"use client";

import { useApp, t } from "@/contexts/Providers";
import { useMemo, useState } from "react";

type Record = { id: string; born: number; place: { en: string; zh: string }; era: { en: string; zh: string }; snippet: { en: string; zh: string } };

export default function Memory({ data, hue }: { data: { records: Record[] }; hue: string }) {
  const { lang } = useApp();
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search) return data.records;
    const q = search.toLowerCase();
    return data.records.filter((r) =>
      t(r.place, lang).toLowerCase().includes(q) ||
      t(r.era,   lang).toLowerCase().includes(q) ||
      t(r.snippet, lang).toLowerCase().includes(q) ||
      String(r.born).includes(q)
    );
  }, [search, data.records, lang]);

  const active = activeId ? data.records.find((r) => r.id === activeId) : null;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={lang === "zh" ? "试试：1985 / Wuhan / mobile / Sarajevo …" : "Try: 1985 / Wuhan / mobile / Sarajevo …"}
          className="w-full px-3 py-2.5 font-mono text-[12px]" />
        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-soft)]">
          {filtered.length} {lang === "zh" ? "条记录" : filtered.length === 1 ? "record" : "records"}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-px bg-[var(--rule)]">
        {filtered.map((r) => (
          <button key={r.id} onClick={() => setActiveId(activeId === r.id ? null : r.id)} className="bg-[var(--bg)] hover:bg-[var(--bg-alt)] transition-colors p-4 text-left flex flex-col gap-2">
            <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-wider">
              <span style={{ color: hue }}>b. {r.born} · {t(r.place, lang)}</span>
              <span className="text-[var(--ink-soft)]">{t(r.era, lang)}</span>
            </div>
            <div className="font-display text-lg leading-snug">"{t(r.snippet, lang)}"</div>
          </button>
        ))}
      </div>

      {active && (
        <div className="border border-[var(--accent)] p-4 bg-[var(--bg-alt)]/40">
          <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: hue }}>
            {lang === "zh" ? "档案 ID" : "record ID"}: {active.id} · b. {active.born} · {t(active.place, lang)} · {t(active.era, lang)}
          </div>
          <p className="font-display italic text-xl mt-3 leading-relaxed">"{t(active.snippet, lang)}"</p>
          <p className="font-mono text-[10px] text-[var(--ink-soft)] mt-3">
            {lang === "zh" ? "示例数据。真实档案在投稿后由志愿者编辑团队审核与匿名化。" : "Sample data. Real submissions are reviewed and anonymized by a volunteer editorial team."}
          </p>
        </div>
      )}

      <p className="font-mono text-[11px] text-[var(--ink-soft)] leading-relaxed">
        {lang === "zh" ? "示例搜索仅按子串匹配。生产版本会用嵌入向量做语义检索。" : "This sample search is plain substring. The production version will use embedding-based semantic retrieval."}
      </p>
    </div>
  );
}
