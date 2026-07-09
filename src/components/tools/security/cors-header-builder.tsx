import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CorsHeaderBuilder() {
  const [origin, setOrigin] = useState("*");
  const [methods, setMethods] = useState("GET, POST, PUT, DELETE");
  const [headers, setHeaders] = useState("Content-Type, Authorization");
  const [credentials, setCredentials] = useState(false);
  const [output, setOutput] = useState("");

  const build = () => {
    const lines = [
      `Access-Control-Allow-Origin: ${origin}`,
      `Access-Control-Allow-Methods: ${methods}`,
      `Access-Control-Allow-Headers: ${headers}`,
    ];
    if (credentials) lines.push("Access-Control-Allow-Credentials: true");
    setOutput(lines.join("\n"));
  };

  return (
    <ToolLayout id="cors-header-builder">
      <ToolInput value={origin} onChange={setOrigin} placeholder="*" label="Allow Origin" rows={1} />
      <ToolInput value={methods} onChange={setMethods} placeholder="GET, POST" label="Allow Methods" rows={1} />
      <ToolInput value={headers} onChange={setHeaders} placeholder="Content-Type" label="Allow Headers" rows={1} />
      <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
        <input type="checkbox" checked={credentials} onChange={(e) => setCredentials(e.target.checked)} className="accent-yellow" /> Allow Credentials
      </label>
      <ToolButton onClick={build}>Generate Headers</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
