import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function SqlToMongodb() {
  const [input, setInput] = useState("SELECT * FROM users WHERE age > 18");
  const [output, setOutput] = useState("");

  const convert = () => {
    const lower = input.toLowerCase();
    const table = lower.match(/from\s+(\w+)/)?.[1] || "collection";
    const where = lower.match(/where\s+(.+)/)?.[1];
    let query = `db.${table}.find(`;
    if (where) {
      const field = where.match(/(\w+)\s*[><=]/)?.[1] || "field";
      const op = where.includes(">") ? "$gt" : where.includes("<") ? "$lt" : where.includes("=") ? "$eq" : "$exists";
      const val = where.match(/['"]?(\w+)['"]?$/)?.[1] || "value";
      query += `{ ${field}: { ${op}: ${isNaN(Number(val)) ? `"${val}"` : Number(val)} } })`;
    } else query += "{})";
    setOutput(query);
  };

  return (
    <ToolLayout id="sql-to-mongodb">
      <ToolInput value={input} onChange={setInput} placeholder="SELECT * FROM users WHERE age > 18" label="SQL Query" rows={3} />
      <ToolButton onClick={convert}>Convert to MongoDB</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
