import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function JsonToTypescript() {
  const [input, setInput] = useState('{"name": "John", "age": 30, "active": true}');
  const [output, setOutput] = useState("");

  const convert = () => {
    try {
      const obj = JSON.parse(input);
      const generate = (o: any, indent = 0): string => {
        if (Array.isArray(o)) return o.length > 0 ? `${generate(o[0])}[]` : "any[]";
        if (o !== null && typeof o === "object") {
          const props = Object.entries(o).map(([k, v]) => `${"  ".repeat(indent + 1)}${k}: ${generate(v, indent + 1)};`);
          return `{\n${props.join("\n")}\n${"  ".repeat(indent)}}`;
        }
        return typeof o;
      };
      setOutput(`interface Root ${generate(obj)}`);
    } catch { setOutput("Invalid JSON"); }
  };

  return (
    <ToolLayout id="json-to-typescript">
      <ToolInput value={input} onChange={setInput} placeholder='{"name": "John"}' label="JSON" rows={8} />
      <ToolButton onClick={convert}>Generate TypeScript</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
