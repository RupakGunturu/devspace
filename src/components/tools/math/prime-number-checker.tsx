import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function PrimeChecker() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const check = () => {
    const n = parseInt(input);
    if (isNaN(n) || n < 2) { setResult("Enter a number >= 2"); return; }
    const isPrime = (num: number) => { for (let i = 2; i <= Math.sqrt(num); i++) if (num % i === 0) return false; return true; };
    const factors: number[] = [];
    let temp = n;
    for (let i = 2; i <= temp; i++) { while (temp % i === 0) { factors.push(i); temp /= i; } }
    setResult(`${n} is ${isPrime(n) ? "PRIME ✓" : "NOT PRIME ✗"}\n\nFactors: ${factors.join(" × ")}`);
  };

  return (
    <ToolLayout id="prime-number-checker">
      <ToolInput value={input} onChange={setInput} placeholder="Enter a number..." label="Number" rows={1} />
      <ToolButton onClick={check}>Check</ToolButton>
      <ToolOutput value={result} />
    </ToolLayout>
  );
}
