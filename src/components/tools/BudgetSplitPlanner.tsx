import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

interface Category {
  name: string;
  amount: number;
}

const DEFAULT_NEEDS: Category[] = [
  { name: "Rent / Mortgage", amount: 0 },
  { name: "Groceries", amount: 0 },
  { name: "Utilities", amount: 0 },
  { name: "Transportation", amount: 0 },
  { name: "Insurance", amount: 0 },
];

const DEFAULT_WANTS: Category[] = [
  { name: "Dining Out", amount: 0 },
  { name: "Entertainment", amount: 0 },
  { name: "Shopping", amount: 0 },
  { name: "Subscriptions", amount: 0 },
  { name: "Hobbies", amount: 0 },
];

const DEFAULT_SAVINGS: Category[] = [
  { name: "Emergency Fund", amount: 0 },
  { name: "Retirement", amount: 0 },
  { name: "Investments", amount: 0 },
  { name: "Debt Repayment", amount: 0 },
  { name: "Other Savings", amount: 0 },
];

const BUCKETS = [
  { key: "needs" as const, label: "Needs", pct: 50, color: "#3b82f6", defaults: DEFAULT_NEEDS },
  { key: "wants" as const, label: "Wants", pct: 30, color: "#f59e0b", defaults: DEFAULT_WANTS },
  {
    key: "savings" as const,
    label: "Savings",
    pct: 20,
    color: "#10b981",
    defaults: DEFAULT_SAVINGS,
  },
];

export function BudgetSplitPlanner() {
  const [income, setIncome] = useState("");
  const [needs, setNeeds] = useState<Category[]>(DEFAULT_NEEDS.map((c) => ({ ...c })));
  const [wants, setWants] = useState<Category[]>(DEFAULT_WANTS.map((c) => ({ ...c })));
  const [savings, setSavings] = useState<Category[]>(DEFAULT_SAVINGS.map((c) => ({ ...c })));
  const { color } = useToolAccent();

  const monthlyIncome = parseFloat(income) || 0;

  const totals = useMemo(() => {
    const n = needs.reduce((s, c) => s + c.amount, 0);
    const w = wants.reduce((s, c) => s + c.amount, 0);
    const sv = savings.reduce((s, c) => s + c.amount, 0);
    return { needs: n, wants: w, savings: sv, total: n + w + sv };
  }, [needs, wants, savings]);

  const fmt = (v: number) =>
    v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const updateCat = (
    setter: React.Dispatch<React.SetStateAction<Category[]>>,
    idx: number,
    val: number,
  ) => {
    setter((prev) => prev.map((c, i) => (i === idx ? { ...c, amount: Math.max(0, val) } : c)));
  };

  const resetAll = () => {
    setNeeds(DEFAULT_NEEDS.map((c) => ({ ...c })));
    setWants(DEFAULT_WANTS.map((c) => ({ ...c })));
    setSavings(DEFAULT_SAVINGS.map((c) => ({ ...c })));
  };

  const maxBar = Math.max(totals.needs, totals.wants, totals.savings, 1);
  const remaining = monthlyIncome - totals.total;

  const sections = [
    { data: needs, setter: setNeeds, ...BUCKETS[0] },
    { data: wants, setter: setWants, ...BUCKETS[1] },
    { data: savings, setter: setSavings, ...BUCKETS[2] },
  ];

  return (
    <ToolLayout id="budget-split-planner">
      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Monthly Income ($)
        </span>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          placeholder="5000"
          className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          style={{ borderColor: income ? color : undefined }}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {BUCKETS.map((b) => {
          const total =
            b.key === "needs" ? totals.needs : b.key === "wants" ? totals.wants : totals.savings;
          return (
            <div key={b.key} className="rounded-md border-2 border-line bg-input-bg p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold" style={{ color: b.color }}>
                  {b.label}
                </span>
                <span className="font-mono text-xs text-muted">
                  {b.pct}% = ${fmt((monthlyIncome * b.pct) / 100)}
                </span>
              </div>
              <div className="mt-2 font-display text-xl font-extrabold" style={{ color: b.color }}>
                ${fmt(total)}
              </div>
            </div>
          );
        })}
      </div>

      {monthlyIncome > 0 && (
        <div>
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Allocation Bars
          </span>
          <div className="space-y-2">
            {BUCKETS.map((b) => {
              const total =
                b.key === "needs"
                  ? totals.needs
                  : b.key === "wants"
                    ? totals.wants
                    : totals.savings;
              const pct = monthlyIncome > 0 ? (total / monthlyIncome) * 100 : 0;
              return (
                <div key={b.key}>
                  <div className="mb-1 flex items-center justify-between font-mono text-xs">
                    <span className="text-muted">{b.label}</span>
                    <span style={{ color: b.color }}>{pct.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: b.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-md border-2 border-line bg-input-bg p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm text-muted">Remaining Balance</span>
          <span
            className="font-display text-lg font-extrabold"
            style={{ color: remaining >= 0 ? "#10b981" : "#ef4444" }}
          >
            ${fmt(remaining)}
          </span>
        </div>
      </div>

      {sections.map((s) => (
        <div key={s.key}>
          <div className="mb-2 flex items-center justify-between">
            <span
              className="font-mono text-xs font-medium uppercase tracking-wider"
              style={{ color: s.color }}
            >
              {s.label} Breakdown
            </span>
          </div>
          <div className="space-y-2">
            {s.data.map((cat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-md border-2 border-line bg-input-bg px-3 py-2"
              >
                <span className="min-w-[120px] font-mono text-xs text-input-text">{cat.name}</span>
                <span className="font-mono text-xs text-muted">$</span>
                <input
                  type="number"
                  value={cat.amount || ""}
                  onChange={(e) => updateCat(s.setter, idx, parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-24 bg-transparent font-mono text-sm text-input-text outline-none"
                />
                {monthlyIncome > 0 && (
                  <span className="ml-auto font-mono text-xs text-muted">
                    {((cat.amount / monthlyIncome) * 100).toFixed(1)}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={resetAll}
        className="font-mono text-xs text-muted underline transition-colors hover:text-foreground"
      >
        Reset all categories
      </button>
    </ToolLayout>
  );
}
