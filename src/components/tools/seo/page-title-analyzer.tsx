import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function PageTitleAnalyzer() {
  const [title, setTitle] = useState("");
  const [result, setResult] = useState<{ score: number; details: string[] } | null>(null);

  const analyze = () => {
    const details: string[] = [];
    let score = 50;
    const len = title.length;
    if (len >= 50 && len <= 60) { score += 25; details.push("✓ Perfect length (50-60 chars)"); }
    else if (len >= 30 && len < 50) { score += 10; details.push("⚠ Acceptable length but could be longer"); }
    else if (len > 60) { score -= 15; details.push("✗ Too long — will be truncated in SERPs"); }
    else { score -= 10; details.push("✗ Too short"); }
    if (title.includes("|") || title.includes("-") || title.includes(":")) { score += 10; details.push("✓ Contains separator"); } else details.push("⚠ No separator (| or -)");
    if (/[A-Z]/.test(title) && /[a-z]/.test(title)) { score += 5; details.push("✓ Mixed case"); }
    setResult({ score: Math.min(100, Math.max(0, score)), details });
  };

  return (
    <ToolLayout id="page-title-analyzer">
      <ToolInput value={title} onChange={setTitle} placeholder="My Page Title | Brand Name" label="Page Title" rows={1} />
      <ToolButton onClick={analyze}>Analyze</ToolButton>
      {result && (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className={`text-3xl font-bold font-sans ${result.score >= 70 ? "text-coral" : result.score >= 40 ? "text-yellow-500" : "text-coral"}`}>{result.score}/100</span>
            <span className="text-sm text-muted-foreground">{title.length} characters</span>
          </div>
          <div className="space-y-1">{result.details.map((d, i) => <p key={i} className={`text-sm font-mono ${d.startsWith("✓") ? "text-coral" : d.startsWith("⚠") ? "text-yellow-500" : "text-coral"}`}>{d}</p>)}</div>
        </div>
      )}
    </ToolLayout>
  );
}
