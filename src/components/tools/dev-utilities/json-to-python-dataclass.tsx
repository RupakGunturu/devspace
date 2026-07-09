import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function JsonToPythonDataclass() {
  const [input, setInput] = useState('{"name": "John", "age": 30, "active": true}');
  const [output, setOutput] = useState("");

  const convert = () => {
    try {
      const obj = JSON.parse(input);
      const imports = new Set<string>();
      const fields = Object.entries(obj).map(([k, v]) => {
        let type = "Any";
        if (typeof v === "string") { type = "str"; }
        else if (typeof v === "number") { type = Number.isInteger(v) ? "int" : "float"; }
        else if (typeof v === "boolean") { type = "bool"; }
        else if (Array.isArray(v)) { type = "list"; imports.add("from typing import List"); }
        else if (typeof v === "object") { type = "dict"; imports.add("from typing import Dict"); }
        return `    ${k}: ${type}`;
      });
      setOutput(`from dataclasses import dataclass\n${Array.from(imports).join("\n")}\nfrom typing import Any\n\n@dataclass\nclass Model:\n${fields.join("\n")}`);
    } catch { setOutput("Invalid JSON"); }
  };

  return (
    <ToolLayout id="json-to-python-dataclass">
      <ToolInput value={input} onChange={setInput} placeholder='{"name": "John", "age": 30}' label="JSON" rows={8} />
      <ToolButton onClick={convert}>Generate Dataclass</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
