import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function DuplicateLineRemover() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const process = () => {
    const lines = input.split("\n");
    const unique = Array.from(new Set(lines));
    setOutput(unique.join("\n"));
  };

  return (
    <ToolLayout id="duplicate-line-remover">
      <ToolInput value={input} onChange={setInput} placeholder="Paste text with duplicate lines..." label="Input" rows={10} />
      <ToolButton onClick={process}>Remove Duplicates</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
