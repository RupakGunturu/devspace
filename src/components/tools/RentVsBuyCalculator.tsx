import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";

const FIELDS = [
  { key: "rent", label: "Monthly Rent ($)", placeholder: "2000", default: "2000" },
  { key: "homePrice", label: "Home Price ($)", placeholder: "400000", default: "400000" },
  { key: "downPayment", label: "Down Payment (%)", placeholder: "20", default: "20" },
  { key: "mortgageRate", label: "Mortgage Rate (%/yr)", placeholder: "6.5", default: "6.5" },
  { key: "rentIncrease", label: "Rent Increase (%/yr)", placeholder: "3", default: "3" },
  { key: "appreciation", label: "Home Appreciation (%/yr)", placeholder: "3", default: "3" },
  { key: "horizon", label: "Time Horizon (years)", placeholder: "10", default: "10" },
];

export function RentVsBuyCalculator() {
  const [inputs, setInputs] = useState<Record<string, string>>(
    Object.fromEntries(FIELDS.map((f) => [f.key, f.default]))
  );
  const { color } = useToolAccent();

  const set = (key: string, val: string) => setInputs((prev) => ({ ...prev, [key]: val }));

  const result = useMemo(() => {
    const rent = parseFloat(inputs.rent);
    const homePrice = parseFloat(inputs.homePrice);
    const downPct = parseFloat(inputs.downPayment) / 100;
    const mortgageRate = parseFloat(inputs.mortgageRate) / 100 / 12;
    const rentInc = parseFloat(inputs.rentIncrease) / 100;
    const appreciation = parseFloat(inputs.appreciation) / 100;
    const years = parseInt(inputs.horizon);

    if ([rent, homePrice, downPct, mortgageRate, rentInc, appreciation, years].some(isNaN)) return null;
    if (rent <= 0 || homePrice <= 0 || years <= 0) return null;

    const loanAmount = homePrice * (1 - downPct);
    const closingCosts = homePrice * 0.03;
    const downPayment = homePrice * downPct;
    const totalUpfront = downPayment + closingCosts;

    const months = years * 12;
    const monthlyPayment = mortgageRate > 0
      ? (loanAmount * mortgageRate * Math.pow(1 + mortgageRate, months)) / (Math.pow(1 + mortgageRate, months) - 1)
      : loanAmount / months;

    const yearData: {
      year: number;
      rentCost: number;
      buyCost: number;
      cumulativeRent: number;
      cumulativeBuy: number;
      homeEquity: number;
      netBuy: number;
      winner: "rent" | "buy";
    }[] = [];

    let cumulativeRent = 0;
    let cumulativeBuy = totalUpfront;
    let currentRent = rent;
    let remainingLoan = loanAmount;
    let homeValue = homePrice;
    let breakEvenYear = -1;

    for (let y = 1; y <= years; y++) {
      const annualRent = currentRent * 12;
      cumulativeRent += annualRent;

      let annualInterest = 0;
      let annualPrincipal = 0;
      let balance = remainingLoan;

      for (let m = 0; m < 12; m++) {
        const interest = balance * mortgageRate;
        const principal = monthlyPayment - interest;
        annualInterest += interest;
        annualPrincipal += principal;
        balance = Math.max(0, balance - principal);
      }

      remainingLoan = balance;
      homeValue *= (1 + appreciation);

      const annualBuy = annualPrincipal + annualInterest;
      cumulativeBuy += annualBuy;

      const equity = homeValue - remainingLoan;
      const netBuyCost = cumulativeBuy - equity;

      const winner = cumulativeRent < netBuyCost ? "rent" : "buy";

      if (breakEvenYear === -1 && netBuyCost < cumulativeRent) {
        breakEvenYear = y;
      }

      yearData.push({
        year: y,
        rentCost: annualRent,
        buyCost: annualBuy,
        cumulativeRent,
        cumulativeBuy,
        homeEquity: equity,
        netBuy: netBuyCost,
        winner,
      });

      currentRent *= (1 + rentInc);
    }

    const fmt = (v: number) => v.toLocaleString("en-US", { maximumFractionDigits: 0 });

    return {
      yearData,
      breakEvenYear,
      totalUpfront,
      monthlyMortgage: monthlyPayment,
      finalEquity: yearData[yearData.length - 1]?.homeEquity || 0,
      finalCumulativeRent: yearData[yearData.length - 1]?.cumulativeRent || 0,
      finalCumulativeBuy: yearData[yearData.length - 1]?.cumulativeBuy || 0,
      fmt,
    };
  }, [inputs]);

  return (
    <ToolLayout id="rent-vs-buy-calculator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Monthly Mortgage", value: `$${result.fmt(result.monthlyMortgage)}` },
              { label: "Total Upfront Cost", value: `$${result.fmt(result.totalUpfront)}` },
              { label: "Break-Even Year", value: result.breakEvenYear > 0 ? `Year ${result.breakEvenYear}` : "N/A" },
              { label: "Final Equity", value: `$${result.fmt(result.finalEquity)}` },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted">{label}</div>
                <div className="mt-1 font-display text-lg font-extrabold" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-md border-2 border-line bg-input-bg p-4">
              <div className="mb-1 font-mono text-xs font-medium uppercase tracking-wider text-muted">Total Rent Cost</div>
              <div className="font-display text-2xl font-extrabold" style={{ color: "#f59e0b" }}>
                ${result.fmt(result.finalCumulativeRent)}
              </div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-4">
              <div className="mb-1 font-mono text-xs font-medium uppercase tracking-wider text-muted">Total Buy Cost (net of equity)</div>
              <div className="font-display text-2xl font-extrabold" style={{ color: "#22c55e" }}>
                ${result.fmt(result.finalCumulativeBuy - result.finalEquity)}
              </div>
            </div>
          </div>

          {result.breakEvenYear > 0 && (
            <div className="rounded-md border-2 bg-input-bg p-4 text-center" style={{ borderColor: color }}>
              <div className="font-mono text-xs uppercase tracking-wider text-muted">Buying becomes cheaper than renting after year {result.breakEvenYear}</div>
            </div>
          )}

          <div>
            <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Year-by-Year Comparison
            </span>
            <div className="overflow-x-auto rounded-md border-2 border-line">
              <table className="w-full font-mono text-xs">
                <thead>
                  <tr className="border-b-2 border-line bg-input-bg">
                    <th className="px-3 py-2 text-left text-muted">Year</th>
                    <th className="px-3 py-2 text-right text-muted">Rent Cost</th>
                    <th className="px-3 py-2 text-right text-muted">Buy Cost</th>
                    <th className="px-3 py-2 text-right text-muted">Cumul. Rent</th>
                    <th className="px-3 py-2 text-right text-muted">Cumul. Buy (net)</th>
                    <th className="px-3 py-2 text-right text-muted">Home Equity</th>
                    <th className="px-3 py-2 text-center text-muted">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearData.map((row) => (
                    <tr key={row.year} className="border-b border-line last:border-b-0">
                      <td className="px-3 py-2 font-bold text-input-text">{row.year}</td>
                      <td className="px-3 py-2 text-right text-input-text">${result.fmt(row.rentCost)}</td>
                      <td className="px-3 py-2 text-right text-input-text">${result.fmt(row.buyCost)}</td>
                      <td className="px-3 py-2 text-right text-input-text">${result.fmt(row.cumulativeRent)}</td>
                      <td className="px-3 py-2 text-right text-input-text">${result.fmt(row.netBuy)}</td>
                      <td className="px-3 py-2 text-right" style={{ color }}>${result.fmt(row.homeEquity)}</td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                          style={{
                            backgroundColor: row.winner === "buy" ? "#22c55e20" : "#f59e0b20",
                            color: row.winner === "buy" ? "#22c55e" : "#f59e0b",
                          }}
                        >
                          {row.winner}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!result && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter your rent and home details to compare costs over time
        </div>
      )}
    </ToolLayout>
  );
}
