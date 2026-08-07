import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

const COUNTRIES = [
  { code: "US", name: "United States", zone: 1 },
  { code: "CA", name: "Canada", zone: 1 },
  { code: "GB", name: "United Kingdom", zone: 2 },
  { code: "DE", name: "Germany", zone: 2 },
  { code: "FR", name: "France", zone: 2 },
  { code: "AU", name: "Australia", zone: 3 },
  { code: "JP", name: "Japan", zone: 3 },
  { code: "IN", name: "India", zone: 3 },
  { code: "BR", name: "Brazil", zone: 4 },
  { code: "AE", name: "UAE", zone: 4 },
] as const;

const CARRIERS = [
  {
    id: "economy",
    name: "Economy",
    baseRate: 5.99,
    perKg: 2.5,
    perDimKg: 1.8,
    daysMin: 10,
    daysMax: 21,
  },
  {
    id: "standard",
    name: "Standard",
    baseRate: 9.99,
    perKg: 4.5,
    perDimKg: 3.2,
    daysMin: 5,
    daysMax: 10,
  },
  {
    id: "express",
    name: "Express",
    baseRate: 19.99,
    perKg: 8.0,
    perDimKg: 6.0,
    daysMin: 2,
    daysMax: 5,
  },
] as const;

export function ShippingCostEstimator() {
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [origin, setOrigin] = useState("US");
  const [destination, setDestination] = useState("GB");
  const { color } = useToolAccent();

  const result = useMemo(() => {
    const w = parseFloat(weight);
    const l = parseFloat(length) || 0;
    const wd = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    if (isNaN(w) || w <= 0) return null;

    const dimWeight = l > 0 && wd > 0 && h > 0 ? (l * wd * h) / 5000 : 0;
    const billableWeight = Math.max(w, dimWeight);

    const originZone = COUNTRIES.find((c) => c.code === origin)?.zone || 1;
    const destZone = COUNTRIES.find((c) => c.code === destination)?.zone || 1;
    const zoneMultiplier = 1 + Math.abs(destZone - originZone) * 0.25;

    const estimates = CARRIERS.map((carrier) => {
      const cost = (carrier.baseRate + billableWeight * carrier.perKg) * zoneMultiplier;
      return {
        ...carrier,
        estimatedCost: Math.round(cost * 100) / 100,
        daysRange: `${carrier.daysMin}\u2013${carrier.daysMax}`,
      };
    });

    return { billableWeight, dimWeight, actualWeight: w, estimates, zoneMultiplier };
  }, [weight, length, width, height, origin, destination]);

  const fmt = (v: number) =>
    v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <ToolLayout id="shipping-cost-estimator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Weight (kg)
          </span>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="2.5"
            step="0.1"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: weight ? color : undefined }}
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              L (cm)
            </span>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder="30"
              className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            />
          </div>
          <div>
            <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              W (cm)
            </span>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="20"
              className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            />
          </div>
          <div>
            <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              H (cm)
            </span>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="15"
              className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Origin Country
          </span>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Destination Country
          </span>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-xs text-muted">Actual Weight</div>
              <div className="mt-1 font-mono text-sm font-bold text-input-text">
                {fmt(result.actualWeight)} kg
              </div>
            </div>
            {result.dimWeight > 0 && (
              <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
                <div className="font-mono text-xs text-muted">Dim Weight</div>
                <div className="mt-1 font-mono text-sm font-bold text-input-text">
                  {fmt(result.dimWeight)} kg
                </div>
              </div>
            )}
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-xs text-muted">Billable Weight</div>
              <div className="mt-1 font-mono text-sm font-bold" style={{ color }}>
                {fmt(result.billableWeight)} kg
              </div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-xs text-muted">Zone Multiplier</div>
              <div className="mt-1 font-mono text-sm font-bold text-input-text">
                {result.zoneMultiplier.toFixed(2)}x
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Carrier Rates
            </span>
            {result.estimates.map((est) => (
              <div
                key={est.id}
                className="flex items-center gap-4 rounded-md border-2 border-line bg-input-bg px-4 py-3"
              >
                <div className="w-20 shrink-0">
                  <div className="font-mono text-sm font-bold text-input-text">{est.name}</div>
                  <div className="font-mono text-xs text-muted">{est.daysRange} days</div>
                </div>
                <div className="flex-1">
                  <div className="mb-1 h-2 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((est.estimatedCost / result.estimates[2].estimatedCost) * 100, 100)}%`,
                        backgroundColor:
                          est.id === "economy"
                            ? "#10b981"
                            : est.id === "standard"
                              ? color
                              : "#f59e0b",
                      }}
                    />
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div
                    className="font-mono text-lg font-bold"
                    style={{ color: est.id === "economy" ? "#10b981" : undefined }}
                  >
                    ${fmt(est.estimatedCost)}
                  </div>
                  <div className="font-mono text-xs text-muted">
                    ${fmt(est.estimatedCost / result.billableWeight)}/kg
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!result && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter package weight and dimensions to estimate shipping costs
        </div>
      )}
    </ToolLayout>
  );
}
