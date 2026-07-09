import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function BmiCalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [result, setResult] = useState("");

  const calculate = () => {
    let bmi: number;
    if (unit === "metric") {
      const w = parseFloat(weight);
      const h = parseFloat(height) / 100;
      if (isNaN(w) || isNaN(h) || h <= 0) { setResult("Enter valid numbers"); return; }
      bmi = w / (h * h);
    } else {
      const w = parseFloat(weight) * 0.453592;
      const h = parseFloat(height) * 0.0254;
      if (isNaN(w) || isNaN(h) || h <= 0) { setResult("Enter valid numbers"); return; }
      bmi = w / (h * h);
    }
    const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obese";
    const color = bmi < 18.5 ? "🔵" : bmi < 25 ? "🟢" : bmi < 30 ? "🟡" : "🔴";
    setResult(`BMI: ${bmi.toFixed(1)}\nCategory: ${color} ${category}\n\nHealthy range: 18.5 - 24.9`);
  };

  return (
    <ToolLayout id="bmi-calculator">
      <div className="flex gap-2 mb-2">
        {(["metric", "imperial"] as const).map((u) => <button key={u} onClick={() => setUnit(u)} className={`px-3 py-1.5 text-xs rounded-full border transition-all ${unit === u ? "bg-yellow text-white border-yellow" : "border-border text-muted-foreground"}`}>{u}</button>)}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Weight ({unit === "metric" ? "kg" : "lbs"})</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Height ({unit === "metric" ? "cm" : "inches"})</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
        </div>
      </div>
      <ToolButton onClick={calculate}>Calculate BMI</ToolButton>
      <ToolOutput value={result} />
    </ToolLayout>
  );
}
