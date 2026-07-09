import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function JsonToZod() {
  const [input, setInput] = useState('{"name": "John", "age": 30, "active": true}');
  const [output, setOutput] = useState("");

  const convert = () => {
    try {
      const obj = JSON.parse(input);
      const generate = (o: any): string => {
        if (Array.isArray(o)) return o.length > 0 ? `z.array(${generate(o[0])})` : "z.array(z.any())";
        if (o !== null && typeof o === "object") {
          const props = Object.entries(o).map(([k, v]) => `  ${k}: ${generate(v)}`);
          return `z.object({\n${props.join(",\n")}\n})`;
        }
        if (typeof o === "string") return "z.string()";
        if (typeof o === "number") return "z.number()";
        if (typeof o === "boolean") return "z.boolean()";
        return "z.any()";
      };
      setOutput(`import { z } from "zod";\n\nexport const schema = ${generate(obj)};`);
    } catch { setOutput("Invalid JSON"); }
  };

  return (
    <ToolLayout id="json-to-zod">
      <ToolInput value={input} onChange={setInput} placeholder='{"name": "John", "age": 30}' label="JSON" rows={8} />
      <ToolButton onClick={convert}>Generate Zod Schema</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
