import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const format = (indent: number) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <ToolLayout id="json-formatter">
      <ToolInput value={input} onChange={setInput} placeholder='Paste JSON here... e.g. {"name":"John","age":30}' label="JSON Input" rows={10} />
      <div className="flex gap-2 flex-wrap">
        <ToolButton onClick={() => format(2)}>Format (2 spaces)</ToolButton>
        <ToolButton onClick={() => format(4)}>Format (4 spaces)</ToolButton>
        <ToolButton onClick={minify} variant="secondary">Minify</ToolButton>
      </div>
      {error && <p className="text-sm text-coral font-mono">Error: {error}</p>}
      <ToolOutput value={output} label="Formatted Output" />
    </ToolLayout>
  );
}
