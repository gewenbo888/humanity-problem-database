"use client";

import { useApp, t } from "@/contexts/Providers";
import { useMemo, useState } from "react";

type Node = { id: string; kind: "element" | "material" | "product"; label: any; weight: number };
type Edge = { from: string; to: string };

const KIND_COLOR: Record<string, string> = {
  element:  "#7eb0a4",
  material: "#bd5d2c",
  product:  "#ffb340",
};

export default function Graph({ data, hue }: { data: { nodes: Node[]; edges: Edge[] }; hue: string }) {
  const { lang } = useApp();
  const [hover, setHover] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);

  // Lay out: elements left, materials middle, products right
  const positions = useMemo(() => {
    const cols = { element: data.nodes.filter(n => n.kind === "element"),
                   material: data.nodes.filter(n => n.kind === "material"),
                   product: data.nodes.filter(n => n.kind === "product") };
    const out: Record<string, { x: number; y: number }> = {};
    (["element","material","product"] as const).forEach((k, i) => {
      const x = i === 0 ? 14 : i === 1 ? 50 : 86;
      cols[k].forEach((n, j) => {
        const y = ((j + 0.5) / cols[k].length) * 90 + 5;
        out[n.id] = { x, y };
      });
    });
    return out;
  }, [data.nodes]);

  // Compute related nodes for active/hover
  const focused = active || hover;
  const related = useMemo(() => {
    if (!focused) return new Set<string>();
    const s = new Set<string>([focused]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const e of data.edges) {
        if (s.has(e.from) && !s.has(e.to)) { s.add(e.to); changed = true; }
        if (s.has(e.to) && !s.has(e.from)) { s.add(e.from); changed = true; }
      }
    }
    return s;
  }, [focused, data.edges]);

  const labelOf = (n: Node): string => typeof n.label === "string" ? n.label : t(n.label, lang);

  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-4 font-mono text-[10px] uppercase tracking-wider">
        {(["element","material","product"] as const).map((k) => (
          <span key={k} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: KIND_COLOR[k] }} />
            {k}
          </span>
        ))}
        {focused && (
          <button onClick={() => { setActive(null); setHover(null); }} className="ml-auto text-[var(--ink-soft)] hover:text-[var(--accent)]">
            {lang === "zh" ? "清除" : "clear"}
          </button>
        )}
      </div>

      <div className="relative aspect-[16/9] border border-[var(--rule)] bg-[var(--bg-alt)]/40">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          {data.edges.map((e, i) => {
            const a = positions[e.from], b = positions[e.to];
            if (!a || !b) return null;
            const isOn = focused && related.has(e.from) && related.has(e.to);
            return (
              <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={isOn ? hue : "var(--ink-soft)"}
                strokeWidth={isOn ? 0.5 : 0.15}
                opacity={isOn ? 0.8 : 0.2}
                vectorEffect="non-scaling-stroke" />
            );
          })}
        </svg>
        {data.nodes.map((n) => {
          const p = positions[n.id];
          const isFocus = focused === n.id;
          const inRel = focused ? related.has(n.id) : true;
          return (
            <button key={n.id}
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setActive(active === n.id ? null : n.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span className="block rounded-full transition-all" style={{
                width: 6 + n.weight * 1.2, height: 6 + n.weight * 1.2,
                background: KIND_COLOR[n.kind],
                opacity: focused && !inRel ? 0.2 : 1,
                boxShadow: isFocus ? `0 0 12px ${KIND_COLOR[n.kind]}` : undefined,
              }} />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px]">
                {labelOf(n)}
              </span>
            </button>
          );
        })}
      </div>

      {focused && (() => {
        const n = data.nodes.find((x) => x.id === focused)!;
        const elements = data.edges.filter((e) => e.to === focused).map((e) => e.from).filter((x) => data.nodes.find((nn) => nn.id === x)?.kind === "element");
        const materials = data.edges.filter((e) => e.to === focused).map((e) => e.from).filter((x) => data.nodes.find((nn) => nn.id === x)?.kind === "material");
        const usedIn = data.edges.filter((e) => e.from === focused).map((e) => e.to);
        return (
          <div className="border border-[var(--accent)] p-4 bg-[var(--bg-alt)]/40 grid sm:grid-cols-3 gap-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: KIND_COLOR[n.kind] }}>{n.kind}</div>
              <div className="font-display text-2xl mt-1">{labelOf(n)}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-soft)]">{lang === "zh" ? "组成" : "composed of"}</div>
              <div className="font-mono text-[12px] mt-1">{[...elements, ...materials].join(", ") || "—"}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-soft)]">{lang === "zh" ? "用于" : "used in"}</div>
              <div className="font-mono text-[12px] mt-1">{usedIn.join(", ") || "—"}</div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
