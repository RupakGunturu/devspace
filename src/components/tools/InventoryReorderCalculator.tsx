import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

export function InventoryReorderCalculator() {
  const [dailyUsage, setDailyUsage] = useState("");
  const [leadTime, setLeadTime] = useState("");
  const [safetyStock, setSafetyStock] = useState("");
  const [holdingCost, setHoldingCost] = useState("");
  const [orderingCost, setOrderingCost] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const { color } = useToolAccent();

  const result = useMemo(() => {
    const usage = parseFloat(dailyUsage);
    const lead = parseFloat(leadTime);
    const safety = parseFloat(safetyStock) || 0;
    if (isNaN(usage) || usage <= 0 || isNaN(lead) || lead <= 0) return null;

    const reorderPoint = usage * lead + safety;
    const avgInventory = reorderPoint / 2 + safety;

    const hc = parseFloat(holdingCost) || 0;
    const oc = parseFloat(orderingCost) || 0;
    const uc = parseFloat(unitCost) || 1;
    const annualDemand = usage * 365;
    const annualHoldingCostPerUnit = uc * (hc / 100);

    const eoq =
      annualHoldingCostPerUnit > 0 && oc > 0
        ? Math.sqrt((2 * annualDemand * oc) / annualHoldingCostPerUnit)
        : 0;

    const stock = parseFloat(currentStock) || 0;
    const reorderPt = parseFloat(String(reorderPoint)) || 0;
    const safetyStk = parseFloat(String(safetyStock)) || 0;
    const daysUntilReorder = usage > 0 ? Math.max(0, (stock - reorderPt) / usage) : 0;
    const stockStatus =
      stock <= 0
        ? "out"
        : stock <= safetyStk
          ? "critical"
          : stock <= reorderPt
            ? "reorder"
            : "healthy";

    const chartBars = Array.from({ length: 14 }, (_, i) => {
      const projectedStock = stock - usage * i;
      return {
        day: i,
        stock: Math.max(0, projectedStock),
        isReorderDay: projectedStock <= reorderPt && projectedStock > 0,
        isBelowSafety: projectedStock <= safetyStk,
      };
    });

    return {
      reorderPoint,
      safety,
      eoq: Math.round(eoq),
      avgInventory,
      stockStatus,
      daysUntilReorder,
      chartBars,
      annualDemand,
      annualHoldingCostPerUnit,
    };
  }, [dailyUsage, leadTime, safetyStock, holdingCost, orderingCost, unitCost, currentStock]);

  const fmt = (v: number) =>
    v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    healthy: { bg: "#10b981", text: "#10b981", label: "Healthy Stock" },
    reorder: { bg: "#f59e0b", text: "#f59e0b", label: "Reorder Now" },
    critical: { bg: "#ef4444", text: "#ef4444", label: "Critical Low" },
    out: { bg: "#ef4444", text: "#ef4444", label: "Out of Stock" },
  };

  return (
    <ToolLayout id="inventory-reorder-calculator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Avg Daily Usage (units)
          </span>
          <input
            type="number"
            value={dailyUsage}
            onChange={(e) => setDailyUsage(e.target.value)}
            placeholder="50"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: dailyUsage ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Lead Time (days)
          </span>
          <input
            type="number"
            value={leadTime}
            onChange={(e) => setLeadTime(e.target.value)}
            placeholder="7"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: leadTime ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Safety Stock (units)
          </span>
          <input
            type="number"
            value={safetyStock}
            onChange={(e) => setSafetyStock(e.target.value)}
            placeholder="100"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Unit Cost ($)
          </span>
          <input
            type="number"
            value={unitCost}
            onChange={(e) => setUnitCost(e.target.value)}
            placeholder="10"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Holding Cost (% / year)
          </span>
          <input
            type="number"
            value={holdingCost}
            onChange={(e) => setHoldingCost(e.target.value)}
            placeholder="25"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Ordering Cost ($ / order)
          </span>
          <input
            type="number"
            value={orderingCost}
            onChange={(e) => setOrderingCost(e.target.value)}
            placeholder="100"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          />
        </div>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-xs text-muted">Reorder Point</div>
              <div className="mt-1 font-display text-2xl font-extrabold" style={{ color }}>
                {fmt(result.reorderPoint)}
              </div>
              <div className="font-mono text-xs text-muted">units</div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-xs text-muted">EOQ</div>
              <div className="mt-1 font-display text-2xl font-extrabold text-input-text">
                {fmt(result.eoq)}
              </div>
              <div className="font-mono text-xs text-muted">units</div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-xs text-muted">Days Until Reorder</div>
              <div className="mt-1 font-display text-2xl font-extrabold text-input-text">
                {Math.round(result.daysUntilReorder)}
              </div>
              <div className="font-mono text-xs text-muted">days</div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-xs text-muted">Status</div>
              <div
                className="mt-1 font-display text-lg font-extrabold"
                style={{ color: statusColors[result.stockStatus].text }}
              >
                {statusColors[result.stockStatus].label}
              </div>
            </div>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              14-Day Stock Projection
            </div>
            <div className="flex items-end gap-1" style={{ height: "120px" }}>
              {result.chartBars.map((bar) => {
                const maxStock = parseFloat(currentStock) || result.reorderPoint * 2;
                const heightPct = maxStock > 0 ? (bar.stock / maxStock) * 100 : 0;
                let barColor = color;
                if (bar.isBelowSafety) barColor = "#ef4444";
                else if (bar.isReorderDay) barColor = "#f59e0b";
                return (
                  <div key={bar.day} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-sm transition-all duration-300"
                      style={{
                        height: `${Math.max(heightPct, 2)}%`,
                        backgroundColor: barColor,
                      }}
                    />
                    <span className="font-mono text-[10px] text-muted">D{bar.day}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="font-mono text-xs text-muted">Above Reorder</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
                <span className="font-mono text-xs text-muted">At Reorder Point</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#ef4444" }} />
                <span className="font-mono text-xs text-muted">Below Safety Stock</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-xs text-muted">Annual Demand</div>
              <div className="mt-1 font-mono text-sm font-bold text-input-text">
                {fmt(result.annualDemand)} units
              </div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-xs text-muted">Orders / Year</div>
              <div className="mt-1 font-mono text-sm font-bold text-input-text">
                {result.annualDemand > 0 && result.eoq > 0
                  ? Math.round(result.annualDemand / result.eoq)
                  : 0}
              </div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-xs text-muted">Holding Cost / Unit / Year</div>
              <div className="mt-1 font-mono text-sm font-bold text-input-text">
                ${result.annualHoldingCostPerUnit.toFixed(2)}
              </div>
            </div>
          </div>
        </>
      )}

      {!result && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter daily usage and lead time to calculate reorder points
        </div>
      )}
    </ToolLayout>
  );
}
