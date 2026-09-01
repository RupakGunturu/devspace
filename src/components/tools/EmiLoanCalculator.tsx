import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";

export function EmiLoanCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const { color } = useToolAccent();

  const result = useMemo(() => {
    const P = parseFloat(principal);
    const annualRate = parseFloat(rate);
    const n = parseInt(tenure);
    if (isNaN(P) || isNaN(annualRate) || isNaN(n) || P <= 0 || annualRate <= 0 || n <= 0)
      return null;
    const r = annualRate / 12 / 100;
    const factor = Math.pow(1 + r, n);
    const emi = (P * r * factor) / (factor - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    const schedule: {
      month: number;
      emi: number;
      principal: number;
      interest: number;
      balance: number;
    }[] = [];
    let balance = P;
    for (let i = 1; i <= n && i <= 12; i++) {
      const interestPart = balance * r;
      const principalPart = emi - interestPart;
      balance = Math.max(0, balance - principalPart);
      schedule.push({ month: i, emi, principal: principalPart, interest: interestPart, balance });
    }

    return { emi, totalPayment, totalInterest, schedule, totalMonths: n };
  }, [principal, rate, tenure]);

  const fmt = (v: number) =>
    v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <ToolLayout id="emi-loan-calculator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Loan Amount ($)", value: principal, set: setPrincipal, placeholder: "100000" },
          { label: "Interest Rate (% p.a.)", value: rate, set: setRate, placeholder: "8.5" },
          { label: "Loan Tenure (months)", value: tenure, set: setTenure, placeholder: "60" },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label}>
            <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              {label}
            </span>
            <input
              type="number"
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
              style={{ borderColor: value ? color : undefined }}
            />
          </div>
        ))}
      </div>

      {result && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: "Monthly EMI", value: `$${fmt(result.emi)}` },
            { label: "Total Interest", value: `$${fmt(result.totalInterest)}` },
            { label: "Total Payment", value: `$${fmt(result.totalPayment)}` },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-md border-2 border-line bg-input-bg p-4 text-center"
            >
              <div className="font-mono text-xs uppercase tracking-wider text-muted">{label}</div>
              <div className="mt-1 font-display text-2xl font-extrabold" style={{ color }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      )}

      {result && result.totalMonths > 12 && (
        <div className="font-mono text-xs text-muted">
          Showing first 12 months of {result.totalMonths} total
        </div>
      )}

      {result && result.schedule.length > 0 && (
        <div>
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Amortization Schedule
          </span>
          <div className="overflow-x-auto rounded-md border-2 border-line">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b-2 border-line bg-input-bg">
                  <th className="px-3 py-2 text-left text-muted">Month</th>
                  <th className="px-3 py-2 text-right text-muted">EMI</th>
                  <th className="px-3 py-2 text-right text-muted">Principal</th>
                  <th className="px-3 py-2 text-right text-muted">Interest</th>
                  <th className="px-3 py-2 text-right text-muted">Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row) => (
                  <tr key={row.month} className="border-b border-line last:border-b-0">
                    <td className="px-3 py-2 text-input-text">{row.month}</td>
                    <td className="px-3 py-2 text-right text-input-text">{fmt(row.emi)}</td>
                    <td className="px-3 py-2 text-right text-input-text">{fmt(row.principal)}</td>
                    <td className="px-3 py-2 text-right text-input-text">{fmt(row.interest)}</td>
                    <td className="px-3 py-2 text-right text-input-text">{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-input-bg font-bold">
                  <td className="px-3 py-2 text-muted">Total</td>
                  <td className="px-3 py-2 text-right" style={{ color }}>
                    {fmt(result.totalPayment)}
                  </td>
                  <td className="px-3 py-2 text-right" style={{ color }}>
                    {fmt(principal ? parseFloat(principal) : 0)}
                  </td>
                  <td className="px-3 py-2 text-right" style={{ color }}>
                    {fmt(result.totalInterest)}
                  </td>
                  <td className="px-3 py-2 text-right text-muted">-</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {!result && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter loan details above to calculate EMI
        </div>
      )}
    </ToolLayout>
  );
}
