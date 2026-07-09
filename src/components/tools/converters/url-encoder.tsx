import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = () => setOutput(encodeURIComponent(input));
  const decode = () => { try { setOutput(decodeURIComponent(input)); } catch { setOutput("Invalid URL encoding"); } };

  return (
    <ToolLayout id="url-encoder">
      <ToolInput value={input} onChange={setInput} placeholder="Enter URL or text..." label="Input" rows={4} />
      <div className="flex gap-2">
        <ToolButton onClick={encode}>Encode</ToolButton>
        <ToolButton onClick={decode} variant="secondary">Decode</ToolButton>
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
