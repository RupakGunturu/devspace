import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function DiscountCalculator() {
  const [original, setOriginal] = useState("");
  const [discount, setDiscount] = useState("");
  const [result, setResult] = useState("");

  const calculate = () => {
    const o = parseFloat(original);
    const d = parseFloat(discount);
    if (isNaN(o) || isNaN(d)) { setResult("Enter valid numbers"); return; }
    const saved = o * (d / 100);
    const final_ = o - saved;
    setResult(`Original: $${o.toFixed(2)}\nDiscount: ${d}%\nYou Save: $${saved.toFixed(2)}\nFinal Price: $${final_.toFixed(2)}`);
  };

  return (
    <ToolLayout id="discount-calculator">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Original Price ($)</label>
          <input type="number" value={original} onChange={(e) => setOriginal(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Discount (%)</label>
          <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
        </div>
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      <ToolOutput value={result} />
    </ToolLayout>
  );
}
