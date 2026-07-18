import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function MeetingCostCalculator() {
  const [rate, setRate] = useState("");
  const [people, setPeople] = useState("");
  const [minutes, setMinutes] = useState("");
  const [output, setOutput] = useState("");

  const calculate = () => {
    const r = parseFloat(rate);
    const p = parseInt(people);
    const m = parseInt(minutes);
    if (isNaN(r) || isNaN(p) || isNaN(m)) { setOutput("Enter valid numbers"); return; }
    const hourlyRate = r;
    const cost = (hourlyRate / 60) * m * p;
    const perPerson = cost / p;
    setOutput(`Hourly rate: $${hourlyRate}\nPeople: ${p}\nDuration: ${m} min\n\nTotal meeting cost: $${cost.toFixed(2)}\nCost per person: $${perPerson.toFixed(2)}\nCost per minute: $${(cost / m).toFixed(2)}`);
  };

  return (
    <ToolLayout id="meeting-cost-calculator">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ToolInput value={rate} onChange={setRate} placeholder="50" label="Hourly Rate ($)" rows={1} />
        <ToolInput value={people} onChange={setPeople} placeholder="5" label="People" rows={1} />
        <ToolInput value={minutes} onChange={setMinutes} placeholder="30" label="Minutes" rows={1} />
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
