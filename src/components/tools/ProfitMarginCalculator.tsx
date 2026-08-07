import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

const VOLUME_QTYS = [5, 10, 25, 50, 100] as const;

export function ProfitMarginCalculator() {
  const [costPrice, setCostPrice] = useState("");
  const [inputMode, setInputMode] = useState<"margin" | "selling">("margin");
  const [desiredMargin, setDesiredMargin] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [holdingCostPct, setHoldingCostPct] = useState("20");
  const [orderingCost, setOrderingCost] = useState("50");
  const [annualDemand, setAnnualDemand] = useState("1000");
  const { color } = useToolAccent();

  const result = useMemo(() => {
    const cost = parseFloat(costPrice);
    if (isNaN(cost) || cost <= 0) return null;

    let sp: number;
    let marginPct: number;

    if (inputMode === "margin") {
      const m = parseFloat(desiredMargin);
      if (isNaN(m) || m < 0 || m >= 100) return null;
      sp = cost / (1 - m / 100);
      marginPct = m;
    } else {
      sp = parseFloat(sellingPrice);
      if (isNaN(sp) || sp <= 0) return null;
      marginPct = ((sp - cost) / sp) * 100;
    }

    const profit = sp - cost;
    const markupPct = (profit / cost) * 100;
    const breakEvenUnits = profit > 0 ? Math.ceil(1 / (profit / cost)) : Infinity;

    const volumeDiscounts = VOLUME_QTYS.map((qty) => {
      const discountRate =
        qty >= 100 ? 0.15 : qty >= 50 ? 0.1 : qty >= 25 ? 0.07 : qty >= 10 ? 0.05 : 0.02;
      const discountedCost = cost * (1 - discountRate);
      const discountedProfit = sp - discountedCost;
      const discountedMargin = sp > 0 ? (discountedProfit / sp) * 100 : 0;
      return {
        qty,
        discountRate,
        discountedCost,
        discountedProfit,
        discountedMargin,
        totalProfit: discountedProfit * qty,
      };
    });

    const holding = parseFloat(holdingCostPct) || 20;
    const ordering = parseFloat(orderingCost) || 50;
    const demand = parseFloat(annualDemand) || 1000;
    const holdingCostPerUnit = cost * (holding / 100);
    const eoq =
      holdingCostPerUnit > 0 ? Math.sqrt((2 * demand * ordering) / holdingCostPerUnit) : 0;
    const totalOrderingCost = demand > 0 && eoq > 0 ? (demand / eoq) * ordering : 0;
    const totalHoldingCost = eoq > 0 ? (eoq / 2) * holdingCostPerUnit : 0;

    return {
      sp,
      profit,
      marginPct,
      markupPct,
      cost,
      breakEvenUnits,
      volumeDiscounts,
      eoq,
      totalOrderingCost,
      totalHoldingCost,
      holdingCostPerUnit,
    };
  }, [
    costPrice,
    inputMode,
    desiredMargin,
    sellingPrice,
    holdingCostPct,
    orderingCost,
    annualDemand,
  ]);

  const fmt = (v: number) =>
    v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <ToolLayout id="profit-margin-calculator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Cost Price ($)
          </span>
          <input
            type="number"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            placeholder="25.00"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: costPrice ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Input Mode
          </span>
          <div className="flex gap-2">
            {(["margin", "selling"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setInputMode(mode)}
                className="flex-1 rounded-md border-2 px-3 py-2.5 font-mono text-xs font-medium transition-all"
                style={
                  inputMode === mode
                    ? { borderColor: color, backgroundColor: color, color: "#fff" }
                    : { borderColor: "var(--border)" }
                }
              >
                {mode === "margin" ? "Desired Margin %" : "Selling Price"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {inputMode === "margin" ? (
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Desired Margin (%)
          </span>
          <input
            type="number"
            value={desiredMargin}
            onChange={(e) => setDesiredMargin(e.target.value)}
            placeholder="40"
            min="0"
            max="99"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: desiredMargin ? color : undefined }}
          />
        </div>
      ) : (
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Selling Price ($)
          </span>
          <input
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            placeholder="42.00"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: sellingPrice ? color : undefined }}
          />
        </div>
      )}

      {result && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Selling Price", value: `$${fmt(result.sp)}` },
              { label: "Profit", value: `$${fmt(result.profit)}`, accent: true },
              { label: "Margin", value: `${result.marginPct.toFixed(1)}%` },
              { label: "Markup", value: `${result.markupPct.toFixed(1)}%` },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-md border-2 border-line bg-input-bg p-3 text-center"
              >
                <div className="font-mono text-xs text-muted">{item.label}</div>
                <div
                  className="mt-1 font-display text-lg font-extrabold"
                  style={{ color: item.accent ? color : undefined }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Volume Discount Pricing
            </div>
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs">
                <thead>
                  <tr className="border-b-2 border-line">
                    <th className="px-2 py-1.5 text-left text-muted">Qty</th>
                    <th className="px-2 py-1.5 text-right text-muted">Discount</th>
                    <th className="px-2 py-1.5 text-right text-muted">Unit Cost</th>
                    <th className="px-2 py-1.5 text-right text-muted">Unit Profit</th>
                    <th className="px-2 py-1.5 text-right text-muted">Margin</th>
                    <th className="px-2 py-1.5 text-right text-muted">Total Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {result.volumeDiscounts.map((v) => (
                    <tr key={v.qty} className="border-b border-line last:border-b-0">
                      <td className="px-2 py-1.5 font-bold text-input-text">{v.qty} units</td>
                      <td className="px-2 py-1.5 text-right text-muted">
                        {(v.discountRate * 100).toFixed(0)}%
                      </td>
                      <td className="px-2 py-1.5 text-right text-input-text">
                        ${fmt(v.discountedCost)}
                      </td>
                      <td
                        className="px-2 py-1.5 text-right"
                        style={{ color: v.discountedProfit > 0 ? "#10b981" : "#ef4444" }}
                      >
                        ${fmt(v.discountedProfit)}
                      </td>
                      <td className="px-2 py-1.5 text-right text-input-text">
                        {v.discountedMargin.toFixed(1)}%
                      </td>
                      <td className="px-2 py-1.5 text-right font-bold" style={{ color }}>
                        ${fmt(v.totalProfit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Economic Order Quantity (EOQ)
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <span className="mb-1 block font-mono text-xs text-muted">
                  Holding Cost (% / year)
                </span>
                <input
                  type="number"
                  value={holdingCostPct}
                  onChange={(e) => setHoldingCostPct(e.target.value)}
                  className="w-full rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none"
                />
              </div>
              <div>
                <span className="mb-1 block font-mono text-xs text-muted">
                  Ordering Cost ($ / order)
                </span>
                <input
                  type="number"
                  value={orderingCost}
                  onChange={(e) => setOrderingCost(e.target.value)}
                  className="w-full rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none"
                />
              </div>
              <div>
                <span className="mb-1 block font-mono text-xs text-muted">
                  Annual Demand (units)
                </span>
                <input
                  type="number"
                  value={annualDemand}
                  onChange={(e) => setAnnualDemand(e.target.value)}
                  className="w-full rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none"
                />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-md border border-line p-2 text-center">
                <div className="font-mono text-xs text-muted">EOQ</div>
                <div className="mt-1 font-mono text-sm font-bold" style={{ color }}>
                  {Math.round(result.eoq)} units
                </div>
              </div>
              <div className="rounded-md border border-line p-2 text-center">
                <div className="font-mono text-xs text-muted">Orders/Year</div>
                <div className="mt-1 font-mono text-sm font-bold text-input-text">
                  {result.eoq > 0
                    ? result.holdingCostPerUnit > 0
                      ? Math.round(1000 / result.eoq)
                      : 0
                    : 0}
                </div>
              </div>
              <div className="rounded-md border border-line p-2 text-center">
                <div className="font-mono text-xs text-muted">Total Ordering</div>
                <div className="mt-1 font-mono text-sm font-bold text-input-text">
                  ${fmt(result.totalOrderingCost)}
                </div>
              </div>
              <div className="rounded-md border border-line p-2 text-center">
                <div className="font-mono text-xs text-muted">Total Holding</div>
                <div className="mt-1 font-mono text-sm font-bold text-input-text">
                  ${fmt(result.totalHoldingCost)}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!result && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter cost price and margin/selling price to see calculations
        </div>
      )}
    </ToolLayout>
  );
}
