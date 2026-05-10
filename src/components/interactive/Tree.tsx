"use client";

import { useApp, t } from "@/contexts/Providers";
import { useMemo, useState } from "react";

type Node = { id: string; year: number; label: { en: string; zh: string }; domain: string; deps: string[] };

const DOMAIN_HUE: Record<string, string> = {
  energy: "#bd5d2c", material: "#5d7494", info: "#446ba0", life: "#5fa379", social: "#9b6f3a",
};

export default function Tree({ data, hue }: { data: { nodes: Node[] }; hue: string }) {
  const { lang } = useApp();
  const [active, setActive] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [filterDomain, setFilterDomain] = useState<string>("all");

  // Position by year (X) and a stable hash (Y bucket)
  const positions = useMemo(() => {
    const ymin = Math.min(...data.nodes.map((n) => n.year));
    const ymax = Math.max(...data.nodes.map((n) => n.year));
    // Use log-ish scale: most events are recent, span is huge
    const yearToX = (y: number) => {
      // shift so all positive
      const shifted = y - ymin + 1;
      const total = ymax - ymin + 1;
      // log-ish: use cube root of fraction
      return Math.pow(shifted / total, 0.42) * 100;
    };
    const out: Record<string, { x: number; y: number }> = {};
    // group by domain → assign to a band
    const domains = Array.from(new Set(data.nodes.map((n) => n.domain)));
    data.nodes.forEach((n) => {
      const bandIdx = domains.indexOf(n.domain);
      const yBase = (bandIdx + 0.5) / domains.length * 100;
      const jitter = ((n.id.charCodeAt(0) + n.id.charCodeAt(1) || 0) % 23) - 11;
      out[n.id] = { x: yearToX(n.year), y: yBase + jitter * 0.4 };
    });
    return out;
  }, [data.nodes]);

  // Compute walk-back path
  const path = useMemo(() => {
    if (!active) return new Set<string>();
    const seen = new Set<string>([active]);
    const queue = [active];
    while (queue.length) {
      const cur = queue.shift()!;
      const node = data.nodes.find((n) => n.id === cur);
      if (!node) continue;
      for (const d of node.deps) if (!seen.has(d)) { seen.add(d); queue.push(d); }
    }
    return seen;
  }, [active, data.nodes]);

  const visible = filterDomain === "all" ? data.nodes : data.nodes.filter((n) => n.domain === filterDomain);
  const visibleIds = new Set(visible.map((n) => n.id));
  const domains = Array.from(new Set(data.nodes.map((n) => n.domain)));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 font-mono text-[11px]">
        <button onClick={() => setFilterDomain("all")} className={`px-2.5 py-1 border ${filterDomain === "all" ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--rule)] text-[var(--ink-soft)]"}`}>
          {lang === "zh" ? "全部" : "all"}
        </button>
        {domains.map((d) => (
          <button key={d} onClick={() => setFilterDomain(d)} className={`px-2.5 py-1 border ${filterDomain === d ? "" : "text-[var(--ink-soft)]"}`} style={{ borderColor: filterDomain === d ? DOMAIN_HUE[d] : "var(--rule)", color: filterDomain === d ? DOMAIN_HUE[d] : undefined }}>
            {d}
          </button>
        ))}
        {active && (
          <button onClick={() => setActive(null)} className="ml-auto px-2.5 py-1 border border-[var(--rule)] text-[var(--ink-soft)] hover:border-[var(--accent)]">
            {lang === "zh" ? "清除选中" : "clear selection"}
          </button>
        )}
      </div>

      <div className="relative aspect-[16/8] border border-[var(--rule)] bg-[var(--bg-alt)]/40 overflow-hidden">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          {/* edges */}
          {data.nodes.flatMap((n) =>
            n.deps.map((dep) => {
              const a = positions[dep], b = positions[n.id];
              if (!a || !b) return null;
              const inPath = path.has(n.id) && path.has(dep);
              const isHover = hoverId && (hoverId === n.id || hoverId === dep);
              return (
                <line key={`${dep}-${n.id}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={inPath || isHover ? hue : "var(--ink-soft)"}
                  strokeWidth={inPath ? 0.5 : 0.15}
                  opacity={inPath ? 0.9 : isHover ? 0.7 : 0.18}
                  vectorEffect="non-scaling-stroke" />
              );
            })
          )}
        </svg>
        {data.nodes.map((n) => {
          if (!visibleIds.has(n.id)) return null;
          const p = positions[n.id];
          const isInPath = path.has(n.id);
          const isHover = hoverId === n.id;
          return (
            <button
              key={n.id}
              onMouseEnter={() => setHoverId(n.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => setActive(active === n.id ? null : n.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span className={`block rounded-full transition-all`} style={{
                width: isHover || isInPath ? 11 : 7,
                height: isHover || isInPath ? 11 : 7,
                background: DOMAIN_HUE[n.domain] || hue,
                opacity: active && !isInPath ? 0.3 : 1,
                boxShadow: isInPath ? `0 0 12px ${DOMAIN_HUE[n.domain]}` : undefined,
              }} />
              <span className={`absolute left-3 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[9px] tracking-wider pointer-events-none ${isHover || isInPath ? "opacity-100" : "opacity-50"} transition-opacity`}>
                {t(n.label, lang)}
              </span>
            </button>
          );
        })}
        <div className="absolute bottom-2 left-3 right-3 flex justify-between font-mono text-[9px] text-[var(--ink-soft)] uppercase tracking-wider pointer-events-none">
          <span>−700,000</span><span>−10,000</span><span>1500</span><span>2025</span>
        </div>
      </div>

      {active && (() => {
        const node = data.nodes.find((n) => n.id === active)!;
        return (
          <div className="border border-[var(--accent)] p-4 bg-[var(--bg-alt)]/40">
            <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">{node.year < 0 ? `${-node.year} ${lang === "zh" ? "公元前" : "BCE"}` : `${node.year}`} · {node.domain}</div>
            <div className="font-display text-2xl mt-1">{t(node.label, lang)}</div>
            <div className="font-mono text-[11px] text-[var(--ink-soft)] mt-2">
              {lang === "zh" ? "依赖路径长度" : "dependency path"}: {path.size} {lang === "zh" ? "节点" : "nodes"}
            </div>
          </div>
        );
      })()}

      <p className="font-mono text-[11px] text-[var(--ink-soft)]">
        {lang === "zh"
          ? "提示：点击任一节点——高亮其至『火』『口语』的所有依赖路径。"
          : "Tip: click any node to highlight its dependency path back to 'fire' and 'spoken language'."}
      </p>
    </div>
  );
}
