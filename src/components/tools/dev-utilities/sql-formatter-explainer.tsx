import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function SqlFormatterExplainer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const format = () => {
    const keywords = ["SELECT", "FROM", "WHERE", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "ON", "AND", "OR", "ORDER BY", "GROUP BY", "HAVING", "LIMIT", "OFFSET", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "CREATE TABLE", "ALTER TABLE", "DROP TABLE", "UNION", "UNION ALL", "AS", "DISTINCT", "COUNT", "SUM", "AVG", "MAX", "MIN", "IN", "NOT IN", "EXISTS", "BETWEEN", "LIKE", "IS NULL", "IS NOT NULL", "CASE", "WHEN", "THEN", "ELSE", "END"];
    let result = input;
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi");
      result = result.replace(regex, `\n${kw}`);
    });
    result = result.replace(/^\n/, "").replace(/,\s*/g, ",\n  ");
    const lines = result.split("\n").map((l) => l.trim()).filter(Boolean);
    setOutput(lines.join("\n"));
  };

  return (
    <ToolLayout id="sql-formatter-explainer">
      <ToolInput value={input} onChange={setInput} placeholder="Paste SQL query here..." label="SQL Input" rows={10} />
      <ToolButton onClick={format}>Format & Explain</ToolButton>
      <ToolOutput value={output} label="Formatted SQL" />
    </ToolLayout>
  );
}
