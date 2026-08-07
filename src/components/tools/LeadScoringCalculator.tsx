import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

type DecisionMaker = "Y" | "N";

interface Factor {
  label: string;
  value: number;
  weight: number;
  max: number;
}

export function LeadScoringCalculator() {
  const [companySize, setCompanySize] = useState(0);
  const [budgetFit, setBudgetFit] = useState(0);
  const [decisionMaker, setDecisionMaker] = useState<DecisionMaker>("N");
  const [timeline, setTimeline] = useState(0);
  const [interest, setInterest] = useState(3);
  const { color } = useToolAccent();

  const factors = useMemo<Factor[]>(() => [
    { label: "Company Size", value: companySize, weight: 20, max: 1000 },
    { label: "Budget Fit", value: budgetFit, weight: 25, max: 100 },
    { label: "Decision Maker", value: decisionMaker === "Y" ? 100 : 0, weight: 20, max: 100 },
    { label: "Timeline", value: timeline, weight: 15, max: 100 },
    { label: "Interest Level", value: (interest / 5) * 100, weight: 20, max: 100 },
  ], [companySize, budgetFit, decisionMaker, timeline, interest]);

  const score = useMemo(() => {
    return Math.round(factors.reduce((sum, f) => sum + (f.value / f.max) * f.weight, 0));
  }, [factors]);

  const category = useMemo(() => {
    if (score >= 75) return { label: "Hot Lead", color: "#ef4444", bg: "#fef2f2" };
    if (score >= 45) return { label: "Warm Lead", color: "#f59e0b", bg: "#fffbeb" };
    return { label: "Cold Lead", color: "#3b82f6", bg: "#eff6ff" };
  }, [score]);

  const sizeOptions = [
    { label: "1-10", value: 15 },
    { label: "11-50", value: 35 },
    { label: "51-200", value: 60 },
    { label: "201-1000", value: 80 },
    { label: "1000+", value: 100 },
  ];

  const budgetOptions = [
    { label: "No budget", value: 0 },
    { label: "Under $10k", value: 25 },
    { label: "$10k-$50k", value: 50 },
    { label: "$50k-$100k", value: 75 },
    { label: "$100k+", value: 100 },
  ];

  const timelineOptions = [
    { label: "Exploring", value: 20 },
    { label: "3+ months", value: 40 },
    { label: "1-3 months", value: 65 },
    { label: "This month", value: 85 },
    { label: "Ready now", value: 100 },
  ];

  const reset = () => {
    setCompanySize(0);
    setBudgetFit(0);
    setDecisionMaker("N");
    setTimeline(0);
    setInterest(3);
  };

  return (
    <ToolLayout id="lead-scoring-calculator">
      <div className="rounded-lg border-2 p-4 text-center" style={{ borderColor: category.color, backgroundColor: category.bg }}>
        <span className="font-mono text-xs uppercase tracking-wider text-muted">Lead Score</span>
        <div className="font-display text-5xl font-extrabold" style={{ color: category.color }}>{score}</div>
        <span className="font-mono text-sm font-bold" style={{ color: category.color }}>{category.label}</span>
      </div>

      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Company Size</span>
        <div className="flex flex-wrap gap-1">
          {sizeOptions.map((o) => (
            <button
              key={o.value}
              onClick={() => setCompanySize(o.value)}
              className="rounded-md border-2 px-3 py-1.5 font-mono text-xs transition-all"
              style={companySize === o.value ? { borderColor: color, backgroundColor: color, color: "#fff" } : { borderColor: "var(--border)" }}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Budget Fit</span>
        <div className="flex flex-wrap gap-1">
          {budgetOptions.map((o) => (
            <button
              key={o.value}
              onClick={() => setBudgetFit(o.value)}
              className="rounded-md border-2 px-3 py-1.5 font-mono text-xs transition-all"
              style={budgetFit === o.value ? { borderColor: color, backgroundColor: color, color: "#fff" } : { borderColor: "var(--border)" }}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Decision Maker?</span>
        <div className="flex gap-1">
          {(["Y", "N"] as DecisionMaker[]).map((v) => (
            <button
              key={v}
              onClick={() => setDecisionMaker(v)}
              className="rounded-md border-2 px-5 py-1.5 font-mono text-xs transition-all"
              style={decisionMaker === v ? { borderColor: color, backgroundColor: color, color: "#fff" } : { borderColor: "var(--border)" }}
            >
              {v === "Y" ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Timeline</span>
        <div className="flex flex-wrap gap-1">
          {timelineOptions.map((o) => (
            <button
              key={o.value}
              onClick={() => setTimeline(o.value)}
              className="rounded-md border-2 px-3 py-1.5 font-mono text-xs transition-all"
              style={timeline === o.value ? { borderColor: color, backgroundColor: color, color: "#fff" } : { borderColor: "var(--border)" }}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Interest Level: {interest}/5</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              onClick={() => setInterest(v)}
              className="h-10 w-10 rounded-md border-2 font-mono text-sm font-bold transition-all"
              style={interest === v ? { borderColor: color, backgroundColor: color, color: "#fff" } : { borderColor: "var(--border)" }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <button onClick={reset} className="font-mono text-xs text-muted underline transition-colors hover:text-foreground">
        Reset all
      </button>

      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Score Breakdown</span>
        <div className="space-y-2">
          {factors.map((f) => {
            const pct = f.max > 0 ? (f.value / f.max) * 100 : 0;
            const weighted = Math.round((f.value / f.max) * f.weight);
            return (
              <div key={f.label} className="rounded-md border-2 border-line bg-input-bg px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-foreground">{f.label}</span>
                  <span className="font-mono text-xs" style={{ color }}>{weighted}/{f.weight} pts</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
