import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { ToolInput } from "./ToolInput";
import { useToolAccent } from "@/components/ToolAccentContext";

interface AnchorCategory {
  name: string;
  count: number;
  color: string;
  examples: string[];
}

export function BacklinkAnchorChecker() {
  const [anchorText, setAnchorText] = useState("");
  const { color } = useToolAccent();

  const analysis = useMemo(() => {
    const lines = anchorText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      return { categories: [], total: 0, risk: null as string | null };
    }

    const urlRegex = /^https?:\/\//;
    const imageExt = /\.(jpg|jpeg|png|gif|svg|webp)$/i;

    const categorized: Record<string, { count: number; examples: string[] }> = {
      Branded: { count: 0, examples: [] },
      "Exact Match": { count: 0, examples: [] },
      "Partial Match": { count: 0, examples: [] },
      Generic: { count: 0, examples: [] },
      URL: { count: 0, examples: [] },
      Image: { count: 0, examples: [] },
    };

    const genericWords = [
      "click here", "here", "this", "website", "read more", "learn more",
      "visit", "link", "page", "post", "article", "source", "info",
      "more", "homepage", "site", "web", "go", "check", "see more",
    ];

    for (const line of lines) {
      const lower = line.toLowerCase();

      if (imageExt.test(lower)) {
        categorized["Image"].count++;
        if (categorized["Image"].examples.length < 3) categorized["Image"].examples.push(line);
      } else if (urlRegex.test(line)) {
        categorized["URL"].count++;
        if (categorized["URL"].examples.length < 3) categorized["URL"].examples.push(line);
      } else if (genericWords.includes(lower)) {
        categorized["Generic"].count++;
        if (categories_examples_length(categorized, "Generic") < 3) categorized["Generic"].examples.push(line);
      } else if (lower === "devspace" || lower.includes("brand") || lower.includes("company")) {
        categorized["Branded"].count++;
        if (categorized["Branded"].examples.length < 3) categorized["Branded"].examples.push(line);
      } else if (lower.split(/\s+/).length <= 2) {
        categorized["Exact Match"].count++;
        if (categorized["Exact Match"].examples.length < 3) categorized["Exact Match"].examples.push(line);
      } else {
        categorized["Partial Match"].count++;
        if (categorized["Partial Match"].examples.length < 3) categorized["Partial Match"].examples.push(line);
      }
    }

    const total = lines.length;
    const categories: AnchorCategory[] = [
      { name: "Branded", count: categorized["Branded"].count, color: "#22c55e", examples: categorized["Branded"].examples },
      { name: "Exact Match", count: categorized["Exact Match"].count, color: "#f59e0b", examples: categorized["Exact Match"].examples },
      { name: "Partial Match", count: categorized["Partial Match"].count, color: "#3b82f6", examples: categorized["Partial Match"].examples },
      { name: "Generic", count: categorized["Generic"].count, color: "#a855f7", examples: categorized["Generic"].examples },
      { name: "URL", count: categorized["URL"].count, color: "#6b7280", examples: categorized["URL"].examples },
      { name: "Image", count: categorized["Image"].count, color: "#ec4899", examples: categorized["Image"].examples },
    ].filter((c) => c.count > 0);

    let risk: string | null = null;
    const exactPct = total > 0 ? (categorized["Exact Match"].count / total) * 100 : 0;
    const brandedPct = total > 0 ? (categorized["Branded"].count / total) * 100 : 0;

    if (exactPct > 40) {
      risk = `HIGH RISK: ${exactPct.toFixed(0)}% exact match anchors — over-optimization detected. Diversify your anchor text.`;
    } else if (exactPct > 25) {
      risk = `MEDIUM RISK: ${exactPct.toFixed(0)}% exact match anchors. Consider adding more branded and generic anchors.`;
    } else if (brandedPct < 20 && total > 5) {
      risk = `LOW RISK: Only ${brandedPct.toFixed(0)}% branded anchors. Aim for 20-40% branded anchors.`;
    }

    return { categories, total, risk };
  }, [anchorText]);

  const maxCount = useMemo(
    () => Math.max(...analysis.categories.map((c) => c.count), 1),
    [analysis.categories]
  );

  const buildPieStyle = () => {
    const cats = analysis.categories;
    const total = cats.reduce((s, c) => s + c.count, 0);
    if (total === 0) return {};

    let accumulated = 0;
    const stops: string[] = [];
    for (const cat of cats) {
      const start = (accumulated / total) * 100;
      accumulated += cat.count;
      const end = (accumulated / total) * 100;
      stops.push(`${cat.color} ${start}% ${end}%`);
    }

    return {
      background: `conic-gradient(${stops.join(", ")})`,
    };
  };

  return (
    <ToolLayout id="backlink-anchor-checker">
      <ToolInput
        value={anchorText}
        onChange={setAnchorText}
        placeholder={"Paste anchor texts, one per line:\nhttps://example.com\nclick here\nbest react hooks\nDevSpace\nlearn more\nreact hooks tutorial"}
        label="Anchor Text List (one per line)"
        rows={8}
      />

      {analysis.total > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
            <div className="font-mono text-3xl font-bold" style={{ color }}>
              {analysis.total}
            </div>
            <div className="mt-1 font-mono text-xs text-muted">Total Anchors</div>
          </div>
          <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
            <div className="font-mono text-3xl font-bold text-foreground">
              {analysis.categories.length}
            </div>
            <div className="mt-1 font-mono text-xs text-muted">Categories Used</div>
          </div>
        </div>
      )}

      {analysis.total > 0 && analysis.categories.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
          <div className="flex items-center justify-center">
            <div
              className="relative h-40 w-40 rounded-full"
              style={buildPieStyle()}
            >
              <div className="absolute inset-[25%] rounded-full bg-input-bg" />
            </div>
          </div>

          <div className="space-y-2">
            {analysis.categories.map((cat) => {
              const pct = analysis.total > 0 ? ((cat.count / analysis.total) * 100).toFixed(1) : "0";
              return (
                <div key={cat.name} className="flex items-center gap-3">
                  <span className="inline-block h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: cat.color }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-foreground">{cat.name}</span>
                      <span className="font-mono text-xs text-muted">
                        {cat.count} ({pct}%)
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(cat.count / maxCount) * 100}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {analysis.risk && (
        <div
          className="rounded-md border-2 p-4"
          style={{
            borderColor: analysis.risk.startsWith("HIGH") ? "#ef4444" : analysis.risk.startsWith("MEDIUM") ? "#f59e0b" : "#22c55e",
            backgroundColor: analysis.risk.startsWith("HIGH") ? "#ef444410" : analysis.risk.startsWith("MEDIUM") ? "#f59e0b10" : "#22c55e10",
          }}
        >
          <span
            className="mb-1 block font-mono text-xs font-bold uppercase tracking-wider"
            style={{
              color: analysis.risk.startsWith("HIGH") ? "#ef4444" : analysis.risk.startsWith("MEDIUM") ? "#f59e0b" : "#22c55e",
            }}
          >
            Risk Assessment
          </span>
          <p className="font-mono text-sm text-foreground">{analysis.risk}</p>
        </div>
      )}

      {analysis.total > 0 && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <span className="mb-3 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Recommendations
          </span>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="inline-block mt-0.5 font-mono text-xs font-bold" style={{ color }}>1</span>
              <span className="font-mono text-sm text-foreground">
                Aim for 20-40% branded anchors for natural diversity.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="inline-block mt-0.5 font-mono text-xs font-bold" style={{ color }}>2</span>
              <span className="font-mono text-sm text-foreground">
                Keep exact match anchors under 10-15% to avoid penalties.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="inline-block mt-0.5 font-mono text-xs font-bold" style={{ color }}>3</span>
              <span className="font-mono text-sm text-foreground">
                Use generic anchors (click here, learn more) for 10-20% of your backlinks.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="inline-block mt-0.5 font-mono text-xs font-bold" style={{ color }}>4</span>
              <span className="font-mono text-sm text-foreground">
                Mix in URL anchors and partial match for a natural-looking profile.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="inline-block mt-0.5 font-mono text-xs font-bold" style={{ color }}>5</span>
              <span className="font-mono text-sm text-foreground">
                Target a natural distribution: Branded &gt; Generic &gt; Partial &gt; Exact.
              </span>
            </div>
          </div>
        </div>
      )}

      {analysis.total > 0 && (
        <div className="flex justify-end">
          <ToolButton onClick={() => setAnchorText("")} variant="secondary">
            Clear
          </ToolButton>
        </div>
      )}

      {!anchorText.trim() && (
        <div className="rounded-md border-2 border-dashed border-line p-6 text-center">
          <p className="font-mono text-sm text-muted">
            Paste your anchor texts above (one per line) to analyze diversity
          </p>
        </div>
      )}
    </ToolLayout>
  );
}

function categories_examples_length(categorized: Record<string, { count: number; examples: string[] }>, key: string): number {
  return categorized[key].examples.length;
}
