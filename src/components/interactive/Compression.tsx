"use client";

import { useApp, t } from "@/contexts/Providers";
import { useMemo, useState } from "react";

type Concept = { i: number; label: { en: string; zh: string }; deps: number[] };

export default function Compression({ data, hue }: { data: { domain: { en: string; zh: string }; concepts: Concept[] }; hue: string }) {
  const { lang } = useApp();
  const [active, setActive] = useState<number>(1);

  // Layout in 4 rows × 3 cols
  const positions = useMemo(() => {
    const out: Record<number, { x: number; y: number }> = {};
    data.concepts.forEach((c, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      out[c.i] = { x: 18 + col * 32, y: 14 + row * 22 };
    });
    return out;
  }, [data.concepts]);

  // walk back path from active
  const path = useMemo(() => {
    const seen = new Set<number>([active]);
    const queue = [active];
    while (queue.length) {
      const cur = queue.shift()!;
      const c = data.concepts.find((x) => x.i === cur);
      if (!c) continue;
      for (const d of c.deps) if (!seen.has(d)) { seen.add(d); queue.push(d); }
    }
    return seen;
  }, [active, data.concepts]);

  return (
    <div className="space-y-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)]">
        {lang === "zh" ? "示例领域" : "Example domain"}: <span className="text-[var(--ink)]">{t(data.domain, lang)}</span>
      </div>

      <div className="relative aspect-[16/10] border border-[var(--rule)] bg-[var(--bg-alt)]/40 overflow-hidden">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          {data.concepts.flatMap((c) =>
            c.deps.map((d) => {
              const a = positions[d], b = positions[c.i];
              if (!a || !b) return null;
              const isOn = path.has(c.i) && path.has(d);
              return (
                <line key={`${d}-${c.i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={isOn ? hue : "var(--ink-soft)"}
                  strokeWidth={isOn ? 0.5 : 0.18}
                  opacity={isOn ? 0.85 : 0.25}
                  vectorEffect="non-scaling-stroke" />
              );
            })
          )}
        </svg>
        {data.concepts.map((c) => {
          const p = positions[c.i];
          const isActive = c.i === active;
          const inPath = path.has(c.i);
          return (
            <button key={c.i} onClick={() => setActive(c.i)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span className={`flex items-center justify-center rounded-full font-mono text-[11px] transition-all`} style={{
                width: 36, height: 36,
                background: isActive ? hue : inPath ? "var(--bg)" : "var(--bg-alt)",
                color: isActive ? "var(--bg)" : inPath ? hue : "var(--ink-soft)",
                border: `1.5px solid ${isActive || inPath ? hue : "var(--rule)"}`,
              }}>
                {c.i}
              </span>
              <span className={`absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap font-display text-sm ${inPath ? "text-[var(--ink)]" : "text-[var(--ink-soft)]"}`}>
                {t(c.label, lang)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="border border-[var(--accent)] p-4 bg-[var(--bg-alt)]/40">
        <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: hue }}>
          {lang === "zh" ? "概念" : "concept"} {active} / 12 · {lang === "zh" ? "依赖路径长度" : "dependency depth"}: {path.size}
        </div>
        <div className="font-display text-xl mt-1">{t(data.concepts.find((c) => c.i === active)!.label, lang)}</div>
        <div className="font-mono text-[11px] text-[var(--ink-soft)] mt-2">
          {lang === "zh" ? "前置：" : "Requires: "}
          {(() => {
            const deps = data.concepts.find((c) => c.i === active)!.deps;
            return deps.length === 0
              ? (lang === "zh" ? "（无——根概念）" : "(none — root)")
              : deps.map((d) => `${d}. ${t(data.concepts.find((x) => x.i === d)!.label, lang)}`).join(" · ");
          })()}
        </div>
      </div>

      <p className="font-mono text-[11px] text-[var(--ink-soft)]">
        {lang === "zh"
          ? "提示：点击任一节点，看其依赖路径——以及它所在的拓扑层。"
          : "Tip: click any node to see its dependency chain back to roots — and its topological layer."}
      </p>
    </div>
  );
}
