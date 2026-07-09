import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ApiResponseMocker() {
  const [schema, setSchema] = useState('{\n  "users": [{\n    "id": "number",\n    "name": "string",\n    "email": "string"\n  }]\n}');
  const [output, setOutput] = useState("");

  const names = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
  const domains = ["example.com", "test.io", "demo.co"];

  const generate = () => {
    try {
      const template = JSON.parse(schema);
      const mock = (obj: any): any => {
        if (Array.isArray(obj)) return obj.map((item) => mock(item));
        if (typeof obj === "object" && obj !== null) {
          const result: any = {};
          for (const [key, val] of Object.entries(obj)) {
            if (typeof val === "string") {
              if (val === "string") result[key] = names[Math.floor(Math.random() * names.length)] + "@" + domains[Math.floor(Math.random() * domains.length)];
              else if (val === "number") result[key] = Math.floor(Math.random() * 100);
              else if (val === "boolean") result[key] = Math.random() > 0.5;
              else result[key] = val;
            } else result[key] = mock(val);
          }
          return result;
        }
        return obj;
      };
      setOutput(JSON.stringify(mock(template), null, 2));
    } catch { setOutput("Invalid JSON schema"); }
  };

  return (
    <ToolLayout id="api-response-mocker">
      <ToolInput value={schema} onChange={setSchema} placeholder='{"users": [{"id": "number", "name": "string"}]}' label="JSON Schema" rows={8} />
      <ToolButton onClick={generate}>Generate Mock</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
