import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";
import { ToolToggleGroup } from "../ToolToggleGroup";

export default function GstTaxCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("18");
  const [mode, setMode] = useState<"inclusive" | "exclusive">("exclusive");
  const [output, setOutput] = useState("");

  const calculate = () => {
    const a = parseFloat(amount);
    const r = parseFloat(rate) / 100;
    if (isNaN(a) || isNaN(r)) { setOutput("Enter valid numbers"); return; }
    if (mode === "exclusive") {
      const tax = a * r;
      setOutput(`Base: $${a.toFixed(2)}\nGST (${(r * 100).toFixed(0)}%): $${tax.toFixed(2)}\nTotal: $${(a + tax).toFixed(2)}`);
    } else {
      const base = a / (1 + r);
      const tax = a - base;
      setOutput(`Total (incl. GST): $${a.toFixed(2)}\nBase: $${base.toFixed(2)}\nGST (${(r * 100).toFixed(0)}%): $${tax.toFixed(2)}`);
    }
  };

  return (
    <ToolLayout id="gst-tax-calculator">
      <ToolToggleGroup
        options={[
          { value: "exclusive", label: "Add Tax" },
          { value: "inclusive", label: "Extract Tax" },
        ]}
        value={mode}
        onChange={(v) => setMode(v as any)}
        className="mb-2"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ToolInput value={amount} onChange={setAmount} placeholder="100" label="Amount ($)" rows={1} />
        <ToolInput value={rate} onChange={setRate} placeholder="18" label="GST Rate (%)" rows={1} />
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
