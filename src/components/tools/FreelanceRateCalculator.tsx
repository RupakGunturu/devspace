import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

export function FreelanceRateCalculator() {
  const [annualIncome, setAnnualIncome] = useState("");
  const [billableHours, setBillableHours] = useState("30");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [taxRate, setTaxRate] = useState("30");
  const [profitMargin, setProfitMargin] = useState("20");
  const { color } = useToolAccent();

  const result = useMemo(() => {
    const income = parseFloat(annualIncome);
    const hours = parseFloat(billableHours) || 30;
    const expenses = parseFloat(monthlyExpenses) || 0;
    const tax = parseFloat(taxRate) || 30;
    const profit = parseFloat(profitMargin) || 20;

    if (isNaN(income) || income <= 0) return null;

    const annualExpenses = expenses * 12;
    const totalNeeded = income + annualExpenses;
    const taxedAmount = totalNeeded / (1 - tax / 100);
    const profitAmount = taxedAmount * (profit / 100);
    const annualRevenueNeeded = taxedAmount + profitAmount;
    const annualBillableHours = hours * 52;
    const hourlyRate = annualBillableHours > 0 ? annualRevenueNeeded / annualBillableHours : 0;
    const dailyRate = hourlyRate * 8;
    const monthlyRate = hourlyRate * hours * 4.33;
    const projectRate20h = hourlyRate * 20;
    const projectRate40h = hourlyRate * 40;
    const projectRate80h = hourlyRate * 80;

    return {
      annualRevenueNeeded,
      annualExpenses,
      taxedAmount,
      profitAmount,
      hourlyRate,
      dailyRate,
      monthlyRate,
      annualBillableHours,
      projectRate20h,
      projectRate40h,
      projectRate80h,
      income,
      expenses,
      tax,
      profit,
    };
  }, [annualIncome, billableHours, monthlyExpenses, taxRate, profitMargin]);

  const fmt = (v: number) =>
    v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtCurrency = (v: number) => `$${fmt(v)}`;

  return (
    <ToolLayout id="freelance-rate-calculator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Desired Annual Income ($)
          </span>
          <input
            type="number"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(e.target.value)}
            placeholder="100000"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: annualIncome ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Billable Hours / Week
          </span>
          <input
            type="number"
            value={billableHours}
            onChange={(e) => setBillableHours(e.target.value)}
            placeholder="30"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: billableHours ? color : undefined }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Monthly Expenses ($)
          </span>
          <input
            type="number"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(e.target.value)}
            placeholder="2000"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: monthlyExpenses ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Tax Rate (%)
          </span>
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            placeholder="30"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: taxRate ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Profit Margin (%)
          </span>
          <input
            type="number"
            value={profitMargin}
            onChange={(e) => setProfitMargin(e.target.value)}
            placeholder="20"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: profitMargin ? color : undefined }}
          />
        </div>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
              <div className="font-mono text-xs text-muted">Hourly Rate</div>
              <div className="mt-1 font-display text-2xl font-extrabold" style={{ color }}>
                {fmtCurrency(result.hourlyRate)}
              </div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
              <div className="font-mono text-xs text-muted">Daily Rate (8h)</div>
              <div className="mt-1 font-display text-2xl font-extrabold" style={{ color }}>
                {fmtCurrency(result.dailyRate)}
              </div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
              <div className="font-mono text-xs text-muted">Monthly Rate</div>
              <div className="mt-1 font-display text-2xl font-extrabold" style={{ color }}>
                {fmtCurrency(result.monthlyRate)}
              </div>
            </div>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Project Rate Estimates
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: "Small (20h)", rate: result.projectRate20h },
                { label: "Medium (40h)", rate: result.projectRate40h },
                { label: "Large (80h)", rate: result.projectRate80h },
              ].map(({ label, rate }) => (
                <div key={label} className="rounded-md border border-line p-3 text-center">
                  <div className="font-mono text-xs text-muted">{label}</div>
                  <div className="mt-1 font-mono text-sm font-bold" style={{ color }}>
                    {fmtCurrency(rate)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Revenue Breakdown
            </div>
            <div className="space-y-3">
              {[
                { label: "Desired Income", value: result.income, color: color },
                { label: "Annual Expenses", value: result.annualExpenses, color: "#64748b" },
                { label: "Before Tax (Income + Expenses)", value: result.taxedAmount, color: "#f59e0b" },
                { label: "Tax Amount", value: result.taxedAmount * (result.tax / 100), color: "#ef4444" },
                { label: "Profit Margin", value: result.profitAmount, color: "#10b981" },
                { label: "Total Annual Revenue Needed", value: result.annualRevenueNeeded, color: color },
              ].map(({ label, value, color: c }) => (
                <div key={label}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-mono text-xs text-muted">{label}</span>
                    <span className="font-mono text-sm font-bold" style={{ color: c }}>
                      {fmtCurrency(value)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((value / result.annualRevenueNeeded) * 100, 100)}%`,
                        backgroundColor: c,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Billable Hours/Year", value: `${result.annualBillableHours}` },
              { label: "Effective Hourly Income", value: fmtCurrency(result.income / result.annualBillableHours) },
              { label: "Total Revenue Needed", value: fmtCurrency(result.annualRevenueNeeded) },
              { label: "Revenue/Income Ratio", value: `${(result.annualRevenueNeeded / result.income).toFixed(1)}x` },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
                <div className="font-mono text-xs text-muted">{label}</div>
                <div className="mt-1 font-mono text-sm font-bold text-input-text">{value}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {!result && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter your desired income and expenses to calculate your freelance rates
        </div>
      )}
    </ToolLayout>
  );
}
