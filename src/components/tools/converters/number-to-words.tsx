import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function NumberToWords() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

  const convert = (n: number): string => {
    if (n === 0) return "zero";
    if (n < 0) return "negative " + convert(-n);
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? "-" + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " hundred" + (n % 100 ? " and " + convert(n % 100) : "");
    if (n < 1000000) return convert(Math.floor(n / 1000)) + " thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
    if (n < 1000000000) return convert(Math.floor(n / 1000000)) + " million" + (n % 1000000 ? " " + convert(n % 1000000) : "");
    return convert(Math.floor(n / 1000000000)) + " billion" + (n % 1000000000 ? " " + convert(n % 1000000000) : "");
  };

  const process = () => {
    const num = parseFloat(input);
    if (isNaN(num)) { setOutput("Enter a valid number"); return; }
    setOutput(convert(Math.abs(Math.floor(num))) + (num < 0 ? " (negative)" : ""));
  };

  return (
    <ToolLayout id="number-to-words">
      <ToolInput value={input} onChange={setInput} placeholder="Enter a number..." label="Number" rows={1} />
      <ToolButton onClick={process}>Convert</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
