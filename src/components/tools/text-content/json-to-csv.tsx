import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function JsonToCsv() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const convert = () => {
    try {
      const arr = JSON.parse(input);
      if (!Array.isArray(arr) || arr.length === 0) { setOutput("Input must be a non-empty JSON array"); return; }
      const headers = Array.from(new Set(arr.flatMap((o) => Object.keys(o))));
      const csv = [headers.join(","), ...arr.map((obj) => headers.map((h) => JSON.stringify(obj[h] ?? "")).join(","))].join("\n");
      setOutput(csv);
    } catch { setOutput("Invalid JSON input"); }
  };

  return (
    <ToolLayout id="json-to-csv">
      <ToolInput value={input} onChange={setInput} placeholder='[{"name":"Alice","age":30},{"name":"Bob","age":25}]' label="JSON Array Input" rows={10} />
      <ToolButton onClick={convert}>Convert to CSV</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
