import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function GraphQLToRest() {
  const [input, setInput] = useState("query { users { id name email } }");
  const [output, setOutput] = useState("");

  const convert = () => {
    const lower = input.toLowerCase();
    const resource = lower.match(/(\w+)\s*\{/)?.[1] || "resource";
    const plural = resource + "s";
    if (lower.includes("query")) setOutput(`GET /api/${plural}\n\nResponse: 200 OK, array of ${resource} objects`);
    else if (lower.includes("mutation")) setOutput(`POST /api/${plural}\n\nResponse: 201 Created, created ${resource} object`);
    else setOutput("Try: 'query { users { id name } }' or 'mutation { createUser { id } }'");
  };

  return (
    <ToolLayout id="graphql-to-rest">
      <ToolInput value={input} onChange={setInput} placeholder="query { users { id name email } }" label="GraphQL Query" rows={4} />
      <ToolButton onClick={convert}>Convert to REST</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
