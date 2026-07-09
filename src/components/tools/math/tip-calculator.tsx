import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function TipCalculator() {
  const [bill, setBill] = useState("");
  const [tipPercent, setTipPercent] = useState("15");
  const [people, setPeople] = useState("1");
  const [result, setResult] = useState("");

  const calculate = () => {
    const b = parseFloat(bill);
    const t = parseFloat(tipPercent);
    const p = parseInt(people);
    if (isNaN(b) || isNaN(t) || isNaN(p) || p < 1) { setResult("Enter valid numbers"); return; }
    const tip = b * (t / 100);
    const total = b + tip;
    const perPerson = total / p;
    setResult(`Tip: $${tip.toFixed(2)} (${tipPercent}%)\nTotal: $${total.toFixed(2)}\nPer Person: $${perPerson.toFixed(2)}`);
  };

  return (
    <ToolLayout id="tip-calculator">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Bill Amount ($)</label>
          <input type="number" value={bill} onChange={(e) => setBill(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" placeholder="0.00" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Tip (%)</label>
          <input type="number" value={tipPercent} onChange={(e) => setTipPercent(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">People</label>
          <input type="number" value={people} onChange={(e) => setPeople(e.target.value)} min="1" className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
        </div>
      </div>
      <div className="flex gap-2">
        {[10, 15, 18, 20, 25].map((t) => <ToolButton key={t} onClick={() => setTipPercent(String(t))} variant="secondary">{t}%</ToolButton>)}
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      <ToolOutput value={result} />
    </ToolLayout>
  );
}
