import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function RegexTesterExplainer() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [output, setOutput] = useState("");

  const patterns: Record<string, string> = {
    email: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$ — Matches email addresses",
    url: "^https?:\\/\\/.+ — Matches HTTP/HTTPS URLs",
    phone: "^\\+?[\\d\\s-]{10,}$ — Matches phone numbers",
    ip: "^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$ — Matches IPv4 addresses",
    date: "^\\d{4}-\\d{2}-\\d{2}$ — Matches YYYY-MM-DD dates",
    hex: "^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$ — Matches hex color codes",
    username: "^[a-zA-Z0-9_]{3,16}$ — Matches usernames (3-16 chars)",
    password: "^.{8,}$ — Matches passwords (min 8 chars)",
  };

  const test = () => {
    try {
      const regex = new RegExp(pattern, flags);
      const matches = testString.match(regex);
      const lines = [
        `Pattern: /${pattern}/${flags}`,
        `Matches: ${matches ? matches.length : 0}`,
      ];
      if (matches) {
        lines.push(``, `Matched values:`, ...matches.map((m, i) => `  [${i}]: "${m}"`));
      }
      setOutput(lines.join("\n"));
    } catch (e: any) {
      setOutput(`Error: ${e.message}`);
    }
  };

  const explain = () => {
    const lines = Object.entries(patterns).map(([name, desc]) => `${name}: ${desc}`);
    setOutput(lines.join("\n"));
  };

  return (
    <ToolLayout id="regex-tester-explainer">
      <div className="grid grid-cols-[1fr_80px] gap-3">
        <ToolInput value={pattern} onChange={setPattern} placeholder="e.g. ^[a-z]+$" label="Regex Pattern" rows={1} />
        <div><label className="text-[10px] text-muted-foreground">Flags</label><input value={flags} onChange={(e) => setFlags(e.target.value)} className="w-full p-2 bg-background border border-border rounded text-xs font-mono" /></div>
      </div>
      <ToolInput value={testString} onChange={setTestString} placeholder="Test string here..." label="Test String" rows={3} />
      <div className="flex gap-2">
        <ToolButton onClick={test}>Test Pattern</ToolButton>
        <ToolButton onClick={explain} variant="secondary">Show Common Patterns</ToolButton>
      </div>
      <ToolOutput value={output} label="Results" />
    </ToolLayout>
  );
}
