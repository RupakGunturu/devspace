import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function WorkingDaysCalculator() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [output, setOutput] = useState("");

  const calculate = () => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) { setOutput("Enter valid dates"); return; }
    let weekdays = 0;
    const current = new Date(s);
    while (current <= e) { if (current.getDay() !== 0 && current.getDay() !== 6) weekdays++; current.setDate(current.getDate() + 1); }
    const totalDays = Math.ceil((e.getTime() - s.getTime()) / 86400000) + 1;
    setOutput(`Total days: ${totalDays}\nWeekdays: ${weekdays}\nWeekend days: ${totalDays - weekdays}`);
  };

  return (
    <ToolLayout id="working-days-calculator">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Start Date</label><input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" /></div>
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">End Date</label><input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" /></div>
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
