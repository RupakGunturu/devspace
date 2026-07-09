import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState("");

  const test = () => {
    try {
      const regex = new RegExp(pattern, flags);
      const found: string[] = [];
      let match;
      if (flags.includes("g")) {
        while ((match = regex.exec(testString)) !== null) {
          found.push(match[0]);
          if (match.index === regex.lastIndex) regex.lastIndex++;
        }
      } else {
        match = regex.exec(testString);
        if (match) found.push(match[0]);
      }
      setMatches(found);
      setError("");
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
    }
  };

  const highlighted = (() => {
    if (!pattern || error) return testString;
    try {
      const regex = new RegExp(pattern, flags.replace("g", ""));
      return testString.replace(regex, (m) => `<mark class="bg-yellow-300 text-black px-0.5 rounded">${m}</mark>`);
    } catch { return testString; }
  })();

  return (
    <ToolLayout id="regex-tester">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Pattern</label>
          <input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="e.g. \d+|[a-z]+" className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground focus:outline-none focus:border-yellow/50" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Flags</label>
          <input value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="g, i, m" className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground focus:outline-none focus:border-yellow/50" />
        </div>
      </div>
      <ToolInput value={testString} onChange={setTestString} placeholder="Enter test string..." label="Test String" rows={5} />
      <ToolButton onClick={test}>Test Regex</ToolButton>
      {error && <p className="text-sm text-coral font-mono">Error: {error}</p>}
      <div className="w-full">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Highlighted Matches</span>
        <div className="w-full min-h-[60px] p-4 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: highlighted }} />
      </div>
      <div className="w-full">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Matches ({matches.length})</span>
        <div className="flex flex-wrap gap-2">
          {matches.map((m, i) => (
            <span key={i} className="px-2 py-1 bg-coral/10 text-green-600 border border-green-500/30 rounded font-mono text-xs">"{m}"</span>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
