import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { ToolInput } from "./ToolInput";
import { useToolAccent } from "@/components/ToolAccentContext";

export function KeywordDensityAnalyzer() {
  const [content, setContent] = useState("");
  const [keyword, setKeyword] = useState("");
  const { color } = useToolAccent();

  const analysis = useMemo(() => {
    if (!content.trim()) {
      return { density: 0, count: 0, totalWords: 0, topWords: [], highlightedContent: "", tfidf: [] };
    }

    const text = content.trim();
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
    const totalWords = words.length;

    const freq: Record<string, number> = {};
    for (const w of words) {
      freq[w] = (freq[w] || 0) + 1;
    }

    const topWords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({
        word,
        count,
        density: totalWords > 0 ? ((count / totalWords) * 100).toFixed(2) : "0",
      }));

    let count = 0;
    let density = 0;
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      count = words.filter((w) => w === kw).length;
      density = totalWords > 0 ? (count / totalWords) * 100 : 0;
    }

    const highlightedContent = (() => {
      if (!keyword.trim()) return text;
      const kw = keyword.trim();
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escaped})`, "gi");
      const parts = text.split(regex);
      return parts;
    })();

    const tfidf: { word: string; tf: number; score: number }[] = [];
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      const tf = totalWords > 0 ? count / totalWords : 0;
      const df = 1;
      const idf = Math.log((1 + 1) / (1 + df)) + 1;
      tfidf.push({ word: kw, tf, score: tf * idf });
    }

    return { density, count, totalWords, topWords, highlightedContent, tfidf };
  }, [content, keyword]);

  const densityColor = (d: number) => {
    if (d >= 1 && d <= 2.5) return "#22c55e";
    if (d > 2.5 && d <= 4) return "#f59e0b";
    if (d > 4) return "#ef4444";
    return "#6b7280";
  };

  const densityLabel = (d: number) => {
    if (d === 0) return "—";
    if (d >= 1 && d <= 2.5) return "Optimal";
    if (d > 2.5 && d <= 4) return "High";
    if (d > 4) return "Over-optimized";
    return "Low";
  };

  return (
    <ToolLayout id="keyword-density-analyzer">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <ToolInput
            value={content}
            onChange={setContent}
            placeholder="Paste your content here..."
            label="Content"
            rows={8}
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Target Keyword
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. react hooks"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            onFocus={(e) => { e.currentTarget.style.borderColor = color; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = ""; }}
          />
          {keyword.trim() && (
            <div className="mt-4 space-y-3">
              <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
                <div className="font-mono text-3xl font-bold" style={{ color: densityColor(analysis.density) }}>
                  {analysis.density.toFixed(2)}%
                </div>
                <div className="mt-1 font-mono text-xs text-muted">
                  Keyword Density
                </div>
                <div className="mt-1 font-mono text-xs font-medium" style={{ color: densityColor(analysis.density) }}>
                  {densityLabel(analysis.density)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
                  <div className="font-mono text-lg font-bold" style={{ color }}>{analysis.count}</div>
                  <div className="font-mono text-[10px] text-muted">Occurrences</div>
                </div>
                <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
                  <div className="font-mono text-lg font-bold text-foreground">{analysis.totalWords}</div>
                  <div className="font-mono text-[10px] text-muted">Total Words</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {keyword.trim() && content.trim() && (
        <div>
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Highlighted Text
          </span>
          <div className="max-h-[300px] overflow-auto rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm leading-relaxed text-foreground">
            {Array.isArray(analysis.highlightedContent)
              ? analysis.highlightedContent.map((part, i) => {
                  const isMatch = part.toLowerCase() === keyword.toLowerCase();
                  return isMatch ? (
                    <mark
                      key={i}
                      className="rounded-sm px-0.5"
                      style={{ backgroundColor: color, color: "#fff" }}
                    >
                      {part}
                    </mark>
                  ) : (
                    <span key={i}>{part}</span>
                  );
                })
              : <span>{analysis.highlightedContent}</span>}
          </div>
        </div>
      )}

      {analysis.topWords.length > 0 && (
        <div>
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Top 10 Words by Frequency
          </span>
          <div className="grid gap-2 sm:grid-cols-2">
            {analysis.topWords.map((w, i) => {
              const maxCount = analysis.topWords[0]?.count || 1;
              const barPct = (w.count / maxCount) * 100;
              const isTarget = keyword.trim() && w.word === keyword.trim().toLowerCase();
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-md border-2 bg-input-bg p-3"
                  style={{ borderColor: isTarget ? color : "var(--border)" }}
                >
                  <span className="w-5 text-right font-mono text-xs text-muted">#{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-medium text-foreground truncate">{w.word}</span>
                      <span className="ml-2 font-mono text-xs text-muted whitespace-nowrap">
                        {w.count} ({w.density}%)
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${barPct}%`,
                          backgroundColor: isTarget ? color : "#6b7280",
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

      {content.trim() && (
        <div className="flex items-center justify-between rounded-md border-2 border-line bg-input-bg p-3">
          <span className="font-mono text-xs text-muted">
            Total words: {analysis.totalWords}
          </span>
          <ToolButton onClick={() => { setContent(""); setKeyword(""); }} variant="secondary">
            Clear All
          </ToolButton>
        </div>
      )}
    </ToolLayout>
  );
}
