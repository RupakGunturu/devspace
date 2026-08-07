import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

interface SalaryBand {
  min: number;
  p25: number;
  median: number;
  p75: number;
  max: number;
}

const REGIONS: Record<string, { label: string; multiplier: number; currency: string }> = {
  US: { label: "United States", multiplier: 1, currency: "$" },
  UK: { label: "United Kingdom", multiplier: 0.72, currency: "\u00a3" },
  EU: { label: "Europe (Avg)", multiplier: 0.75, currency: "\u20ac" },
  India: { label: "India", multiplier: 0.25, currency: "\u20b9" },
  Remote: { label: "Remote (Global Avg)", multiplier: 0.80, currency: "$" },
};

const ROLE_BANDS: Record<string, { baseMin: number; baseMedian: number; baseMax: number }> = {
  "Junior Software Engineer": { baseMin: 65000, baseMedian: 80000, baseMax: 100000 },
  "Software Engineer": { baseMin: 90000, baseMedian: 120000, baseMax: 155000 },
  "Senior Software Engineer": { baseMin: 130000, baseMedian: 165000, baseMax: 210000 },
  "Staff Engineer": { baseMin: 170000, baseMedian: 210000, baseMax: 270000 },
  "Principal Engineer": { baseMin: 200000, baseMedian: 250000, baseMax: 350000 },
  "Engineering Manager": { baseMin: 150000, baseMedian: 190000, baseMax: 250000 },
  "Product Manager": { baseMin: 110000, baseMedian: 145000, baseMax: 195000 },
  "Senior Product Manager": { baseMin: 140000, baseMedian: 180000, baseMax: 240000 },
  "Designer": { baseMin: 80000, baseMedian: 105000, baseMax: 140000 },
  "Senior Designer": { baseMin: 120000, baseMedian: 155000, baseMax: 200000 },
  "Data Scientist": { baseMin: 100000, baseMedian: 135000, baseMax: 180000 },
  "DevOps Engineer": { baseMin: 95000, baseMedian: 130000, baseMax: 175000 },
  "QA Engineer": { baseMin: 70000, baseMedian: 95000, baseMax: 130000 },
  "UX Researcher": { baseMin: 85000, baseMedian: 115000, baseMax: 155000 },
  "Technical Writer": { baseMin: 65000, baseMedian: 85000, baseMax: 115000 },
};

const EXPERIENCE_MULTIPLIERS: Record<string, number> = {
  "Entry (0-2 years)": 0.75,
  "Mid (3-5 years)": 1.0,
  "Senior (6-10 years)": 1.25,
  "Lead (10+ years)": 1.50,
};

const COL_INDEX: Record<string, Record<string, number>> = {
  US: { "New York": 1.30, "San Francisco": 1.40, "Seattle": 1.25, "Austin": 1.05, "Chicago": 1.00, "Remote": 0.90 },
  UK: { "London": 1.25, "Manchester": 0.95, "Edinburgh": 0.90, "Remote": 0.85 },
  EU: { "Amsterdam": 1.10, "Berlin": 0.95, "Paris": 1.15, "Barcelona": 0.90, "Remote": 0.85 },
  India: { "Bangalore": 1.15, "Mumbai": 1.10, "Hyderabad": 0.95, "Pune": 0.90, "Remote": 0.85 },
  Remote: { "Tier 1 (US/UK/EU)": 1.00, "Tier 2 (LATAM/Eastern EU)": 0.70, "Tier 3 (Asia/Africa)": 0.50 },
};

