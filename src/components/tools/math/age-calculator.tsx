import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState("");

  const calculate = () => {
    const birth = new Date(birthDate);
    const now = new Date();
    if (isNaN(birth.getTime())) { setResult("Invalid date"); return; }
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    setResult(`Age: ${years} years, ${months} months, ${days} days\n\nTotal: ${totalDays.toLocaleString()} days\n${totalWeeks.toLocaleString()} weeks\n${totalHours.toLocaleString()} hours\n\nNext birthday: ${new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate()).toLocaleDateString()}`);
  };

  return (
    <ToolLayout id="age-calculator">
      <div>
        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Date of Birth</label>
        <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
      </div>
      <ToolButton onClick={calculate}>Calculate Age</ToolButton>
      <ToolOutput value={result} />
    </ToolLayout>
  );
}
