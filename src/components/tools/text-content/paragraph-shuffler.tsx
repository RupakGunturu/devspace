import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ParagraphShuffler() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const shuffle = () => {
    const lines = input.split("\n").filter(Boolean);
    for (let i = lines.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [lines[i], lines[j]] = [lines[j], lines[i]]; }
    setOutput(lines.join("\n\n"));
  };

  return (
    <ToolLayout id="paragraph-shuffler">
      <ToolInput value={input} onChange={setInput} placeholder="Enter paragraphs (one per line or double newline separated)..." label="Input" rows={10} />
      <ToolButton onClick={shuffle}>Shuffle</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
