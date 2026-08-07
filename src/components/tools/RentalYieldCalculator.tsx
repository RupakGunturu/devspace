import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

const FIELDS = [
  { key: "price", label: "Property Price ($)", placeholder: "350000", default: "350000" },
  { key: "rent", label: "Monthly Rent ($)", placeholder: "2200", default: "2200" },
  { key: "expenses", label: "Annual Expenses ($)", placeholder: "8000", default: "8000" },
];

const MARKET_DATA = [
  { market: "National Avg", grossYield: 5.8, netYield: 4.2 },
  { market: "New York", grossYield: 3.2, netYield: 2.1 },
  { market: "Austin", grossYield: 5.5, netYield: 3.8 },
  { market: "Phoenix", grossYield: 6.4, netYield: 4.9 },
  { market: "Miami", grossYield: 4.8, netYield: 3.1 },
  { market: "Nashville", grossYield: 6.1, netYield: 4.5 },
];

export function RentalYieldCalculator() {
  const [inputs, setInputs] = useState<Record<string, string>>(
    Object.fromEntries(FIELDS.map((f) => [f.key, f.default]))
  );
  const { color } = useToolAccent();

  const set = (key: string, val: string) => setInputs((prev) => ({ ...prev, [key]: val }));

  const result = useMemo(() => {
    const price = parseFloat(inputs.price);
    const monthlyRent = parseFloat(inputs.rent);
    const expenses = parseFloat(inputs.expenses);

    if ([price, monthlyRent, expenses].some(isNaN)) return null;
    if (price <= 0) return null;

    const annualRent = monthlyRent * 12;
    const grossYield = (annualRent / price) * 100;
    const netIncome = annualRent - expenses;
    const netYield = (netIncome / price) * 100;
    const capRate = netYield;
    const cashOnCash = ((netIncome / price) * 100);
    const monthlyExpenses = expenses / 12;
    const monthlyNet = monthlyRent - monthlyExpenses;
    const priceToRent = price / monthlyRent;

    const fmt = (v: number) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return {
      annualRent,
      grossYield,
      netIncome,
      netYield,
      capRate,
      cashOnCash,
      monthlyExpenses,
      monthlyNet,
      priceToRent,
      fmt,
    };
  }, [inputs]);

  const yieldColor = (yield_: number) => {
    if (yield_ >= 6) return "#22c55e";
    if (yield_ >= 4) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <ToolLayout id="rental-yield-calculator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {FIELDS.map(({ key, label, placeholder }) => (
          <div key={key}>
            <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">{label}</span>
            <input
              type="number"
              value={inputs[key]}
              onChange={(e) => set(key, e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
              style={{ borderColor: inputs[key] ? color : undefined }}
            />
          </div>
        ))}
      </div>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: "Gross Yield", value: `${result.fmt(result.grossYield)}%`, c: yieldColor(result.grossYield) },
              { label: "Net Yield", value: `${result.fmt(result.netYield)}%`, c: yieldColor(result.netYield) },
              { label: "Cap Rate", value: `${result.fmt(result.capRate)}%`, c: yieldColor(result.capRate) },
            ].map(({ label, value, c }) => (
              <div key={label} className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
                <div className="font-mono text-xs uppercase tracking-wider text-muted">{label}</div>
                <div className="mt-1 font-display text-3xl font-extrabold" style={{ color: c }}>{value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Annual Rent", value: `$${result.fmt(result.annualRent)}` },
              { label: "Annual Expenses", value: `$${result.fmt(result.annualRent - result.netIncome)}` },
              { label: "Net Annual Income", value: `$${result.fmt(result.netIncome)}` },
              { label: "Price-to-Rent Ratio", value: `${result.fmt(result.priceToRent)}x` },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted">{label}</div>
                <div className="mt-1 font-mono text-sm font-bold" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-md border-2 border-line bg-input-bg p-4">
              <div className="mb-1 font-mono text-xs uppercase tracking-wider text-muted">Monthly Cash Flow</div>
              <div className="font-display text-2xl font-extrabold" style={{ color: result.monthlyNet >= 0 ? "#22c55e" : "#ef4444" }}>
                {result.monthlyNet >= 0 ? "+" : ""}${result.fmt(result.monthlyNet)}
              </div>
              <div className="mt-1 font-mono text-xs text-muted">
                ${result.fmt(parseFloat(inputs.rent))}/mo rent - ${result.fmt(result.monthlyExpenses)}/mo expenses
              </div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-4">
              <div className="mb-1 font-mono text-xs uppercase tracking-wider text-muted">Investment Quality</div>
              <div className="mt-2 flex gap-2">
                {[
                  { label: "Cash Flow", pass: result.monthlyNet > 0 },
                  { label: "Yield > 5%", pass: result.grossYield > 5 },
                  { label: "P/R < 200", pass: result.priceToRent < 200 },
                  { label: "Net > 0", pass: result.netIncome > 0 },
                ].map(({ label, pass }) => (
                  <span
                    key={label}
                    className="rounded-full px-2 py-0.5 font-mono text-[10px] font-bold"
                    style={{
                      backgroundColor: pass ? "#22c55e20" : "#ef444420",
                      color: pass ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {pass ? "\u2713" : "\u2717"} {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Market Comparison
            </span>
            <div className="overflow-x-auto rounded-md border-2 border-line">
              <table className="w-full font-mono text-xs">
                <thead>
                  <tr className="border-b-2 border-line bg-input-bg">
                    <th className="px-3 py-2 text-left text-muted">Market</th>
                    <th className="px-3 py-2 text-right text-muted">Gross Yield</th>
                    <th className="px-3 py-2 text-right text-muted">Net Yield</th>
                    <th className="px-3 py-2 text-right text-muted">vs Your Property</th>
                  </tr>
                </thead>
                <tbody>
                  {MARKET_DATA.map((m) => {
                    const diff = result.grossYield - m.grossYield;
                    return (
                      <tr key={m.market} className="border-b border-line last:border-b-0">
                        <td className="px-3 py-2 font-bold text-input-text">{m.market}</td>
                        <td className="px-3 py-2 text-right text-input-text">{m.grossYield}%</td>
                        <td className="px-3 py-2 text-right text-input-text">{m.netYield}%</td>
                        <td
                          className="px-3 py-2 text-right font-bold"
                          style={{ color: diff > 0 ? "#22c55e" : diff < 0 ? "#ef4444" : "#f59e0b" }}
                        >
                          {diff > 0 ? "+" : ""}{result.fmt(diff)}%
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-input-bg font-bold">
                    <td className="px-3 py-2" style={{ color }}>Your Property</td>
                    <td className="px-3 py-2 text-right" style={{ color }}>{result.fmt(result.grossYield)}%</td>
                    <td className="px-3 py-2 text-right" style={{ color }}>{result.fmt(result.netYield)}%</td>
                    <td className="px-3 py-2 text-right text-muted">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!result && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter property details to calculate rental yield metrics
        </div>
      )}
    </ToolLayout>
  );
}
