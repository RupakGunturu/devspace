import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CspBuilder() {
  const [directives, setDirectives] = useState<Record<string, string>>({
    "default-src": "'self'",
    "script-src": "'self'",
    "style-src": "'self' 'unsafe-inline'",
    "img-src": "'self' data:",
    "connect-src": "'self'",
  });
  const [output, setOutput] = useState("");

  const build = () => {
    setOutput(Object.entries(directives).filter(([, v]) => v).map(([k, v]) => `${k} ${v};`).join("\n"));
  };

  return (
    <ToolLayout id="csp-builder">
      <div className="space-y-3">
        {Object.entries(directives).map(([key, val]) => (
          <div key={key} className="grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr] gap-2 items-center">
            <span className="font-mono text-xs text-muted-foreground">{key}</span>
            <input value={val} onChange={(e) => setDirectives({ ...directives, [key]: e.target.value })} className="p-2 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
          </div>
        ))}
      </div>
      <ToolButton onClick={build}>Generate CSP</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
