import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CssUnitsConverter() {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("px");
  const [output, setOutput] = useState("");

  const conversions: Record<string, Record<string, number>> = {
    px: { rem: 0.0625, em: 0.0625, pt: 0.75, vw: 0.0625, vh: 0.0625 },
    rem: { px: 16, em: 1, pt: 12, vw: 16, vh: 16 },
    pt: { px: 1.333, rem: 0.0833, em: 0.0833, vw: 1.333, vh: 1.333 },
  };

  const convert = () => {
    const val = parseFloat(value);
    if (isNaN(val)) { setOutput("Enter valid number"); return; }
    const base = conversions[unit] || {};
    setOutput(Object.entries(base).map(([u, factor]) => `${u}: ${(val * factor).toFixed(4)}`).join("\n"));
  };

  return (
    <ToolLayout id="css-units-converter">
      <div className="flex gap-2 mb-2">
        {["px", "rem", "pt", "em", "vw"].map((u) => <button key={u} onClick={() => setUnit(u)} className={`px-3 py-1.5 text-xs rounded-full border ${unit === u ? "bg-yellow text-white border-yellow" : "border-border text-muted-foreground"}`}>{u}</button>)}
      </div>
      <ToolInput value={value} onChange={setValue} placeholder="16" label={`Value in ${unit}`} rows={1} />
      <ToolButton onClick={convert}>Convert</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