export function SalaryBandCalculator() {
  const [role, setRole] = useState("");
  const [region, setRegion] = useState("US");
  const [experience, setExperience] = useState("Mid (3-5 years)");
  const [city, setCity] = useState("");
  const { color } = useToolAccent();

  const result = useMemo(() => {
    const roleData = ROLE_BANDS[role];
    if (!roleData) return null;

    const regionData = REGIONS[region];
    const expMultiplier = EXPERIENCE_MULTIPLIERS[experience] || 1;
    const regionMultiplier = regionData.multiplier;

    const colMultiplier = city ? COL_INDEX[region]?.[city] || 1 : 1;

    const applyMultipliers = (base: number) => {
      return Math.round(base * expMultiplier * regionMultiplier * colMultiplier);
    };

    const min = applyMultipliers(roleData.baseMin);
    const median = applyMultipliers(roleData.baseMedian);
    const max = applyMultipliers(roleData.baseMax);

    const range = max - min;
    const p25 = Math.round(min + range * 0.25);
    const p75 = Math.round(min + range * 0.75);

    const band: SalaryBand = { min, p25, median, p75, max };

    const totalRange = max - min;
    const percentiles = [
      { label: "10th Percentile", value: Math.round(min + totalRange * 0.10), pct: "10%" },
      { label: "25th Percentile", value: p25, pct: "25%" },
      { label: "50th Percentile (Median)", value: median, pct: "50%", highlight: true },
      { label: "75th Percentile", value: p75, pct: "75%" },
      { label: "90th Percentile", value: Math.round(min + totalRange * 0.90), pct: "90%" },
    ];

    return { band, percentiles, currency: regionData.currency, colMultiplier, city };
  }, [role, region, experience, city]);

  const fmt = (v: number) =>
    v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const cities = city ? Object.keys(COL_INDEX[region] || {}) : [];

  return (
    <ToolLayout id="salary-band-calculator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Role Title
          </span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          >
            <option value="">Select role...</option>
            {Object.keys(ROLE_BANDS).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Region
          </span>
          <select
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setCity("");
            }}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          >
            {Object.entries(REGIONS).map(([key, r]) => (
              <option key={key} value={key}>{r.label}</option>
            ))}
          </select>
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Experience Level
          </span>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          >
            {Object.keys(EXPERIENCE_MULTIPLIERS).map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          City / Cost of Living Adjustment
        </span>
        <div className="flex flex-wrap gap-2">
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c === city ? "" : c)}
              className="rounded-md border-2 px-3 py-2 font-mono text-xs font-medium transition-all"
              style={
                city === c
                  ? { borderColor: color, backgroundColor: color, color: "#fff" }
                  : { borderColor: "var(--border)" }
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <>
          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Salary Band
            </div>
            <div className="relative h-12 w-full rounded-full bg-line">
              <div
                className="absolute top-0 h-full rounded-full opacity-30"
                style={{
                  left: `${((result.band.p25 - result.band.min) / (result.band.max - result.band.min)) * 100}%`,
                  right: `${100 - ((result.band.p75 - result.band.min) / (result.band.max - result.band.min)) * 100}%`,
                  backgroundColor: color,
                }}
              />
              <div
                className="absolute top-0 h-full rounded-full opacity-60"
                style={{
                  left: 0,
                  right: `${100 - ((result.band.median - result.band.min) / (result.band.max - result.band.min)) * 100}%`,
                  backgroundColor: color,
                }}
              />
              <div
                className="absolute top-0 h-full w-1 rounded-full"
                style={{
                  left: `${((result.band.median - result.band.min) / (result.band.max - result.band.min)) * 100}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            <div className="mt-2 flex justify-between">
              <span className="font-mono text-xs text-muted">
                Min: {result.currency}{fmt(result.band.min)}
              </span>
              <span className="font-mono text-xs font-bold" style={{ color }}>
                Median: {result.currency}{fmt(result.band.median)}
              </span>
              <span className="font-mono text-xs text-muted">
                Max: {result.currency}{fmt(result.band.max)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Minimum", value: `${result.currency}${fmt(result.band.min)}` },
              { label: "25th Percentile", value: `${result.currency}${fmt(result.band.p25)}` },
              { label: "Median", value: `${result.currency}${fmt(result.band.median)}`, highlight: true },
              { label: "75th Percentile", value: `${result.currency}${fmt(result.band.p75)}` },
            ].map(({ label, value, highlight }) => (
              <div key={label} className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
                <div className="font-mono text-xs text-muted">{label}</div>
                <div
                  className="mt-1 font-mono text-sm font-bold"
                  style={{ color: highlight ? color : undefined }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Percentile Breakdown
            </div>
            <div className="space-y-3">
              {result.percentiles.map((p) => (
                <div key={p.pct}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-mono text-xs text-muted">{p.label}</span>
                    <span
                      className="font-mono text-sm font-bold"
                      style={{ color: p.highlight ? color : undefined }}
                    >
                      {result.currency}{fmt(p.value)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${((p.value - result.band.min) / (result.band.max - result.band.min)) * 100}%`,
                        backgroundColor: p.highlight ? color : "#64748b",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {result.city && (
            <div className="rounded-md border-2 border-dashed border-line p-3 font-mono text-xs text-muted">
              Cost of living adjustment for {result.city}: {(result.colMultiplier * 100).toFixed(0)}% of regional baseline
            </div>
          )}
        </>
      )}

      {!result && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Select a role to view salary bands and percentile breakdown
        </div>
      )}
    </ToolLayout>
  );
}
