import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function RobotsTxtGenerator() {
  const [rules, setRules] = useState<{ path: string; allow: boolean }[]>([
    { path: "/", allow: true },
    { path: "/admin/", allow: false },
    { path: "/api/", allow: false },
  ]);
  const [output, setOutput] = useState("");

  const addRule = () => setRules([...rules, { path: "/", allow: true }]);
  const removeRule = (i: number) => setRules(rules.filter((_, idx) => idx !== i));
  const toggleAllow = (i: number) => setRules(rules.map((r, idx) => idx === i ? { ...r, allow: !r.allow } : r));
  const updatePath = (i: number, path: string) => setRules(rules.map((r, idx) => idx === i ? { ...r, path } : r));

  const generate = () => {
    const lines = ["User-agent: *", ""];
    for (const r of rules) { lines.push(`${r.allow ? "Allow" : "Disallow"}: ${r.path}`); }
    lines.push("", `Sitemap: https://example.com/sitemap.xml`);
    setOutput(lines.join("\n"));
  };

  return (
    <ToolLayout id="robots-txt-generator">
      <div className="space-y-2">
        {rules.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <button onClick={() => toggleAllow(i)} className={`px-2 py-1 text-xs rounded font-mono ${r.allow ? "bg-coral/10 text-coral" : "bg-coral/10 text-coral"}`}>{r.allow ? "Allow" : "Disallow"}</button>
            <input value={r.path} onChange={(e) => updatePath(i, e.target.value)} className="flex-1 p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" />
            <button onClick={() => removeRule(i)} className="text-xs text-coral hover:text-coral px-2">✕</button>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <ToolButton onClick={addRule} variant="secondary">Add Rule</ToolButton>
        <ToolButton onClick={generate}>Generate</ToolButton>
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
