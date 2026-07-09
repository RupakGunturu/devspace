import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ApiEndpointNamer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    const lower = input.toLowerCase();
    const resource = lower.match(/(user|post|comment|product|order|category|tag|message)/)?.[0] || "resource";
    const plural = resource + "s";
    if (lower.includes("get") || lower.includes("list") || lower.includes("fetch")) setOutput(`GET /api/${plural}\nGET /api/${plural}/:id`);
    else if (lower.includes("create") || lower.includes("add")) setOutput(`POST /api/${plural}`);
    else if (lower.includes("update") || lower.includes("edit")) setOutput(`PUT /api/${plural}/:id`);
    else if (lower.includes("delete") || lower.includes("remove")) setOutput(`DELETE /api/${plural}/:id`);
    else setOutput("Try: 'get users', 'create post', 'update comment', 'delete product'");
  };

  return (
    <ToolLayout id="api-endpoint-namer">
      <ToolInput value={input} onChange={setInput} placeholder="get all users" label="Describe endpoint" rows={2} />
      <ToolButton onClick={generate}>Generate Endpoint</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
