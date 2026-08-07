import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

const REGIONS: Record<string, { label: string; brackets: TaxBracket[]; selfEmployment: number; deduction: number }> = {
  US: {
    label: "United States",
    brackets: [
      { min: 0, max: 11000, rate: 0.10 },
      { min: 11000, max: 44725, rate: 0.12 },
      { min: 44725, max: 95375, rate: 0.22 },
      { min: 95375, max: 182100, rate: 0.24 },
      { min: 182100, max: 231250, rate: 0.32 },
      { min: 231250, max: 578125, rate: 0.35 },
      { min: 578125, max: Infinity, rate: 0.37 },
    ],
    selfEmployment: 0.153,
    deduction: 14600,
  },
  UK: {
    label: "United Kingdom",
    brackets: [
      { min: 0, max: 12570, rate: 0 },
      { min: 12570, max: 50270, rate: 0.20 },
      { min: 50270, max: 125140, rate: 0.40 },
      { min: 125140, max: Infinity, rate: 0.45 },
    ],
    selfEmployment: 0.09,
    deduction: 12570,
  },
  EU: {
    label: "Germany (EU representative)",
    brackets: [
      { min: 0, max: 11004, rate: 0 },
      { min: 11004, max: 17005, rate: 0.14 },
      { min: 17005, max: 66760, rate: 0.24 },
      { min: 66760, max: 277825, rate: 0.42 },
      { min: 277825, max: Infinity, rate: 0.45 },
    ],
    selfEmployment: 0.186,
    deduction: 11004,
  },
  India: {
    label: "India",
    brackets: [
      { min: 0, max: 300000, rate: 0 },
      { min: 300000, max: 600000, rate: 0.05 },
      { min: 600000, max: 900000, rate: 0.10 },
      { min: 900000, max: 1200000, rate: 0.15 },
      { min: 1200000, max: 1500000, rate: 0.20 },
      { min: 1500000, max: Infinity, rate: 0.30 },
    ],
    selfEmployment: 0,
    deduction: 50000,
  },
};

export function FreelanceTaxEstimator() {
  const [income, setIncome] = useState("");
  const [region, setRegion] = useState("US");
  const [expenses, setExpenses] = useState("");
  const { color } = useToolAccent();

  const result = useMemo(() => {
    const gross = parseFloat(income);
    const exp = parseFloat(expenses) || 0;
    if (isNaN(gross) || gross <= 0) return null;

    const r = REGIONS[region];
    const taxable = Math.max(0, gross - exp - r.deduction);

    let incomeTax = 0;
    for (const bracket of r.brackets) {
      if (taxable <= bracket.min) break;
      const upper = Math.min(taxable, bracket.max);
      incomeTax += (upper - bracket.min) * bracket.rate;
    }

    const selfEmployment = gross * r.selfEmployment;
    const totalTax = incomeTax + selfEmployment;
    const net = gross - totalTax - exp;
    const effectiveRate = gross > 0 ? (totalTax / gross) * 100 : 0;
    const quarterly = totalTax / 4;

    return { incomeTax, selfEmployment, totalTax, net, effectiveRate, quarterly, taxable, gross };
  }, [income, region, expenses]);

  const fmt = (v: number) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <ToolLayout id="freelance-tax-estimator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Annual Income ($)</span>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="85000"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: income ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Country / Region</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          >
            {Object.entries(REGIONS).map(([key, r]) => (
              <option key={key} value={key}>{r.label}</option>
            ))}
          </select>
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Business Expenses ($)</span>
          <input
            type="number"
            value={expenses}
            onChange={(e) => setExpenses(e.target.value)}
            placeholder="5000"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          />
        </div>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-md border-2 border-line bg-input-bg p-4">
              <div className="font-mono text-xs uppercase tracking-wider text-muted">Gross Income</div>
              <div className="mt-1 font-display text-2xl font-extrabold text-input-text">${fmt(result.gross)}</div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-4">
              <div className="font-mono text-xs uppercase tracking-wider text-muted">Net Income After Tax</div>
              <div className="mt-1 font-display text-2xl font-extrabold" style={{ color: "#10b981" }}>${fmt(result.net)}</div>
            </div>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-muted">Tax Breakdown</div>
            <div className="space-y-3">
              {[
                { label: "Income Tax", value: result.incomeTax },
                { label: "Self-Employment Tax", value: result.selfEmployment },
                { label: "Total Tax", value: result.totalTax, highlight: true },
              ].map(({ label, value, highlight }) => (
                <div key={label}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-mono text-xs text-muted">{label}</span>
                    <span className="font-mono text-sm" style={{ color: highlight ? color : undefined }}>${fmt(value)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((value / result.gross) * 100, 100)}%`,
                        backgroundColor: highlight ? color : "#64748b",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-xs text-muted">Effective Tax Rate</div>
              <div className="mt-1 font-display text-xl font-extrabold" style={{ color }}>{result.effectiveRate.toFixed(1)}%</div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-xs text-muted">Taxable Income</div>
              <div className="mt-1 font-display text-xl font-extrabold text-input-text">${fmt(result.taxable)}</div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-xs text-muted">Deduction ({REGIONS[region].label})</div>
              <div className="mt-1 font-display text-xl font-extrabold text-input-text">${fmt(REGIONS[region].deduction)}</div>
            </div>
          </div>

          <div>
            <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Quarterly Payment Breakdown</span>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {["Q1", "Q2", "Q3", "Q4"].map((q, i) => (
                <div key={q} className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
                  <div className="font-mono text-xs text-muted">{q} (Month {i * 3 + 1}-{i * 3 + 3})</div>
                  <div className="mt-1 font-mono text-lg font-bold" style={{ color }}>${fmt(result.quarterly)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border-2 border-dashed border-line p-3 font-mono text-xs text-muted">
            Estimates only \u2014 based on {REGIONS[region].label} {region === "US" ? "2024" : "current"} tax brackets.
            Consult a tax professional for actual filing.
          </div>
        </>
      )}

      {!result && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter your income details above to estimate taxes
        </div>
      )}
    </ToolLayout>
  );
}
