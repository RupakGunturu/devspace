import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [compound, setCompound] = useState("12");
  const [output, setOutput] = useState("");

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseInt(years);
    const n = parseInt(compound);
    if (isNaN(p) || isNaN(r) || isNaN(t)) { setOutput("Enter valid numbers"); return; }
    const amount = p * Math.pow(1 + r / n, n * t);
    const interest = amount - p;
    setOutput(`Principal: $${p.toFixed(2)}\nRate: ${(r * 100).toFixed(1)}%\nYears: ${t}\nCompounded: ${n === 1 ? "Yearly" : n === 4 ? "Quarterly" : n === 12 ? "Monthly" : n === 365 ? "Daily" : n + "x/year"}\n\nFinal Amount: $${amount.toFixed(2)}\nInterest Earned: $${interest.toFixed(2)}`);
  };

  return (
    <ToolLayout id="compound-interest-calculator">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ToolInput value={principal} onChange={setPrincipal} placeholder="10000" label="Principal ($)" rows={1} />
        <ToolInput value={rate} onChange={setRate} placeholder="5" label="Annual Rate (%)" rows={1} />
        <ToolInput value={years} onChange={setYears} placeholder="10" label="Years" rows={1} />
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Compound</label><select value={compound} onChange={(e) => setCompound(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm text-foreground"><option value="1">Yearly</option><option value="4">Quarterly</option><option value="12">Monthly</option><option value="365">Daily</option></select></div>
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
