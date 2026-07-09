import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function I18nJsonGenerator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    const lines = input.split("\n").filter(Boolean);
    const obj: Record<string, string> = {};
    lines.forEach((line, i) => {
      const key = line.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
      obj[key || `key_${i}`] = line;
    });
    setOutput(JSON.stringify(obj, null, 2));
  };

  return (
    <ToolLayout id="i18n-json-generator">
      <ToolInput value={input} onChange={setInput} placeholder="Welcome&#10;Login&#10;Sign Up&#10;Settings" label="UI Text (one per line)" rows={8} />
      <ToolButton onClick={generate}>Generate JSON</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
