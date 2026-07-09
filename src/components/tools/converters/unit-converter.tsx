import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function UnitConverter() {
  const [input, setInput] = useState("");
  const [category, setCategory] = useState<"length" | "weight" | "volume">("length");
  const [output, setOutput] = useState("");

  const units: Record<string, Record<string, number>> = {
    length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 },
    weight: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, t: 1000 },
    volume: { l: 1, ml: 0.001, gal: 3.78541, qt: 0.946353, pt: 0.473176, cup: 0.236588, fl_oz: 0.0295735 },
  };

  const convert = () => {
    const val = parseFloat(input);
    if (isNaN(val)) { setOutput("Enter a valid number"); return; }
    const u = units[category];
    const baseVal = val; // Assume input is in base unit (m, kg, l)
    const lines = Object.entries(u).map(([name, factor]) => `${name}: ${(baseVal / factor).toFixed(6)}`);
    setOutput(lines.join("\n"));
  };

  return (
    <ToolLayout id="unit-converter">
      <div className="flex gap-2 mb-2">
        {(["length", "weight", "volume"] as const).map((c) => <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 text-xs rounded-full border transition-all ${category === c ? "bg-yellow text-white border-yellow" : "border-border text-muted-foreground"}`}>{c}</button>)}
      </div>
      <ToolInput value={input} onChange={setInput} placeholder={`Enter value in base ${category === "length" ? "meters" : category === "weight" ? "kilograms" : "liters"}...`} label="Value" rows={1} />
      <ToolButton onClick={convert}>Convert</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
