import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function WeekNumberCalculator() {
  const [date, setDate] = useState("");
  const [output, setOutput] = useState("");

  const calculate = () => {
    const d = new Date(date);
    if (isNaN(d.getTime())) { setOutput("Enter a valid date"); return; }
    const start = new Date(d.getFullYear(), 0, 1);
    const diff = d.getTime() - start.getTime();
    const week = Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
    setOutput(`Date: ${d.toLocaleDateString()}\nWeek: ${week}\nYear: ${d.getFullYear()}\nDay of year: ${Math.ceil((d.getTime() - start.getTime()) / 86400000) + 1}`);
  };

  return (
    <ToolLayout id="week-number-calculator">
      <div>
        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
