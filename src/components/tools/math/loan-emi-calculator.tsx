import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function LoanEmiCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [output, setOutput] = useState("");

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseInt(years) * 12;
    if (isNaN(p) || isNaN(r) || isNaN(n)) { setOutput("Enter valid numbers"); return; }
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    const interest = total - p;
    setOutput(`Monthly EMI: $${emi.toFixed(2)}\nTotal Payment: $${total.toFixed(2)}\nTotal Interest: $${interest.toFixed(2)}`);
  };

  return (
    <ToolLayout id="loan-emi-calculator">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ToolInput value={principal} onChange={setPrincipal} placeholder="100000" label="Loan Amount ($)" rows={1} />
        <ToolInput value={rate} onChange={setRate} placeholder="8.5" label="Interest Rate (%)" rows={1} />
        <ToolInput value={years} onChange={setYears} placeholder="20" label="Years" rows={1} />
      </div>
      <ToolButton onClick={calculate}>Calculate EMI</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
