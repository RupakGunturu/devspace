import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function EnvVarGenerator() {
  const [appName, setAppName] = useState("my-app");
  const [dbHost, setDbHost] = useState("localhost");
  const [dbPort, setDbPort] = useState("5432");
  const [apiKey, setApiKey] = useState("");
  const [extra, setExtra] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    const lines = [
      `# ${appName} Environment Variables`,
      `# Generated at ${new Date().toISOString()}`,
      ``,
      `# App`,
      `APP_NAME=${appName}`,
      `NODE_ENV=development`,
      `PORT=3000`,
      ``,
      `# Database`,
      `DATABASE_URL=postgresql://user:password@${dbHost}:${dbPort}/${appName}`,
      `DB_HOST=${dbHost}`,
      `DB_PORT=${dbPort}`,
      `DB_NAME=${appName}`,
      ``,
      `# API Keys`,
      `API_KEY=${apiKey || "your-api-key-here"}`,
      `SECRET_KEY=your-secret-key-here`,
    ];
    if (extra) {
      lines.push(``, `# Custom`, ...extra.split("\n").filter(Boolean).map((l) => l.trim()));
    }
    lines.push(``, `# JWT`, `JWT_SECRET=your-jwt-secret`, `JWT_EXPIRES_IN=7d`);
    setOutput(lines.join("\n"));
  };

  return (
    <ToolLayout id="env-var-generator">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className="text-[10px] text-muted-foreground">App Name</label><input value={appName} onChange={(e) => setAppName(e.target.value)} className="w-full p-2 bg-background border border-border rounded text-xs font-mono" /></div>
        <div><label className="text-[10px] text-muted-foreground">DB Host</label><input value={dbHost} onChange={(e) => setDbHost(e.target.value)} className="w-full p-2 bg-background border border-border rounded text-xs font-mono" /></div>
        <div><label className="text-[10px] text-muted-foreground">DB Port</label><input value={dbPort} onChange={(e) => setDbPort(e.target.value)} className="w-full p-2 bg-background border border-border rounded text-xs font-mono" /></div>
        <div><label className="text-[10px] text-muted-foreground">API Key</label><input value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="w-full p-2 bg-background border border-border rounded text-xs font-mono" placeholder="optional" /></div>
      </div>
      <ToolInput value={extra} onChange={setExtra} placeholder="CUSTOM_VAR=value" label="Extra Variables (one per line)" rows={3} />
      <ToolButton onClick={generate}>Generate .env</ToolButton>
      <ToolOutput value={output} label=".env File" />
    </ToolLayout>
  );
}
