import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function FibonacciGenerator() {
  const [count, setCount] = useState(20);
  const [result, setResult] = useState("");

  const generate = () => {
    const fib: number[] = [0, 1];
    for (let i = 2; i < count; i++) fib.push(fib[i - 1] + fib[i - 2]);
    setResult(fib.slice(0, count).join(", "));
  };

  return (
    <ToolLayout id="fibonacci-generator">
      <div className="flex items-center gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Count</label>
          <input type="number" value={count} onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))} className="w-24 p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
        </div>
        <ToolButton onClick={generate}>Generate</ToolButton>
      </div>
      <ToolOutput value={result} />
    </ToolLayout>
  );
}
