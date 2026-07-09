import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function MarkdownTableGenerator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    const lines = input.trim().split("\n").filter(Boolean);
    if (lines.length === 0) return;
    const rows = lines.map((l) => l.split(",").map((c) => c.trim()));
    const maxCols = Math.max(...rows.map((r) => r.length));
    const padded = rows.map((r) => { while (r.length < maxCols) r.push(""); return r; });
    const header = padded[0];
    const sep = header.map(() => "---");
    const body = padded.slice(1);
    const table = [header, sep, ...body].map((r) => `| ${r.join(" | ")} |`).join("\n");
    setOutput(table);
  };

  return (
    <ToolLayout id="markdown-table-generator">
      <ToolInput value={input} onChange={setInput} placeholder="Enter CSV data (one row per line)...&#10;Name, Age, City&#10;Alice, 30, NYC&#10;Bob, 25, LA" label="CSV Input" rows={8} />
      <ToolButton onClick={generate}>Generate Table</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
