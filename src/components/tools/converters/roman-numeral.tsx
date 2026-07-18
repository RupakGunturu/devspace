import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function RomanNumeral() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const toRoman = (num: number): string => {
    const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
    let result = "";
    for (let i = 0; i < vals.length; i++) { while (num >= vals[i]) { result += syms[i]; num -= vals[i]; } }
    return result;
  };

  const fromRoman = (str: string): number => {
    const map: Record<string, number> = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
    let result = 0;
    for (let i = 0; i < str.length; i++) { const curr = map[str[i]] || 0; const next = map[str[i + 1]] || 0; result += curr < next ? -curr : curr; }
    return result;
  };

  const toRomanBtn = () => { const n = parseInt(input); setOutput(isNaN(n) ? "Invalid" : toRoman(n)); };
  const fromRomanBtn = () => setOutput(String(fromRoman(input.toUpperCase())));

  return (
    <ToolLayout id="roman-numeral">
      <ToolInput value={input} onChange={setInput} placeholder="Enter number or Roman numeral..." label="Input" rows={1} />
      <div className="flex flex-col sm:flex-row gap-2">
        <ToolButton onClick={toRomanBtn}>Number → Roman</ToolButton>
        <ToolButton onClick={fromRomanBtn} variant="secondary">Roman → Number</ToolButton>
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
