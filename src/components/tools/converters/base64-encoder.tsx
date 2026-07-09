import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function Base64Encoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const encode = () => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
      setError("");
    } catch (e: any) { setError(e.message); }
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(escape(atob(input))));
      setError("");
    } catch (e: any) { setError("Invalid Base64 string"); }
  };

  return (
    <ToolLayout id="base64-encoder">
      <ToolInput value={input} onChange={setInput} placeholder="Enter text to encode/decode..." label="Input" rows={6} />
      <div className="flex gap-2">
        <ToolButton onClick={encode}>Encode</ToolButton>
        <ToolButton onClick={decode} variant="secondary">Decode</ToolButton>
      </div>
      {error && <p className="text-sm text-coral font-mono">{error}</p>}
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
