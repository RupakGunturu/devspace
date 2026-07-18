import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function HtmlEntityEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = () => setOutput(input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"));
  const decode = () => { const t = document.createElement("textarea"); t.innerHTML = input; setOutput(t.value); };

  return (
    <ToolLayout id="html-entity-encoder">
      <ToolInput value={input} onChange={setInput} placeholder="Enter text..." label="Input" rows={4} />
      <div className="flex flex-col sm:flex-row gap-2">
        <ToolButton onClick={encode}>Encode</ToolButton>
        <ToolButton onClick={decode} variant="secondary">Decode</ToolButton>
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
