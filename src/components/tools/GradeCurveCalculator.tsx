import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

const CURVE_TYPES = ["linear", "bell", "bonus"] as const;

function getLetterGrade(score: number): string {
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 67) return "D+";
  if (score >= 63) return "D";
  if (score >= 60) return "D-";
  return "F";
}

function parseScores(raw: string): number[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => !isNaN(n) && n >= 0 && n <= 100);
}

function calcStats(scores: number[]) {
  const n = scores.length;
  const mean = scores.reduce((s, v) => s + v, 0) / n;
  const sorted = [...scores].sort((a, b) => a - b);
  const median = n % 2 === 0
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
    : sorted[Math.floor(n / 2)];
  const variance = scores.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  return { mean, median, stdDev, min: sorted[0], max: sorted[n - 1] };
}

function applyCurve(scores: number[], type: string): number[] {
  if (type === "linear") {
    const max = Math.max(...scores);
    const target = 100;
    const bonus = target - max;
    return scores.map((s) => Math.min(100, s + bonus));
  }
  if (type === "bell") {
    const stats = calcStats(scores);
    const targetMean = 75;
    const targetStd = 12;
    if (stats.stdDev === 0) return scores.map(() => targetMean);
    return scores.map((s) => {
      const z = (s - stats.mean) / stats.stdDev;
      const curved = targetMean + z * targetStd;
      return Math.max(0, Math.min(100, Math.round(curved)));
    });
  }
  if (type === "bonus") {
    return scores.map((s) => Math.min(100, s + 5));
  }
  return [...scores];
}

