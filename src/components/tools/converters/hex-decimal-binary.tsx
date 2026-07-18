import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";
import { ToolToggleGroup } from "../ToolToggleGroup";

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
      <ToolToggleGroup
        options={[
          { value: "hex", label: "HEX" },
          { value: "dec", label: "DEC" },
          { value: "bin", label: "BIN" },
        ]}
        value={base}
        onChange={(v) => setBase(v as any)}
        className="mb-2"
      />
      <ToolInput value={input} onChange={setInput} placeholder={`Enter ${base.toUpperCase()} number...`} label="Input" rows={1} />
      <ToolButton onClick={convert}>Convert</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
