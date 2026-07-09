import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function PercentageCalculator() {
  const [mode, setMode] = useState<"of" | "is" | "change">("of");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState("");

  const calculate = () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (isNaN(numA) || isNaN(numB)) { setResult("Enter valid numbers"); return; }
    switch (mode) {
      case "of": setResult(`${numA}% of ${numB} = ${(numA / 100 * numB).toFixed(4)}`); break;
      case "is": setResult(`${numA} is ${((numA / numB) * 100).toFixed(4)}% of ${numB}`); break;
      case "change": setResult(`Change from ${numA} to ${numB}: ${(((numB - numA) / numA) * 100).toFixed(4)}%`); break;
    }
  };

  return (
    <ToolLayout id="percentage-calculator">
      <div className="flex gap-2">
        {[
          { val: "of", label: "X% of Y" },
          { val: "is", label: "X is what % of Y" },
          { val: "change", label: "% change" },
        ].map((m) => (
          <button key={m.val} onClick={() => setMode(m.val as any)} className={`px-3 py-1.5 text-xs rounded-full border transition-all ${mode === m.val ? "bg-yellow text-white border-yellow" : "border-border text-muted-foreground"}`}>{m.label}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{mode === "of" ? "Percentage" : mode === "is" ? "Value" : "From"}</label>
          <input type="number" value={a} onChange={(e) => setA(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{mode === "change" ? "To" : "Value"}</label>
          <input type="number" value={b} onChange={(e) => setB(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
        </div>
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      {result && <ToolOutput value={result} label="Result" />}
    </ToolLayout>
  );
}