export function GradeCurveCalculator() {
  const [raw, setRaw] = useState("72\n85\n91\n68\n78\n95\n82\n88\n76\n90");
  const [curveType, setCurveType] = useState<string>("linear");
  const [applied, setApplied] = useState(false);
  const { color } = useToolAccent();

  const scores = useMemo(() => parseScores(raw), [raw]);
  const stats = useMemo(() => (scores.length > 0 ? calcStats(scores) : null), [scores]);
  const curvedScores = useMemo(
    () => (applied ? applyCurve(scores, curveType) : []),
    [scores, curveType, applied]
  );

  const curvedStats = useMemo(
    () => (curvedScores.length > 0 ? calcStats(curvedScores) : null),
    [curvedScores]
  );

  const fmt = (v: number) => v.toFixed(1);

  const handleApply = () => {
    if (scores.length > 0) setApplied(true);
  };

  const fullText = useMemo(() => {
    if (scores.length === 0) return "";
    const s = stats!;
    const lines = [
      `GRADE CURVE ANALYSIS`,
      `Curve Type: ${curveType}`,
      `Students: ${scores.length}`,
      `\nRAW SCORES:`,
      `  Mean: ${fmt(s.mean)} | Median: ${fmt(s.median)} | Std Dev: ${fmt(s.stdDev)}`,
      `  Min: ${fmt(s.min)} | Max: ${fmt(s.max)}`,
    ];

    if (applied && curvedStats) {
      const cs = curvedStats;
      lines.push(
        `\nCURVED SCORES:`,
        `  Mean: ${fmt(cs.mean)} | Median: ${fmt(cs.median)} | Std Dev: ${fmt(cs.stdDev)}`,
        `\nINDIVIDUAL SCORES:`,
        `Raw    Curved  Grade  Curved Grade`
      );
      scores.forEach((raw, i) => {
        lines.push(
          `${fmt(raw).padStart(6)} ${fmt(curvedScores[i]).padStart(7)} ${getLetterGrade(raw).padStart(6)} ${getLetterGrade(curvedScores[i]).padStart(12)}`
        );
      });
    } else {
      lines.push(`\nINDIVIDUAL SCORES:`, `Raw    Grade`);
      scores.forEach((s) => {
        lines.push(`${fmt(s).padStart(6)} ${getLetterGrade(s)}`);
      });
    }

    return lines.join("\n");
  }, [scores, stats, curvedScores, curveType, applied]);

  return (
    <ToolLayout id="grade-curve-calculator">
      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Raw Scores (comma-separated or one per line)
        </span>
        <textarea
          value={raw}
          onChange={(e) => { setRaw(e.target.value); setApplied(false); }}
          rows={6}
          placeholder={"72\n85\n91\n68\n78\n95\n82\n88\n76\n90"}
          className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-4 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          style={{ borderColor: raw ? color : undefined }}
        />
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Curve Type</span>
        <div className="flex gap-2">
          {CURVE_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => { setCurveType(t); setApplied(false); }}
              className="rounded-md border-2 px-4 py-2 font-mono text-sm transition-all"
              style={curveType === t ? { borderColor: color, backgroundColor: color, color: "#fff" } : { borderColor: "var(--border)" }}
            >
              {t === "linear" ? "Linear (Max to 100)" : t === "bell" ? "Bell Curve" : "Flat Bonus (+5)"}
            </button>
          ))}
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: "Students", value: scores.length.toString() },
            { label: "Mean", value: fmt(stats.mean) },
            { label: "Median", value: fmt(stats.median) },
            { label: "Std Dev", value: fmt(stats.stdDev) },
            { label: "Range", value: `${fmt(stats.min)}-${fmt(stats.max)}` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted">{label}</div>
              <div className="mt-1 font-mono text-sm font-bold" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      <div>
        <ToolButton onClick={handleApply} disabled={scores.length === 0}>
          Apply Curve
        </ToolButton>
      </div>

      {applied && curvedStats && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted">Curved Mean</div>
              <div className="mt-1 font-display text-lg font-extrabold" style={{ color }}>{fmt(curvedStats.mean)}</div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted">Curved Median</div>
              <div className="mt-1 font-display text-lg font-extrabold" style={{ color }}>{fmt(curvedStats.median)}</div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted">Curved Std Dev</div>
              <div className="mt-1 font-display text-lg font-extrabold" style={{ color }}>{fmt(curvedStats.stdDev)}</div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted">Curved Range</div>
              <div className="mt-1 font-display text-lg font-extrabold" style={{ color }}>{fmt(curvedStats.min)}-{fmt(curvedStats.max)}</div>
            </div>
          </div>

          <div>
            <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Score Comparison
            </span>
            <div className="overflow-x-auto rounded-md border-2 border-line">
              <table className="w-full font-mono text-xs">
                <thead>
                  <tr className="border-b-2 border-line bg-input-bg">
                    <th className="px-3 py-2 text-left text-muted">#</th>
                    <th className="px-3 py-2 text-right text-muted">Raw Score</th>
                    <th className="px-3 py-2 text-center text-muted">Raw Grade</th>
                    <th className="px-3 py-2 text-right text-muted">Curved Score</th>
                    <th className="px-3 py-2 text-center text-muted">Curved Grade</th>
                    <th className="px-3 py-2 text-right text-muted">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((s, i) => {
                    const curved = curvedScores[i];
                    const diff = curved - s;
                    return (
                      <tr key={i} className="border-b border-line last:border-b-0">
                        <td className="px-3 py-2 text-muted">{i + 1}</td>
                        <td className="px-3 py-2 text-right text-input-text">{fmt(s)}</td>
                        <td className="px-3 py-2 text-center text-input-text">{getLetterGrade(s)}</td>
                        <td className="px-3 py-2 text-right font-bold" style={{ color }}>{fmt(curved)}</td>
                        <td className="px-3 py-2 text-center font-bold" style={{ color }}>{getLetterGrade(curved)}</td>
                        <td
                          className="px-3 py-2 text-right font-bold"
                          style={{ color: diff > 0 ? "#22c55e" : diff < 0 ? "#ef4444" : "#f59e0b" }}
                        >
                          {diff > 0 ? "+" : ""}{fmt(diff)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">Full Report</span>
              <CopyButton text={fullText} />
            </div>
            <pre className="max-h-[300px] overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-input-text">
              {fullText}
            </pre>
          </div>
        </div>
      )}

      {scores.length === 0 && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter comma-separated or newline-separated scores to begin
        </div>
      )}
    </ToolLayout>
  );
}
