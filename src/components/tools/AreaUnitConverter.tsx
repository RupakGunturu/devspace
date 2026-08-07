import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

interface Unit {
  name: string;
  abbr: string;
  toSqFt: number;
}

const UNITS: Unit[] = [
  { name: "Square Feet", abbr: "sq ft", toSqFt: 1 },
  { name: "Square Meters", abbr: "sq m", toSqFt: 10.7639 },
  { name: "Acres", abbr: "acres", toSqFt: 43560 },
  { name: "Hectares", abbr: "ha", toSqFt: 107639.1 },
  { name: "Square Yards", abbr: "sq yd", toSqFt: 9 },
  { name: "Square Inches", abbr: "sq in", toSqFt: 1 / 144 },
];

const REFERENCES = [
  { label: "Parking Space", sqft: 180 },
  { label: "Studio Apartment", sqft: 400 },
  { label: "1-Bedroom Apt", sqft: 700 },
  { label: "Tennis Court", sqft: 2808 },
  { label: "Basketball Court", sqft: 4700 },
  { label: "Football Field", sqft: 57600 },
];

export function AreaUnitConverter() {
  const [value, setValue] = useState("1000");
  const [fromUnit, setFromUnit] = useState("sq ft");
  const [toUnit, setToUnit] = useState("sq m");
  const { color } = useToolAccent();

  const result = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return null;

    const from = UNITS.find((u) => u.abbr === fromUnit);
    const to = UNITS.find((u) => u.abbr === toUnit);
    if (!from || !to) return null;

    const inSqFt = num * from.toSqFt;
    const converted = inSqFt / to.toSqFt;

    return { converted, fromSqFt: inSqFt };
  }, [value, fromUnit, toUnit]);

  const fmt = (v: number) => {
    if (v >= 1000000) return v.toLocaleString("en-US", { maximumFractionDigits: 0 });
    if (v >= 100) return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
    if (v >= 1) return v.toLocaleString("en-US", { maximumFractionDigits: 4 });
    return v.toLocaleString("en-US", { maximumFractionDigits: 6 });
  };

  const fullText = useMemo(() => {
    if (!result) return "";
    const refs = REFERENCES.map((r) => {
      const refConv = result.fromSqFt / (UNITS.find((u) => u.abbr === toUnit)?.toSqFt || 1);
      const refRatio = refConv / ((r.sqft / (UNITS.find((u) => u.abbr === fromUnit)?.toSqFt || 1)));
      return `  ${r.label} (${fmt(r.sqft)} sq ft): ${fmt(refRatio)}x`;
    }).join("\n");

    return [
      `${fmt(parseFloat(value) || 0)} ${fromUnit} = ${fmt(result.converted)} ${toUnit}`,
      `\nConversion Table:`,
      ...UNITS.map((u) => {
        const val = result.fromSqFt / u.toSqFt;
        return `  ${u.name} (${u.abbr}): ${fmt(val)}`;
      }),
      `\nReal-World References:`,
      refs,
    ].join("\n");
  }, [value, fromUnit, toUnit, result]);

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <ToolLayout id="area-unit-converter">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Value</span>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="1000"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-lg text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: value ? color : undefined }}
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="mt-2 w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          >
            {UNITS.map((u) => <option key={u.abbr} value={u.abbr}>{u.name} ({u.abbr})</option>)}
          </select>
        </div>

        <button
          onClick={swap}
          className="mb-2 hidden self-center rounded-md border-2 border-line bg-input-bg p-2 transition-colors hover:bg-paper-dim/50 sm:block"
        >
          <svg className="h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>

        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Result</span>
          <div
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-lg font-bold"
            style={{ color: result !== null ? color : undefined }}
          >
            {result !== null ? `${fmt(result.converted)} ${toUnit}` : "Enter a value"}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="mt-2 w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          >
            {UNITS.map((u) => <option key={u.abbr} value={u.abbr}>{u.name} ({u.abbr})</option>)}
          </select>
        </div>
      </div>

      <button
        onClick={swap}
        className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-line bg-input-bg p-2 font-mono text-sm text-muted transition-colors hover:bg-paper-dim/50 sm:hidden"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
        Swap Units
      </button>

      {result && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">All Conversions</span>
            <CopyButton text={fullText} />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {UNITS.map((u) => {
              const val = result.fromSqFt / u.toSqFt;
              const isTarget = u.abbr === toUnit;
              return (
                <div
                  key={u.abbr}
                  className="rounded-md border-2 p-3 text-center"
                  style={{
                    borderColor: isTarget ? color : "var(--border)",
                    backgroundColor: isTarget ? `${color}10` : undefined,
                  }}
                >
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted">{u.name}</div>
                  <div className="mt-1 font-mono text-sm font-bold" style={{ color: isTarget ? color : undefined }}>
                    {fmt(val)} {u.abbr}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {result && (
        <div>
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Real-World References
          </span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {REFERENCES.map((r) => {
              const refInFromUnit = r.sqft / (UNITS.find((u) => u.abbr === fromUnit)?.toSqFt || 1);
              const times = (parseFloat(value) || 0) / refInFromUnit;
              return (
                <div key={r.label} className="rounded-md border-2 border-line bg-input-bg p-3">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted">{r.label}</div>
                  <div className="mt-1 font-mono text-xs text-input-text">{fmt(r.sqft)} sq ft</div>
                  <div className="mt-0.5 font-mono text-xs font-bold" style={{ color }}>
                    {times >= 1 ? `${fmt(times)}x` : `${fmt(times * 100)}%`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!result && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter a value and select units to convert
        </div>
      )}
    </ToolLayout>
  );
}
