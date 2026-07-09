import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CsvToJson() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const convert = () => {
    const lines = input.trim().split("\n");
    if (lines.length < 2) { setOutput("Need at least a header and one data row"); return; }
    const headers = lines[0].split(",").map((h) => h.trim());
    const result = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = values[i] || ""; });
      return obj;
    });
    setOutput(JSON.stringify(result, null, 2));
  };

  return (
    <ToolLayout id="csv-to-json">
      <ToolInput value={input} onChange={setInput} placeholder="Name,Age,City&#10;Alice,30,NYC&#10;Bob,25,LA" label="CSV Input" rows={10} />
      <ToolButton onClick={convert}>Convert to JSON</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
