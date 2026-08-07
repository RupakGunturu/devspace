import { useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

interface BudgetItem {
  id: number;
  category: string;
  description: string;
  estimated: number;
  actual: number;
}

const CATEGORIES = ["Venue", "Catering", "AV", "Decor", "Marketing", "Staff", "Other"];

let nextId = 1;

export function EventBudgetPlanner() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [estimated, setEstimated] = useState("");
  const [actual, setActual] = useState("");
  const { color } = useToolAccent();

  const fmt = (v: number) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const addItem = () => {
    const est = parseFloat(estimated) || 0;
    const act = parseFloat(actual) || 0;
    if (!description.trim() || (est === 0 && act === 0)) return;
    setItems((prev) => [...prev, { id: nextId++, category, description: description.trim(), estimated: est, actual: act }]);
    setDescription("");
    setEstimated("");
    setActual("");
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const totalEstimated = items.reduce((s, i) => s + i.estimated, 0);
  const totalActual = items.reduce((s, i) => s + i.actual, 0);
  const variance = totalEstimated - totalActual;
  const variancePct = totalEstimated > 0 ? ((totalEstimated - totalActual) / totalEstimated) * 100 : 0;

  const categoryTotals = CATEGORIES.map((cat) => {
    const catItems = items.filter((i) => i.category === cat);
    return {
      category: cat,
      estimated: catItems.reduce((s, i) => s + i.estimated, 0),
      actual: catItems.reduce((s, i) => s + i.actual, 0),
    };
  }).filter((c) => c.estimated > 0 || c.actual > 0);

  const reset = () => {
    setItems([]);
    setDescription("");
    setEstimated("");
    setActual("");
  };

  const allText = items.map((i) => `${i.category} | ${i.description} | Est: $${fmt(i.estimated)} | Act: $${fmt(i.actual)} | Var: $${fmt(i.estimated - i.actual)}`).join("\n");

  return (
    <ToolLayout id="event-budget-planner">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Category</label>
          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className="rounded-md border-2 px-2 py-1 font-mono text-[10px] transition-all" style={category === c ? { borderColor: color, backgroundColor: color, color: "#fff" } : { borderColor: "var(--border)" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Main hall rental" className="w-full rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none placeholder:text-muted" onKeyDown={(e) => e.key === "Enter" && addItem()} />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Estimated ($)</label>
          <input type="number" value={estimated} onChange={(e) => setEstimated(e.target.value)} placeholder="0.00" className="w-full rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none placeholder:text-muted" />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Actual ($)</label>
          <input type="number" value={actual} onChange={(e) => setActual(e.target.value)} placeholder="0.00" className="w-full rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none placeholder:text-muted" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <ToolButton onClick={addItem} disabled={!description.trim()}>Add Item</ToolButton>
        <ToolButton variant="secondary" onClick={reset}>Reset</ToolButton>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border-2 border-line bg-input-bg p-3 text-center">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Total Estimated</span>
          <div className="font-display text-lg font-extrabold text-foreground">${fmt(totalEstimated)}</div>
        </div>
        <div className="rounded-lg border-2 border-line bg-input-bg p-3 text-center">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Total Actual</span>
          <div className="font-display text-lg font-extrabold" style={{ color }}>${fmt(totalActual)}</div>
        </div>
        <div className="rounded-lg border-2 border-line bg-input-bg p-3 text-center">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Variance</span>
          <div className="font-display text-lg font-extrabold" style={{ color: variance >= 0 ? "#10b981" : "#ef4444" }}>
            {variance >= 0 ? "+" : "-"}${fmt(Math.abs(variance))}
          </div>
          <span className="font-mono text-[10px]" style={{ color: variance >= 0 ? "#10b981" : "#ef4444" }}>
            {variancePct >= 0 ? "+" : ""}{variancePct.toFixed(1)}%
          </span>
        </div>
      </div>

      {categoryTotals.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">By Category</span>
            <CopyButton text={allText} />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {categoryTotals.map((ct) => (
              <div key={ct.category} className="rounded-md border-2 border-line bg-input-bg px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-foreground">{ct.category}</span>
                  <span className="font-mono text-[10px] text-muted">Est ${fmt(ct.estimated)} | Act ${fmt(ct.actual)}</span>
                </div>
                {ct.estimated > 0 && (
                  <div className="h-2 overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((ct.actual / ct.estimated) * 100, 100)}%`, backgroundColor: ct.actual <= ct.estimated ? "#10b981" : "#ef4444" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="overflow-x-auto rounded-md border-2 border-line">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="border-b-2 border-line bg-input-bg">
                <th className="px-3 py-2 text-left text-muted">Category</th>
                <th className="px-3 py-2 text-left text-muted">Description</th>
                <th className="px-3 py-2 text-right text-muted">Estimated</th>
                <th className="px-3 py-2 text-right text-muted">Actual</th>
                <th className="px-3 py-2 text-right text-muted">Variance</th>
                <th className="px-3 py-2 text-right text-muted"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const v = item.estimated - item.actual;
                return (
                  <tr key={item.id} className="border-b border-line last:border-b-0">
                    <td className="px-3 py-2 text-input-text">{item.category}</td>
                    <td className="px-3 py-2 text-input-text">{item.description}</td>
                    <td className="px-3 py-2 text-right text-input-text">${fmt(item.estimated)}</td>
                    <td className="px-3 py-2 text-right" style={{ color }}>${fmt(item.actual)}</td>
                    <td className="px-3 py-2 text-right" style={{ color: v >= 0 ? "#10b981" : "#ef4444" }}>{v >= 0 ? "+" : ""}{fmt(v)}</td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => removeItem(item.id)} className="text-muted transition-colors hover:text-coral">\u00d7</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </ToolLayout>
  );
}
