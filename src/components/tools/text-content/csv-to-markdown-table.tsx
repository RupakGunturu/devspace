import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CsvToMarkdownTable() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const convert = () => {
    const lines = input.trim().split("\n").filter(Boolean);
    if (lines.length === 0) return;
    const rows = lines.map((l) => l.split(",").map((c) => c.trim()));
    const header = rows[0];
    const sep = header.map(() => "---");
    const body = rows.slice(1);
    setOutput([header, sep, ...body].map((r) => `| ${r.join(" | ")} |`).join("\n"));
  };

  return (
    <ToolLayout id="csv-to-markdown-table">
      <ToolInput value={input} onChange={setInput} placeholder="Name,Age&#10;Alice,30&#10;Bob,25" label="CSV Input" rows={8} />
      <ToolButton onClick={convert}>Convert</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
