"use client";

import { useApp, t } from "@/contexts/Providers";
import { useMemo, useState } from "react";

type Slider = { id: string; label: { en: string; zh: string }; min: number; max: number; default: number };

export default function Simulator({ data, hue }: { data: { sliders: Slider[]; outputs: string[] }; hue: string }) {
  const { lang } = useApp();
  const [vals, setVals] = useState<Record<string, number>>(
    Object.fromEntries(data.sliders.map((s) => [s.id, s.default]))
  );

  // Deterministic "simulation" — runs a closed-form forward 30 years
  // GDP, pop, capability, energy projections; trivial coupled equations
  const projection = useMemo(() => {
    const years = 30;
    const out: { yr: number; gdp: number; pop: number; cap: number; eng: number }[] = [];
    let gdp = 100, pop = 100, cap = 100, eng = 100;
    const agi = vals["agi-rate"] / 100;       // capability growth /yr
    const eRate = vals["energy-cost"] / 100;  // energy cost change /yr (negative = cheaper)
    const dem = vals["demography"] / 100;     // working-age pop change /yr
    const aut = vals["automation"] / 100;     // automation deployment / yr
    const frag = vals["fragmentation"];        // 0..1
    for (let i = 0; i <= years; i++) {
      // Capability compounds with AGI rate, dampened by fragmentation
      cap *= 1 + agi * (1 - 0.3 * frag);
      // Population from demographic rate (compounds)
      pop *= 1 + dem;
      // Energy per capita: inverse cost change, modulated by fragmentation
      eng *= 1 + (-eRate) * (1 - 0.4 * frag);
      // GDP: pop × productivity. Productivity = (cap × eng × (1 + automation)) / 100
      const prod = (cap * eng * (1 + aut * 5)) / 10000;
      gdp = pop * prod;
      out.push({ yr: i, gdp, pop, cap, eng });
    }
    return out;
  }, [vals]);

  const max = useMemo(() => ({
    gdp: Math.max(...projection.map((p) => p.gdp)),
    pop: Math.max(...projection.map((p) => p.pop)),
    cap: Math.max(...projection.map((p) => p.cap)),
    eng: Math.max(...projection.map((p) => p.eng)),
  }), [projection]);

  const finalRow = projection[projection.length - 1];

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6">
      {/* Sliders */}
      <div className="space-y-5">
        {data.sliders.map((s) => (
          <div key={s.id}>
            <div className="flex items-baseline justify-between font-mono text-[11px] mb-1">
              <span className="text-[var(--ink-soft)] uppercase tracking-wider">{t(s.label, lang)}</span>
              <span style={{ color: hue }}>{vals[s.id].toFixed(s.id === "fragmentation" ? 2 : 1)}</span>
            </div>
            <input type="range" min={s.min} max={s.max} step={s.id === "fragmentation" ? 0.05 : 0.1}
              value={vals[s.id]}
              onChange={(e) => setVals({ ...vals, [s.id]: Number(e.target.value) })}
              style={{ accentColor: hue }}
              className="w-full" />
            <div className="flex justify-between font-mono text-[10px] text-[var(--ink-soft)] mt-1 opacity-70">
              <span>{s.min}</span><span>{s.max}</span>
            </div>
          </div>
        ))}
        <button onClick={() => setVals(Object.fromEntries(data.sliders.map((s) => [s.id, s.default])))}
          className="w-full px-3 py-2 border border-[var(--rule)] hover:border-[var(--accent)] font-mono text-[11px] uppercase tracking-wider">
          {lang === "zh" ? "重置" : "reset"}
        </button>
      </div>

      {/* Output */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[var(--rule)]">
          {[
            { id: "gdp", label: { en: "GDP idx (30y)", zh: "GDP 指数 (30y)" }, val: finalRow.gdp },
            { id: "pop", label: { en: "Population",    zh: "人口" },           val: finalRow.pop },
            { id: "cap", label: { en: "Capability",    zh: "能力" },           val: finalRow.cap },
            { id: "eng", label: { en: "Energy/capita", zh: "人均能源" },        val: finalRow.eng },
          ].map((m) => (
            <div key={m.id} className="bg-[var(--bg)] p-4">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-soft)]">{t(m.label, lang)}</div>
              <div className="font-display text-3xl mt-1" style={{ color: hue }}>{m.val.toFixed(0)}</div>
              <div className="font-mono text-[10px] text-[var(--ink-soft)] mt-1">{m.val > 100 ? `+${(m.val - 100).toFixed(0)}` : `${(m.val - 100).toFixed(0)}`} {lang === "zh" ? "vs 起点" : "vs start"}</div>
            </div>
          ))}
        </div>

        {/* Mini chart */}
        <div className="border border-[var(--rule)] p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] mb-3">{lang === "zh" ? "30 年轨迹（GDP）" : "30-year trajectory (GDP)"}</div>
          <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="w-full h-32">
            <polyline
              fill="none"
              stroke={hue}
              strokeWidth="1.5"
              points={projection.map((p, i) => `${(i / 30) * 300},${100 - (p.gdp / max.gdp) * 95}`).join(" ")}
              vectorEffect="non-scaling-stroke"
            />
            {[0, 30].map((y) => (
              <line key={y} x1={(y / 30) * 300} y1="0" x2={(y / 30) * 300} y2="100" stroke="var(--rule)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
          <div className="flex justify-between font-mono text-[10px] text-[var(--ink-soft)] mt-1">
            <span>now</span><span>+30y</span>
          </div>
        </div>

        <p className="font-mono text-[11px] text-[var(--ink-soft)] leading-relaxed">
          {lang === "zh"
            ? "提示：模拟是确定性的——给定相同的滑块值，永远得到相同输出。这是为了直觉，不是为了预测。"
            : "Note: this simulation is deterministic — same sliders always produce the same output. The point is intuition, not prediction."}
        </p>
      </div>
    </div>
  );
}
