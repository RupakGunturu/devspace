import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function BinaryText() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const toBinary = () => setOutput(input.split("").map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" "));
  const toText = () => setOutput(input.split(" ").map((b) => String.fromCharCode(parseInt(b, 2))).join(""));

  return (
    <ToolLayout id="binary-text">
      <ToolInput value={input} onChange={setInput} placeholder="Enter text or binary (space-separated 8-bit)..." label="Input" rows={4} />
      <div className="flex flex-col sm:flex-row gap-2">
        <ToolButton onClick={toBinary}>Text → Binary</ToolButton>
        <ToolButton onClick={toText} variant="secondary">Binary → Text</ToolButton>
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
