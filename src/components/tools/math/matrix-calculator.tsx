import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";
import { ToolToggleGroup } from "../ToolToggleGroup";

export default function MatrixCalculator() {
  const [a, setA] = useState("1,2\n3,4");
  const [b, setB] = useState("5,6\n7,8");
  const [op, setOp] = useState<"add" | "multiply">("add");
  const [output, setOutput] = useState("");

  const parse = (s: string) => s.trim().split("\n").map((row) => row.split(",").map(Number));

  const calculate = () => {
    try {
      const m1 = parse(a);
      const m2 = parse(b);
      if (op === "add") {
        const result = m1.map((row, i) => row.map((val, j) => val + m2[i][j]));
        setOutput(result.map((r) => r.join(", ")).join("\n"));
      } else {
        const result = m1.map((row) => m2[0].map((_, j) => row.reduce((sum, val, k) => sum + val * m2[k][j], 0)));
        setOutput(result.map((r) => r.join(", ")).join("\n"));
      }
    } catch { setOutput("Invalid matrix format"); }
  };

  return (
    <ToolLayout id="matrix-calculator">
      <ToolToggleGroup
        options={[
          { value: "add", label: "A + B" },
          { value: "multiply", label: "A × B" },
        ]}
        value={op}
        onChange={(v) => setOp(v as any)}
        className="mb-2"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ToolInput value={a} onChange={setA} placeholder="1,2\n3,4" label="Matrix A" rows={3} />
        <ToolInput value={b} onChange={setB} placeholder="5,6\n7,8" label="Matrix B" rows={3} />
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
