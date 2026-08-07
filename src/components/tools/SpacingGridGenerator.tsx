import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { CopyButton } from "./CopyButton";
import { useToolAccent } from "@/components/ToolAccentContext";

type ScaleType = "linear" | "material" | "tailwind";

function generateScale(base: number, type: ScaleType): { name: string; value: number }[] {
  if (type === "material") {
    return [
      { name: "0", value: 0 },
      { name: "1", value: 1 },
      { name: "2", value: 2 },
      { name: "3", value: 3 },
      { name: "4", value: 4 },
      { name: "6", value: 6 },
      { name: "8", value: 8 },
      { name: "12", value: 12 },
      { name: "16", value: 16 },
      { name: "24", value: 24 },
      { name: "32", value: 32 },
      { name: "48", value: 48 },
      { name: "64", value: 64 },
    ].map((s) => ({ name: `spacing-${s.name}`, value: s.value * base }));
  }
  if (type === "tailwind") {
    return [
      { name: "0", value: 0 },
      { name: "0.5", value: 0.5 },
      { name: "1", value: 1 },
      { name: "1.5", value: 1.5 },
      { name: "2", value: 2 },
      { name: "3", value: 3 },
      { name: "4", value: 4 },
      { name: "5", value: 5 },
      { name: "6", value: 6 },
      { name: "8", value: 8 },
      { name: "10", value: 10 },
      { name: "12", value: 12 },
      { name: "16", value: 16 },
      { name: "20", value: 20 },
      { name: "24", value: 24 },
    ].map((s) => ({ name: s.name, value: s.value * base }));
  }
  return Array.from({ length: 13 }, (_, i) => ({
    name: `${i}`,
    value: i * base,
  }));
}

export function SpacingGridGenerator() {
  const [base, setBase] = useState("4");
  const [scaleType, setScaleType] = useState<ScaleType>("linear");
  const { color } = useToolAccent();

  const scale = useMemo(
    () => generateScale(parseInt(base) || 4, scaleType),
    [base, scaleType]
  );

  const cssVars = scale.map((s) => `  --space-${s.name}: ${s.value}px;`).join("\n");
  const cssOutput = `:root {\n${cssVars}\n}`;

  const tailwindConfig = `module.exports = {\n  theme: {\n    spacing: {\n${scale.map((s) => `      '${s.name}': '${s.value}px',`).join("\n")}\n    }\n  }\n}`;

  const output = scaleType === "tailwind" ? tailwindConfig : cssOutput;

  return (
    <ToolLayout id="spacing-grid-generator">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Base Size (px)
          </label>
          <div className="flex gap-2">
            {["4", "6", "8"].map((b) => (
              <button
                key={b}
                onClick={() => setBase(b)}
                className="flex-1 rounded-md border-2 px-3 py-2.5 font-mono text-sm font-medium transition-all"
                style={{
                  borderColor: base === b ? color : undefined,
                  backgroundColor: base === b ? color : undefined,
                  color: base === b ? "#fff" : undefined,
                }}
              >
                {b}px
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Scale Type
          </label>
          <div className="flex gap-2">
            {(["linear", "material", "tailwind"] as ScaleType[]).map((t) => (
              <button
                key={t}
                onClick={() => setScaleType(t)}
                className="flex-1 rounded-md border-2 px-3 py-2.5 font-mono text-xs font-medium capitalize transition-all"
                style={{
                  borderColor: scaleType === t ? color : undefined,
                  backgroundColor: scaleType === t ? color : undefined,
                  color: scaleType === t ? "#fff" : undefined,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {scale.map((s) => (
          <div key={s.name} className="flex items-center gap-3">
            <span className="w-12 text-right font-mono text-xs text-muted">{s.name}</span>
            <div
              className="h-4 rounded transition-all"
              style={{
                width: `${Math.min((s.value / (Number(base || 4) * 12)) * 100, 100)}%`,
                backgroundColor: color,
                minWidth: s.value > 0 ? 2 : 0,
              }}
            />
            <span className="font-mono text-xs text-foreground">{s.value}px</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
            {scaleType === "tailwind" ? "Tailwind Config" : "CSS Variables"}
          </span>
          <CopyButton text={output} />
        </div>
        <pre className="max-h-[300px] overflow-auto rounded-md border-2 border-line bg-input-bg p-4 font-mono text-xs text-foreground">
          {output}
        </pre>
      </div>
    </ToolLayout>
  );
}
