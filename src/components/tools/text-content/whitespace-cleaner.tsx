import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function WhitespaceCleaner() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const trimSpaces = () => setOutput(input.split("\n").map((l) => l.trim()).join("\n"));
  const removeBlank = () => setOutput(input.split("\n").filter((l) => l.trim()).join("\n"));
  const normalize = () => setOutput(input.replace(/[^\S\n]+/g, " ").replace(/\n{3,}/g, "\n\n").trim());

  return (
    <ToolLayout id="whitespace-cleaner">
      <ToolInput value={input} onChange={setInput} placeholder="Paste messy text..." label="Input" rows={10} />
      <div className="flex gap-2 flex-wrap">
        <ToolButton onClick={trimSpaces}>Trim Lines</ToolButton>
        <ToolButton onClick={removeBlank} variant="secondary">Remove Blank Lines</ToolButton>
        <ToolButton onClick={normalize} variant="secondary">Normalize All</ToolButton>
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
