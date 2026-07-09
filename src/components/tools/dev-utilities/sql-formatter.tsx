import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const format = () => {
    const keywords = ["SELECT", "FROM", "WHERE", "AND", "OR", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "ON", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "CREATE TABLE", "AS", "IN", "NOT", "NULL", "IS", "BETWEEN", "LIKE", "CASE", "WHEN", "THEN", "ELSE", "END"];
    let result = input.trim();
    for (const kw of keywords) { result = result.replace(new RegExp(`\\b${kw}\\b`, "gi"), `\n${kw}`); }
    result = result.replace(/,/g, ",\n  ").replace(/\n\s*\n/g, "\n").trim();
    setOutput(result);
  };

  return (
    <ToolLayout id="sql-formatter">
      <ToolInput value={input} onChange={setInput} placeholder="Paste SQL query..." label="SQL" rows={10} />
      <ToolButton onClick={format}>Format</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
