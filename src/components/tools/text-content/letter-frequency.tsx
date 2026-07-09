import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function LetterFrequency() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const analyze = () => {
    const freq: Record<string, number> = {};
    for (const c of input.toLowerCase()) { freq[c] = (freq[c] || 0) + 1; }
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const total = input.length;
    setOutput(sorted.map(([char, count]) => `"${char}" → ${count} (${((count / total) * 100).toFixed(1)}%)`).join("\n"));
  };

  return (
    <ToolLayout id="letter-frequency">
      <ToolInput value={input} onChange={setInput} placeholder="Enter text to analyze..." label="Input" rows={6} />
      <ToolButton onClick={analyze}>Analyze</ToolButton>
      <ToolOutput value={output} label="Character Frequency" />
    </ToolLayout>
  );
}
