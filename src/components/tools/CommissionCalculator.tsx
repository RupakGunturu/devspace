import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";

interface Tier {
  id: number;
  min: number;
  max: number | null;
  rate: number;
}

let nextTierId = 1;

export function CommissionCalculator() {
  const [baseSalary, setBaseSalary] = useState("");
  const [commissionRate, setCommissionRate] = useState("");
  const [target, setTarget] = useState("");
  const [actual, setActual] = useState("");
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [useTiers, setUseTiers] = useState(false);
  const { color } = useToolAccent();

  const fmt = (v: number) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const base = parseFloat(baseSalary) || 0;
  const rate = parseFloat(commissionRate) || 0;
  const salesTarget = parseFloat(target) || 0;
  const salesActual = parseFloat(actual) || 0;

  const flatCommission = useMemo(() => {
    if (useTiers || salesTarget === 0) return 0;
    return salesActual * (rate / 100);
  }, [useTiers, salesActual, rate, salesTarget]);

  const tierCommission = useMemo(() => {
    if (!useTiers || tiers.length === 0) return 0;
    let remaining = salesActual;
    let total = 0;
    for (const tier of tiers) {
      if (remaining <= 0) break;
      const tierMin = tier.min;
      const tierMax = tier.max !== null ? tier.max : Infinity;
      const tierSize = tierMax - tierMin;
      const applicable = Math.min(remaining, Math.max(0, tierSize));
      total += applicable * (tier.rate / 100);
      remaining -= applicable;
    }
    return total;
  }, [useTiers, tiers, salesActual]);

  const commission = useTiers ? tierCommission : flatCommission;
  const totalComp = base + commission;
  const quotaPct = salesTarget > 0 ? (salesActual / salesTarget) * 100 : 0;

  const addTier = () => {
    const lastMax = tiers.length > 0 ? (tiers[tiers.length - 1].max || tiers[tiers.length - 1].min + 50000) : 0;
    setTiers((prev) => [...prev, { id: nextTierId++, min: lastMax, max: lastMax + 50000, rate: rate || 10 }]);
  };

  const updateTier = (id: number, field: keyof Tier, value: string) => {
    setTiers((prev) => prev.map((t) =>
      t.id === id ? { ...t, [field]: field === "rate" ? parseFloat(value) || 0 : (field === "max" && value === "" ? null : parseFloat(value) || 0) } : t
    ));
  };

  const removeTier = (id: number) => {
    setTiers((prev) => prev.filter((t) => t.id !== id));
  };

  const reset = () => {
    setBaseSalary("");
    setCommissionRate("");
    setTarget("");
    setActual("");
    setTiers([]);
    setUseTiers(false);
  };

  return (
    <ToolLayout id="commission-calculator">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Base Salary ($)</label>
          <input type="number" value={baseSalary} onChange={(e) => setBaseSalary(e.target.value)} placeholder="75000" className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none placeholder:text-muted" style={{ borderColor: baseSalary ? color : undefined }} />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Commission Rate (%)</label>
          <input type="number" value={commissionRate} onChange={(e) => setCommissionRate(e.target.value)} placeholder="10" className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none placeholder:text-muted" style={{ borderColor: commissionRate ? color : undefined }} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Sales Target ($)</label>
          <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="500000" className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none placeholder:text-muted" style={{ borderColor: target ? color : undefined }} />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Actual Sales ($)</label>
          <input type="number" value={actual} onChange={(e) => setActual(e.target.value)} placeholder="425000" className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none placeholder:text-muted" style={{ borderColor: actual ? color : undefined }} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => setUseTiers(false)} className="rounded-md border-2 px-3 py-1.5 font-mono text-xs transition-all" style={!useTiers ? { borderColor: color, backgroundColor: color, color: "#fff" } : { borderColor: "var(--border)" }}>
          Flat Rate
        </button>
        <button onClick={() => setUseTiers(true)} className="rounded-md border-2 px-3 py-1.5 font-mono text-xs transition-all" style={useTiers ? { borderColor: color, backgroundColor: color, color: "#fff" } : { borderColor: "var(--border)" }}>
          Tiered Commission
        </button>
      </div>

      {useTiers && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">Commission Tiers</span>
            <ToolButton variant="secondary" onClick={addTier}>+ Add Tier</ToolButton>
          </div>
          {tiers.map((tier) => (
            <div key={tier.id} className="flex items-center gap-2 rounded-md border-2 border-line bg-input-bg px-3 py-2">
              <span className="font-mono text-xs text-muted">$</span>
              <input type="number" value={tier.min} onChange={(e) => updateTier(tier.id, "min", e.target.value)} className="w-24 bg-transparent font-mono text-xs text-input-text outline-none" />
              <span className="font-mono text-xs text-muted">to</span>
              <input type="number" value={tier.max ?? ""} onChange={(e) => updateTier(tier.id, "max", e.target.value)} placeholder="∞" className="w-24 bg-transparent font-mono text-xs text-input-text outline-none" />
              <span className="font-mono text-xs text-muted">@</span>
              <input type="number" value={tier.rate} onChange={(e) => updateTier(tier.id, "rate", e.target.value)} className="w-16 bg-transparent font-mono text-xs text-input-text outline-none" />
              <span className="font-mono text-xs text-muted">%</span>
              <button onClick={() => removeTier(tier.id)} className="ml-auto text-muted transition-colors hover:text-coral">\u00d7</button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border-2 border-line bg-input-bg p-3 text-center">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Base Salary</span>
          <div className="font-display text-lg font-extrabold text-foreground">${fmt(base)}</div>
        </div>
        <div className="rounded-lg border-2 border-line bg-input-bg p-3 text-center">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Commission</span>
          <div className="font-display text-lg font-extrabold" style={{ color }}>${fmt(commission)}</div>
        </div>
        <div className="rounded-lg border-2 border-line bg-input-bg p-3 text-center">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Total Comp</span>
          <div className="font-display text-lg font-extrabold" style={{ color: "#10b981" }}>${fmt(totalComp)}</div>
        </div>
        <div className="rounded-lg border-2 border-line bg-input-bg p-3 text-center">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">vs Quota</span>
          <div className="font-display text-lg font-extrabold" style={{ color: quotaPct >= 100 ? "#10b981" : quotaPct >= 75 ? "#f59e0b" : "#ef4444" }}>
            {quotaPct.toFixed(1)}%
          </div>
        </div>
      </div>

      {salesTarget > 0 && (
        <div>
          <div className="mb-1 flex items-center justify-between font-mono text-xs">
            <span className="text-muted">Quota Attainment</span>
            <span style={{ color: quotaPct >= 100 ? "#10b981" : quotaPct >= 75 ? "#f59e0b" : "#ef4444" }}>{quotaPct.toFixed(1)}%</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(quotaPct, 100)}%`, backgroundColor: quotaPct >= 100 ? "#10b981" : quotaPct >= 75 ? "#f59e0b" : "#ef4444" }} />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-muted">
            <span>$0</span>
            <span>${fmt(salesTarget)}</span>
          </div>
        </div>
      )}

      <button onClick={reset} className="font-mono text-xs text-muted underline transition-colors hover:text-foreground">
        Reset
      </button>
    </ToolLayout>
  );
}
