import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function SqlQueryGenerator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    const lower = input.toLowerCase();
    if (lower.includes("select") || lower.includes("get") || lower.includes("find") || lower.includes("list")) {
      const table = lower.match(/(?:from|in|table)\s+(\w+)/)?.[1] || "users";
      const field = lower.match(/(?:get|select|find)\s+(\w+)/)?.[1] || "*";
      setOutput(`SELECT ${field === "all" || lower.includes("all") ? "*" : field} FROM ${table}${lower.includes("where") ? " WHERE condition" : ""}${lower.includes("sort") || lower.includes("order") ? " ORDER BY created_at DESC" : ""}${lower.includes("limit") ? " LIMIT 10" : ""};`);
    } else if (lower.includes("insert") || lower.includes("add") || lower.includes("create")) {
      const table = lower.match(/(?:into|table)\s+(\w+)/)?.[1] || "users";
      setOutput(`INSERT INTO ${table} (name, email, created_at)\nVALUES ('John', 'john@example.com', NOW());`);
    } else if (lower.includes("update") || lower.includes("modify")) {
      const table = lower.match(/(?:table)\s+(\w+)/)?.[1] || "users";
      setOutput(`UPDATE ${table}\nSET column = 'new_value'\nWHERE id = 1;`);
    } else if (lower.includes("delete") || lower.includes("remove")) {
      const table = lower.match(/(?:from|table)\s+(\w+)/)?.[1] || "users";
      setOutput(`DELETE FROM ${table}\nWHERE id = 1;`);
    } else setOutput("Try: 'get all users', 'add a new user', 'update user where id is 1', 'delete user'");
  };

  return (
    <ToolLayout id="sql-query-generator">
      <ToolInput value={input} onChange={setInput} placeholder="get all users where active is true" label="Describe in English" rows={2} />
      <ToolButton onClick={generate}>Generate SQL</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
