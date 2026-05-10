"use client";

import { useApp, t } from "@/contexts/Providers";
import { useEffect, useRef, useState } from "react";

type Agent = {
  id: number;
  type: "citizen" | "firm" | "regulator";
  cash: number;
  x: number; y: number;
  vx: number; vy: number;
  policy: string;
  alive: boolean;
};

export default function Agents({ data, hue }: { data: { pop: number; tickRate: number; defaults: any }; hue: string }) {
  const { lang } = useApp();
  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(false);
  const [policy, setPolicy] = useState<"greedy" | "satisficer" | "random">("greedy");
  const agentsRef = useRef<Agent[]>([]);
  const initRef = useRef(false);

  // Init
  if (!initRef.current) {
    const arr: Agent[] = [];
    for (let i = 0; i < data.defaults.citizens; i++) arr.push({ id: i, type: "citizen", cash: 50, x: Math.random() * 100, y: Math.random() * 100, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, policy: "greedy", alive: true });
    for (let i = 0; i < data.defaults.firms; i++) arr.push({ id: 1000 + i, type: "firm", cash: 200, x: Math.random() * 100, y: Math.random() * 100, vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2, policy: "greedy", alive: true });
    arr.push({ id: 9999, type: "regulator", cash: 1000, x: 50, y: 50, vx: 0, vy: 0, policy: "rule", alive: true });
    agentsRef.current = arr;
    initRef.current = true;
  }

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const arr = agentsRef.current;
      // Simple step: move; citizens lose cash; near firms → trade
      for (const a of arr) {
        if (!a.alive) continue;
        a.x += a.vx; a.y += a.vy;
        if (a.x < 1 || a.x > 99) a.vx *= -1;
        if (a.y < 1 || a.y > 99) a.vy *= -1;
        if (a.type === "citizen") {
          a.cash -= 0.5;
          // greedy → seek firm with cash; satisficer → seek if cash < threshold; random → don't seek
          if (a.cash < 30 && policy !== "random") {
            const firm = arr.find((f) => f.type === "firm" && f.alive && Math.abs(f.x - a.x) < 8 && Math.abs(f.y - a.y) < 8);
            if (firm && firm.cash > 5) {
              firm.cash -= 5; a.cash += 5;
            }
          }
          if (a.cash <= 0) a.alive = false;
        } else if (a.type === "firm") {
          a.cash += 1;
        }
      }
      setTick((t) => t + 1);
    }, data.tickRate);
    return () => clearInterval(id);
  }, [running, policy, data.tickRate]);

  const arr = agentsRef.current;
  const alive = arr.filter((a) => a.alive);
  const totalCash = arr.reduce((s, a) => s + (a.alive ? a.cash : 0), 0);
  const citizensAlive = alive.filter((a) => a.type === "citizen").length;
  const firms = alive.filter((a) => a.type === "firm");
  const gini = (() => {
    const cs = alive.filter((a) => a.type === "citizen").map((a) => a.cash).sort((a, b) => a - b);
    if (cs.length < 2) return 0;
    const n = cs.length;
    const sum = cs.reduce((s, x) => s + x, 0) || 1;
    let g = 0;
    for (let i = 0; i < n; i++) g += (2 * (i + 1) - n - 1) * cs[i];
    return g / (n * sum);
  })();

  const reset = () => { initRef.current = false; setTick(0); setRunning(false); /* trigger re-init via state */ window.location.reload(); };

  return (
    <div className="grid lg:grid-cols-[1fr_240px] gap-6">
      <div className="space-y-3">
        <div className="relative aspect-square border border-[var(--rule)] bg-[var(--bg-alt)]/40 overflow-hidden">
          {arr.map((a) => (
            <span key={a.id} aria-hidden className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity" style={{
              left: `${a.x}%`, top: `${a.y}%`,
              width: a.type === "citizen" ? 6 : a.type === "firm" ? 12 : 16,
              height: a.type === "citizen" ? 6 : a.type === "firm" ? 12 : 16,
              background: a.type === "citizen" ? hue : a.type === "firm" ? "var(--accent-2,_var(--accent))" : "transparent",
              border: a.type === "regulator" ? "2px solid var(--accent)" : "none",
              opacity: a.alive ? 1 : 0.15,
            }} />
          ))}
          <div className="absolute top-2 left-2 font-mono text-[10px] uppercase tracking-wider text-[var(--ink-soft)]">tick {tick}</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setRunning(!running)} className="px-4 py-2 border font-mono text-[11px] uppercase tracking-wider" style={{ borderColor: hue, color: hue }}>
            {running ? (lang === "zh" ? "暂停" : "pause") : (lang === "zh" ? "开始" : "run")}
          </button>
          <button onClick={() => setRunning(false)} className="px-4 py-2 border border-[var(--rule)] font-mono text-[11px] uppercase tracking-wider hover:border-[var(--accent)]">
            {lang === "zh" ? "停止" : "stop"}
          </button>
          <button onClick={reset} className="px-4 py-2 border border-[var(--rule)] font-mono text-[11px] uppercase tracking-wider hover:border-red-500">
            {lang === "zh" ? "重置" : "reset"}
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] mb-2">{lang === "zh" ? "策略" : "policy"}</div>
          <div className="flex flex-col gap-2">
            {(["greedy","satisficer","random"] as const).map((p) => (
              <button key={p} onClick={() => setPolicy(p)} className={`px-3 py-2 border font-mono text-[11px] uppercase text-left ${policy === p ? "" : "text-[var(--ink-soft)]"}`} style={{ borderColor: policy === p ? hue : "var(--rule)", color: policy === p ? hue : undefined }}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="border border-[var(--rule)] p-3 space-y-2 font-mono text-[11px]">
          <div className="flex justify-between"><span className="text-[var(--ink-soft)] uppercase">{lang === "zh" ? "公民存活" : "citizens alive"}</span><span style={{ color: hue }}>{citizensAlive}</span></div>
          <div className="flex justify-between"><span className="text-[var(--ink-soft)] uppercase">{lang === "zh" ? "企业" : "firms"}</span><span style={{ color: hue }}>{firms.length}</span></div>
          <div className="flex justify-between"><span className="text-[var(--ink-soft)] uppercase">{lang === "zh" ? "总现金" : "total cash"}</span><span style={{ color: hue }}>{totalCash.toFixed(0)}</span></div>
          <div className="flex justify-between"><span className="text-[var(--ink-soft)] uppercase">{lang === "zh" ? "基尼" : "gini"}</span><span style={{ color: hue }}>{gini.toFixed(3)}</span></div>
        </div>
        <p className="font-mono text-[10px] text-[var(--ink-soft)] leading-relaxed">
          {lang === "zh"
            ? "公民每 tick 损失 0.5 现金；如附近有企业且策略允许，会换取 5 单位。耗尽即死。"
            : "Citizens lose 0.5 cash per tick; trade for 5 with nearby firms if policy permits. Cash to zero = death."}
        </p>
      </div>
    </div>
  );
}
