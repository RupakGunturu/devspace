import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function HexDecimalBinary() {
  const [input, setInput] = useState("");
  const [base, setBase] = useState<"hex" | "dec" | "bin">("dec");
  const [output, setOutput] = useState("");

  const convert = () => {
    let num: number;
    if (base === "hex") num = parseInt(input, 16);
    else if (base === "bin") num = parseInt(input, 2);
    else num = parseInt(input, 10);
    if (isNaN(num)) { setOutput("Invalid number"); return; }
    setOutput(`Decimal: ${num}\nHexadecimal: ${num.toString(16).toUpperCase()}\nBinary: ${num.toString(2)}\nOctal: ${num.toString(8)}`);
  };

  return (
    <ToolLayout id="hex-decimal-binary">
      <div className="flex gap-2 mb-2">
        {(["hex", "dec", "bin"] as const).map((b) => <button key={b} onClick={() => setBase(b)} className={`px-3 py-1.5 text-xs rounded-full border transition-all ${base === b ? "bg-yellow text-white border-yellow" : "border-border text-muted-foreground"}`}>{b.toUpperCase()}</button>)}
      </div>
      <ToolInput value={input} onChange={setInput} placeholder={`Enter ${base.toUpperCase()} number...`} label="Input" rows={1} />
      <ToolButton onClick={convert}>Convert</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
