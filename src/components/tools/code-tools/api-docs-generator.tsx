import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ApiDocsGenerator() {
  const [endpoint, setEndpoint] = useState("/api/users");
  const [method, setMethod] = useState("GET");
  const [desc, setDesc] = useState("Get all users");
  const [output, setOutput] = useState("");

  const generate = () => {
    setOutput(`## ${method} ${endpoint}\n\n**Description:** ${desc}\n\n### Parameters\n| Name | Type | Required | Description |\n|------|------|----------|-------------|\n| limit | number | No | Max results (default 10) |\n| offset | number | No | Skip N results |\n\n### Response\n\`\`\`json\n{\n  "status": 200,\n  "data": [],\n  "total": 0\n}\n\`\`\`\n\n### Errors\n| Code | Description |\n|------|-------------|\n| 400 | Bad request |\n| 401 | Unauthorized |`);
  };

  return (
    <ToolLayout id="api-docs-generator">
      <ToolInput value={endpoint} onChange={setEndpoint} placeholder="/api/users" label="Endpoint" rows={1} />
      <div className="flex gap-2">
        {(["GET", "POST", "PUT", "DELETE"]).map((m) => <button key={m} onClick={() => setMethod(m)} className={`px-3 py-1.5 text-xs rounded-full border transition-all ${method === m ? "bg-yellow text-white border-yellow" : "border-border text-muted-foreground"}`}>{m}</button>)}
      </div>
      <ToolInput value={desc} onChange={setDesc} placeholder="Get all users" label="Description" rows={1} />
      <ToolButton onClick={generate}>Generate Docs</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
