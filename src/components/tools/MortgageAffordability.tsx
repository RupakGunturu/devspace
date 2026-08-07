import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";

const INPUTS = [
  { key: "income", label: "Annual Income ($)", placeholder: "85000", default: "85000" },
  { key: "debts", label: "Monthly Debts ($)", placeholder: "500", default: "500" },
  { key: "downPayment", label: "Down Payment ($)", placeholder: "60000", default: "60000" },
  { key: "rate", label: "Interest Rate (%/yr)", placeholder: "6.5", default: "6.5" },
  { key: "term", label: "Loan Term (years)", placeholder: "30", default: "30" },
];

const TAX_RATE = 0.0125;
const INSURANCE_MONTHLY = 150;
const MAX_DTI = 0.43;

export function MortgageAffordability() {
  const [inputs, setInputs] = useState<Record<string, string>>(
    Object.fromEntries(INPUTS.map((f) => [f.key, f.default]))
  );
  const { color } = useToolAccent();

  const set = (key: string, val: string) => setInputs((prev) => ({ ...prev, [key]: val }));

  const result = useMemo(() => {
    const income = parseFloat(inputs.income);
    const debts = parseFloat(inputs.debts);
    const down = parseFloat(inputs.downPayment);
    const rate = parseFloat(inputs.rate) / 100 / 12;
    const termYears = parseInt(inputs.term);

    if ([income, debts, down, rate, termYears].some(isNaN)) return null;
    if (income <= 0 || termYears <= 0) return null;

    const months = termYears * 12;
    const monthlyIncome = income / 12;
    const maxHousingPayment = monthlyIncome * MAX_DTI - debts;

    if (maxHousingPayment <= 0) return null;

    const calcPayment = (price: number) => {
      const loan = price - down;
      if (loan <= 0) return 0;
      const pmt = rate > 0
        ? (loan * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
        : loan / months;
      return pmt;
    };

    const calcMaxPrice = () => {
      let lo = down + 1;
      let hi = income * 10;
      for (let i = 0; i < 100; i++) {
        const mid = (lo + hi) / 2;
        const pmt = calcPayment(mid);
        const tax = (mid * TAX_RATE) / 12;
        const total = pmt + tax + INSURANCE_MONTHLY;
        if (total <= maxHousingPayment) lo = mid;
        else hi = mid;
      }
      return Math.floor((lo + hi) / 2 / 1000) * 1000;
    };

    const maxPrice = calcMaxPrice();
    const loan = maxPrice - down;
    const principalInterest = calcPayment(maxPrice);
    const propertyTax = (maxPrice * TAX_RATE) / 12;
    const insurance = INSURANCE_MONTHLY;
    const totalMonthly = principalInterest + propertyTax + insurance;
    const frontEndDTI = (totalMonthly / monthlyIncome) * 100;
    const backEndDTI = ((totalMonthly + debts) / monthlyIncome) * 100;
    const totalInterest = principalInterest * months - loan;

    const fmt = (v: number) => v.toLocaleString("en-US", { maximumFractionDigits: 0 });

    return {
      maxPrice,
      loan,
      principalInterest,
      propertyTax,
      insurance,
      totalMonthly,
      frontEndDTI,
      backEndDTI,
      totalInterest,
      maxHousingPayment,
      fmt,
    };
  }, [inputs]);

  return (
    <ToolLayout id="mortgage-affordability">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {INPUTS.map(({ key, label, placeholder }) => (
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
          <div className="rounded-md border-2 p-6 text-center" style={{ borderColor: color }}>
            <div className="font-mono text-xs uppercase tracking-wider text-muted">Maximum Affordable Home Price</div>
            <div className="mt-2 font-display text-4xl font-extrabold" style={{ color }}>
              ${result.fmt(result.maxPrice)}
            </div>
            <div className="mt-1 font-mono text-xs text-muted">
              Based on {MAX_DTI * 100}% debt-to-income ratio
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Loan Amount", value: `$${result.fmt(result.loan)}` },
              { label: "Down Payment", value: `$${result.fmt(result.maxPrice * (parseFloat(inputs.downPayment) / 100 || 0))}` },
              { label: "Total Interest", value: `$${result.fmt(result.totalInterest)}` },
              { label: "Max Monthly", value: `$${result.fmt(result.maxHousingPayment)}` },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted">{label}</div>
                <div className="mt-1 font-display text-lg font-extrabold" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Monthly Payment Breakdown (PITI)
            </div>
            <div className="space-y-3">
              {[
                { label: "Principal & Interest", value: result.principalInterest, pct: (result.principalInterest / result.totalMonthly) * 100 },
                { label: "Property Tax", value: result.propertyTax, pct: (result.propertyTax / result.totalMonthly) * 100 },
                { label: "Homeowners Insurance", value: result.insurance, pct: (result.insurance / result.totalMonthly) * 100 },
              ].map(({ label, value, pct }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-sm text-input-text">{label}</span>
                    <span className="font-mono text-sm font-bold" style={{ color }}>${result.fmt(value)}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-paper-dim/50">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-line pt-2">
                <span className="font-mono text-sm font-bold text-input-text">Total Monthly Payment</span>
                <span className="font-display text-xl font-extrabold" style={{ color }}>${result.fmt(result.totalMonthly)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-md border-2 border-line bg-input-bg p-4">
              <div className="mb-1 font-mono text-xs uppercase tracking-wider text-muted">Front-End DTI</div>
              <div className="flex items-center gap-3">
                <div className="font-display text-2xl font-extrabold" style={{ color: result.frontEndDTI <= 28 ? "#22c55e" : "#f59e0b" }}>
                  {result.frontEndDTI.toFixed(1)}%
                </div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-paper-dim/50">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (result.frontEndDTI / 28) * 100)}%`,
                      backgroundColor: result.frontEndDTI <= 28 ? "#22c55e" : "#f59e0b",
                    }}
                  />
                </div>
              </div>
              <div className="mt-1 font-mono text-[10px] text-muted">Recommended: &le;28%</div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-4">
              <div className="mb-1 font-mono text-xs uppercase tracking-wider text-muted">Back-End DTI</div>
              <div className="flex items-center gap-3">
                <div className="font-display text-2xl font-extrabold" style={{ color: result.backEndDTI <= 36 ? "#22c55e" : result.backEndDTI <= 43 ? "#f59e0b" : "#ef4444" }}>
                  {result.backEndDTI.toFixed(1)}%
                </div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-paper-dim/50">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (result.backEndDTI / 43) * 100)}%`,
                      backgroundColor: result.backEndDTI <= 36 ? "#22c55e" : result.backEndDTI <= 43 ? "#f59e0b" : "#ef4444",
                    }}
                  />
                </div>
              </div>
              <div className="mt-1 font-mono text-[10px] text-muted">Max: 43%</div>
            </div>
          </div>
        </div>
      )}

      {!result && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          {parseFloat(inputs.debts) >= parseFloat(inputs.income) / 12 * MAX_DTI
            ? "Monthly debts are too high relative to income for any mortgage"
            : "Enter your financial details to calculate mortgage affordability"}
        </div>
      )}
    </ToolLayout>
  );
}
