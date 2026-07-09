import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function DateDifferenceCalculator() {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [output, setOutput] = useState("");

  const calculate = () => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) { setOutput("Enter valid dates"); return; }
    const diff = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.floor(diff / 86400000);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44);
    const years = Math.floor(days / 365.25);
    setOutput(`Days: ${days}\nWeeks: ${weeks}\nMonths: ~${months}\nYears: ~${years}`);
  };

  return (
    <ToolLayout id="date-difference-calculator">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Start Date</label><input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" /></div>
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">End Date</label><input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" /></div>
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
