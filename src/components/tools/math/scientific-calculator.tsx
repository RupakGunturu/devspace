import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ScientificCalculator() {
  const [expression, setExpression] = useState("");
  const [output, setOutput] = useState("");

  const calculate = () => {
    try {
      const sanitized = expression
        .replace(/sin\(/g, "Math.sin(")
        .replace(/cos\(/g, "Math.cos(")
        .replace(/tan\(/g, "Math.tan(")
        .replace(/sqrt\(/g, "Math.sqrt(")
        .replace(/log\(/g, "Math.log10(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/pi/g, "Math.PI")
        .replace(/\^/g, "**");
      const result = new Function("return " + sanitized)();
      setOutput(String(result));
    } catch { setOutput("Invalid expression"); }
  };

  const buttons = ["sin(", "cos(", "tan(", "sqrt(", "log(", "pi", "^", "(", ")", "Math.abs("];

  return (
    <ToolLayout id="scientific-calculator">
      <div className="flex gap-1.5 flex-wrap">
        {buttons.map((b) => <button key={b} onClick={() => setExpression(expression + b)} className="px-2 py-1 text-xs font-mono bg-paper-dim border border-border rounded hover:bg-paper-dim/80 transition-colors">{b}</button>)}
      </div>
      <ToolInput value={expression} onChange={setExpression} placeholder="sin(pi/2) + sqrt(16)" label="Expression" rows={2} />
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
