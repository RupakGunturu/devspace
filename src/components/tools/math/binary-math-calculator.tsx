import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";
import { ToolToggleGroup } from "../ToolToggleGroup";

export default function BinaryMathCalculator() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [op, setOp] = useState<"add" | "subtract">("add");
  const [output, setOutput] = useState("");

  const calculate = () => {
    const numA = parseInt(a, 2);
    const numB = parseInt(b, 2);
    if (isNaN(numA) || isNaN(numB)) { setOutput("Enter valid binary numbers"); return; }
    const result = op === "add" ? numA + numB : numA - numB;
    setOutput(`A:     ${a} (${numA})\nB:     ${b} (${numB})\nResult: ${result >= 0 ? result.toString(2) : "-" + Math.abs(result).toString(2)} (${result})`);
  };

  return (
    <ToolLayout id="binary-math-calculator">
      <ToolInput value={a} onChange={setA} placeholder="1010" label="Binary A" rows={1} />
      <ToolToggleGroup
        options={[
          { value: "add", label: "+" },
          { value: "subtract", label: "-" },
        ]}
        value={op}
        onChange={(v) => setOp(v as any)}
      />
      <ToolInput value={b} onChange={setB} placeholder="1100" label="Binary B" rows={1} />
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
