import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

interface Criterion {
  name: string;
  weight: number;
  score: number;
  notes: string;
}

function createEmptyCriterion(): Criterion {
  return { name: "", weight: 3, score: 3, notes: "" };
}

const DEFAULT_CRITERIA: Criterion[] = [
  { name: "Technical Skills", weight: 5, score: 3, notes: "" },
  { name: "Problem Solving", weight: 4, score: 3, notes: "" },
  { name: "Communication", weight: 3, score: 3, notes: "" },
  { name: "Teamwork & Collaboration", weight: 3, score: 3, notes: "" },
  { name: "Culture Fit", weight: 2, score: 3, notes: "" },
];

export function InterviewScorecard() {
  const [criteria, setCriteria] = useState<Criterion[]>(DEFAULT_CRITERIA);
  const [candidateName, setCandidateName] = useState("");
  const [overallNotes, setOverallNotes] = useState("");
  const { color } = useToolAccent();

  const updateCriterion = (index: number, field: keyof Criterion, value: string | number) => {
    setCriteria((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };

  const addCriterion = () => {
    setCriteria((prev) => [...prev, createEmptyCriterion()]);
  };

  const removeCriterion = (index: number) => {
    if (criteria.length > 1) {
      setCriteria((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const results = useMemo(() => {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    const scored = criteria.map((c) => {
      const weighted = c.score * c.weight;
      totalWeightedScore += weighted;
      totalWeight += c.weight;
      return { ...c, weighted, maxWeighted: 5 * c.weight };
    });

    const avgScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    const maxPossible = totalWeight * 5;
    const percentage = maxPossible > 0 ? (totalWeightedScore / maxPossible) * 100 : 0;

    let recommendation = "Not Recommended";
    if (percentage >= 80) recommendation = "Strong Hire";
    else if (percentage >= 65) recommendation = "Hire";
    else if (percentage >= 50) recommendation = "Borderline";
    else if (percentage >= 35) recommendation = "Lean No Hire";

    return { scored, avgScore, percentage, recommendation, totalWeightedScore, maxPossible };
  }, [criteria]);

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "Strong Hire":
        return "#10b981";
      case "Hire":
        return "#22c55e";
      case "Borderline":
        return "#f59e0b";
      case "Lean No Hire":
        return "#f97316";
      default:
        return "#ef4444";
    }
  };

  const exportText = useMemo(() => {
    const lines: string[] = [];
    lines.push("INTERVIEW SCORECARD");
    lines.push("=".repeat(40));
    lines.push(`Candidate: ${candidateName || "[Candidate Name]"}`);
    lines.push(
      `Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    );
    lines.push("");
    lines.push("SCORES");
    lines.push("-".repeat(40));
    for (const c of results.scored) {
      lines.push(`${c.name} (Weight: ${c.weight})`);
      lines.push(`  Score: ${c.score}/5 | Weighted: ${c.weighted}/${c.maxWeighted}`);
      if (c.notes) lines.push(`  Notes: ${c.notes}`);
      lines.push("");
    }
    lines.push("-".repeat(40));
    lines.push(`Weighted Score: ${results.totalWeightedScore}/${results.maxPossible}`);
    lines.push(`Average Score: ${results.avgScore.toFixed(2)}/5.00`);
    lines.push(`Percentage: ${results.percentage.toFixed(1)}%`);
    lines.push(`Recommendation: ${results.recommendation}`);
    if (overallNotes) {
      lines.push("");
      lines.push("OVERALL NOTES");
      lines.push(overallNotes);
    }
    return lines.join("\n");
  }, [candidateName, results, overallNotes]);

  return (
    <ToolLayout id="interview-scorecard">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Candidate Name
          </span>
          <input
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="Jane Smith"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: candidateName ? color : undefined }}
          />
        </div>
        <div className="flex items-end gap-3">
          <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center flex-1">
            <div className="font-mono text-xs text-muted">Recommendation</div>
            <div
              className="mt-1 font-display text-lg font-extrabold"
              style={{ color: getRecommendationColor(results.recommendation) }}
            >
              {results.recommendation}
            </div>
          </div>
          <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center flex-1">
            <div className="font-mono text-xs text-muted">Score</div>
            <div className="mt-1 font-display text-lg font-extrabold" style={{ color }}>
              {results.percentage.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border-2 border-line bg-input-bg p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Evaluation Criteria
          </span>
          <ToolButton onClick={addCriterion} variant="secondary" className="!px-3 !py-1.5">
            + Add Criterion
          </ToolButton>
        </div>
        <div className="space-y-3">
          {criteria.map((c, index) => (
            <div
              key={index}
              className="grid grid-cols-12 items-start gap-2 rounded-md border border-line p-3 sm:items-center"
            >
              <input
                value={c.name}
                onChange={(e) => updateCriterion(index, "name", e.target.value)}
                placeholder="Criterion"
                className="col-span-12 rounded-md border border-line bg-input-bg p-2 font-mono text-sm text-input-text outline-none placeholder:text-muted sm:col-span-3"
              />
              <div className="col-span-4 sm:col-span-2">
                <span className="mb-1 block font-mono text-[10px] text-muted">Weight (1-5)</span>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={c.weight}
                  onChange={(e) =>
                    updateCriterion(
                      index,
                      "weight",
                      Math.max(1, Math.min(5, parseInt(e.target.value) || 1)),
                    )
                  }
                  className="w-full rounded-md border border-line bg-input-bg p-2 font-mono text-sm text-input-text outline-none"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <span className="mb-1 block font-mono text-[10px] text-muted">Score (1-5)</span>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={c.score}
                  onChange={(e) =>
                    updateCriterion(
                      index,
                      "score",
                      Math.max(1, Math.min(5, parseInt(e.target.value) || 1)),
                    )
                  }
                  className="w-full rounded-md border border-line bg-input-bg p-2 font-mono text-sm text-input-text outline-none"
                />
              </div>
              <div className="col-span-3 hidden sm:flex items-end justify-center">
                <span className="font-mono text-sm font-bold" style={{ color }}>
                  {c.score * c.weight}/{5 * c.weight}
                </span>
              </div>
              <div className="col-span-6 sm:col-span-2">
                <span className="mb-1 block font-mono text-[10px] text-muted">Notes</span>
                <input
                  value={c.notes}
                  onChange={(e) => updateCriterion(index, "notes", e.target.value)}
                  placeholder="Optional"
                  className="w-full rounded-md border border-line bg-input-bg p-2 font-mono text-xs text-input-text outline-none placeholder:text-muted"
                />
              </div>
              <div className="col-span-2 flex items-end justify-end">
                <button
                  onClick={() => removeCriterion(index)}
                  className="font-mono text-sm text-muted hover:text-red-400"
                  disabled={criteria.length <= 1}
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
          <div className="font-mono text-xs text-muted">Weighted Score</div>
          <div className="mt-1 font-mono text-lg font-bold" style={{ color }}>
            {results.totalWeightedScore} / {results.maxPossible}
          </div>
        </div>
        <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
          <div className="font-mono text-xs text-muted">Average Score</div>
          <div className="mt-1 font-mono text-lg font-bold text-input-text">
            {results.avgScore.toFixed(2)} / 5.00
          </div>
        </div>
        <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
          <div className="font-mono text-xs text-muted">Criteria Count</div>
          <div className="mt-1 font-mono text-lg font-bold text-input-text">{criteria.length}</div>
        </div>
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Overall Notes
        </span>
        <textarea
          value={overallNotes}
          onChange={(e) => setOverallNotes(e.target.value)}
          placeholder="Overall impressions, hiring recommendation, next steps..."
          rows={3}
          className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
        />
      </div>

      <div className="flex gap-2">
        <CopyButton text={exportText} />
      </div>
    </ToolLayout>
  );
}
