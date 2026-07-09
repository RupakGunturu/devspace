import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function SlugSeoScorer() {
  const [slug, setSlug] = useState("");
  const [result, setResult] = useState<{ score: number; details: string[] } | null>(null);

  const analyze = () => {
    const details: string[] = [];
    let score = 0;
    if (slug.length <= 60) { score += 25; details.push("✓ Good length (≤60 chars)"); } else details.push("✗ Too long");
    if (!/[A-Z]/.test(slug)) { score += 15; details.push("✓ No uppercase"); } else details.push("✗ Contains uppercase");
    if (!/[^a-z0-9-]/.test(slug)) { score += 15; details.push("✓ URL-safe characters"); } else details.push("✗ Contains special characters");
    if (slug === slug.toLowerCase()) { score += 10; details.push("✓ All lowercase"); }
    if (!slug.startsWith("-") && !slug.endsWith("-")) { score += 10; details.push("✓ No leading/trailing dashes"); } else details.push("✗ Leading/trailing dashes");
    if (!/--/.test(slug)) { score += 10; details.push("✓ No double dashes"); } else details.push("✗ Contains double dashes");
    if (slug.includes("-")) { score += 10; details.push("✓ Uses hyphens as separators"); }
    if (slug.length >= 3) { score += 5; details.push("✓ Has content"); }
    setResult({ score: Math.min(100, score), details });
  };

  return (
    <ToolLayout id="slug-seo-scorer">
      <ToolInput value={slug} onChange={setSlug} placeholder="my-blog-post-title" label="URL Slug" rows={1} />
      <ToolButton onClick={analyze}>Analyze</ToolButton>
      {result && (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className={`text-3xl font-bold font-sans ${result.score >= 70 ? "text-coral" : result.score >= 40 ? "text-yellow-500" : "text-coral"}`}>{result.score}/100</span>
          </div>
          <div className="space-y-1">{result.details.map((d, i) => <p key={i} className={`text-sm font-mono ${d.startsWith("✓") ? "text-coral" : "text-coral"}`}>{d}</p>)}</div>
        </div>
      )}
    </ToolLayout>
  );
}
