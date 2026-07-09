import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function HeadlineAnalyzer() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ score: number; details: string[] } | null>(null);

  const powerWords = ["best", "top", "ultimate", "guide", "how", "why", "secret", "proven", "easy", "fast", "simple", "free", "new", "easy"];

  const analyze = () => {
    const details: string[] = [];
    let score = 50;
    const len = input.length;
    if (len >= 40 && len <= 60) { score += 20; details.push("✓ Good length (40-60 chars)"); }
    else if (len < 40) { score += 5; details.push("⚠ Short title (< 40 chars)"); }
    else { score -= 10; details.push("✗ Too long (> 60 chars)"); }
    const hasNumber = /\d/.test(input);
    if (hasNumber) { score += 10; details.push("✓ Contains number"); } else details.push("✗ No number");
    const hasPower = powerWords.some((w) => input.toLowerCase().includes(w));
    if (hasPower) { score += 10; details.push("✓ Contains power word"); } else details.push("✗ No power word");
    const hasColon = /:/.test(input);
    if (hasColon) { score += 5; details.push("✓ Contains colon/subtitle"); }
    setResult({ score: Math.min(100, Math.max(0, score)), details });
  };

  return (
    <ToolLayout id="headline-analyzer">
      <ToolInput value={input} onChange={setInput} placeholder="Enter a blog headline..." label="Headline" rows={2} />
      <ToolButton onClick={analyze}>Analyze</ToolButton>
      {result && (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className={`text-3xl font-bold font-sans ${result.score >= 70 ? "text-coral" : result.score >= 40 ? "text-yellow-500" : "text-coral"}`}>{result.score}/100</span>
            <div className="flex-1 h-3 bg-paper-dim rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all" style={{ width: `${result.score}%` }} /></div>
          </div>
          <div className="space-y-1">{result.details.map((d, i) => <p key={i} className={`text-sm font-mono ${d.startsWith("✓") ? "text-coral" : d.startsWith("⚠") ? "text-yellow-500" : "text-coral"}`}>{d}</p>)}</div>
        </div>
      )}
    </ToolLayout>
  );
}
