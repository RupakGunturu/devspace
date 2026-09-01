import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

const RISK_KEYWORDS: Record<string, string[]> = {
  high: [
    "indemnif",
    "liabil",
    "penalty",
    "forfeit",
    "waiver",
    "arbitrat",
    "exclusive",
    "perpetual",
    "irrevocable",
    "sole discretion",
    "without limit",
    "personal guarantee",
    "joint and several",
    "consequential damages",
  ],
  medium: [
    "termination",
    "notice period",
    "cure period",
    "material breach",
    "reasonable",
    "good faith",
    "assignment",
    "change of control",
    "non-compete",
    "non-solicitation",
    "audit right",
  ],
  low: [
    "standard",
    "customary",
    "industry practice",
    "mutual",
    "confidential",
    "reasonable efforts",
    "commercially reasonable",
    "best efforts",
  ],
};

function analyzeClause(text: string) {
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).length;

  let riskScore = 0;
  const foundRisks: string[] = [];
  const foundRights: string[] = [];

  RISK_KEYWORDS.high.forEach((kw) => {
    if (lower.includes(kw)) {
      riskScore += 3;
      foundRisks.push(kw);
    }
  });

  RISK_KEYWORDS.medium.forEach((kw) => {
    if (lower.includes(kw)) {
      riskScore += 1;
    }
  });

  RISK_KEYWORDS.low.forEach((kw) => {
    if (lower.includes(kw)) {
      foundRights.push(kw);
    }
  });

  const riskLevel = riskScore >= 6 ? "high" : riskScore >= 3 ? "medium" : "low";
  const riskPercent = Math.min(100, riskScore * 8);

  const summary = generateSummary(text, words);
  const obligations = generateObligations(text);
  const modifications = generateModifications(riskLevel, foundRisks);

  return {
    riskLevel,
    riskPercent,
    summary,
    obligations,
    foundRisks,
    foundRights,
    modifications,
    wordCount: words,
  };
}

function generateSummary(text: string, words: number): string {
  const lower = text.toLowerCase();
  const parts: string[] = [];

  if (lower.includes("shall") || lower.includes("must") || lower.includes("required")) {
    parts.push("This clause imposes mandatory obligations on one or more parties.");
  }
  if (lower.includes("may") || lower.includes("at its discretion") || lower.includes("option")) {
    parts.push("It grants discretionary rights to at least one party.");
  }
  if (lower.includes("terminat") || lower.includes("expire") || lower.includes("cancel")) {
    parts.push("The clause addresses termination or expiration conditions.");
  }
  if (lower.includes("penalt") || lower.includes("liquidat") || lower.includes("damage")) {
    parts.push("It specifies penalty or damage provisions for non-compliance.");
  }
  if (
    lower.includes("governing law") ||
    lower.includes("jurisdiction") ||
    lower.includes("arbitrat")
  ) {
    parts.push("Governing law and dispute resolution mechanisms are defined.");
  }
  if (parts.length === 0) {
    parts.push(
      `This is a ${words}-word clause outlining terms and conditions between the contracting parties.`,
    );
  }

  return parts.join(" ");
}

function generateObligations(text: string): string[] {
  const lower = text.toLowerCase();
  const obligations: string[] = [];

  if (lower.includes("shall") || lower.includes("must")) {
    obligations.push(
      "You are required to comply with specific obligations defined in this clause.",
    );
  }
  if (lower.includes("warrant") || lower.includes("represent")) {
    obligations.push(
      "You are making warranties or representations that must be true and accurate.",
    );
  }
  if (lower.includes("indemnif")) {
    obligations.push(
      "You may be required to indemnify the other party against certain claims or losses.",
    );
  }
  if (lower.includes("confidential") || lower.includes("non-disclosure")) {
    obligations.push(
      "You are bound by confidentiality requirements regarding specified information.",
    );
  }
  if (lower.includes("non-compete")) {
    obligations.push(
      "You are restricted from competing for a defined period or within a defined scope.",
    );
  }
  if (lower.includes("payment") || lower.includes("fee") || lower.includes("compensation")) {
    obligations.push("Financial obligations or payment terms are specified.");
  }
  if (obligations.length === 0) {
    obligations.push("No explicit mandatory obligations were identified in this clause.");
  }

  return obligations;
}

function generateModifications(riskLevel: string, foundRisks: string[]): string[] {
  const mods: string[] = [];

  if (riskLevel === "high") {
    mods.push("Consider adding a liability cap to limit maximum exposure.");
    mods.push("Negotiate for mutual indemnification rather than one-sided indemnity.");
    mods.push("Add a requirement for written notice before termination.");
  }
  if (foundRisks.some((r) => r.includes("arbitrat"))) {
    mods.push("Clarify the arbitration rules, venue, and selection of arbitrators.");
  }
  if (foundRisks.some((r) => r.includes("perpetual") || r.includes("irrevocable"))) {
    mods.push("Negotiate for a defined term rather than perpetual obligations.");
  }
  if (foundRisks.some((r) => r.includes("sole discretion"))) {
    mods.push("Replace sole discretion with mutual agreement or objective standards.");
  }
  if (mods.length === 0) {
    mods.push("This clause appears balanced. Review for alignment with your specific needs.");
  }

  return mods;
}

export function ContractClauseExplainer() {
  const [clause, setClause] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const { color } = useToolAccent();

  const result = useMemo(() => {
    if (!clause.trim() || !analyzed) return null;
    return analyzeClause(clause);
  }, [clause, analyzed]);

  const handleAnalyze = () => {
    if (clause.trim()) setAnalyzed(true);
  };

  const riskColor =
    result?.riskLevel === "high"
      ? "#ef4444"
      : result?.riskLevel === "medium"
        ? "#f59e0b"
        : "#22c55e";

  const fullText = useMemo(() => {
    if (!result) return "";
    return [
      `RISK LEVEL: ${result.riskLevel.toUpperCase()} (${result.riskPercent}%)`,
      `\nPLAIN ENGLISH SUMMARY:\n${result.summary}`,
      `\nWHAT YOU'RE AGREEING TO:\n${result.obligations.join("\n")}`,
      result.foundRisks.length > 0
        ? `\nKEY RISKS IDENTIFIED:\n${result.foundRisks.map((r) => `- ${r}`).join("\n")}`
        : "",
      result.foundRights.length > 0
        ? `\nBALANCING PROVISIONS:\n${result.foundRights.map((r) => `- ${r}`).join("\n")}`
        : "",
      `\nSUGGESTED MODIFICATIONS:\n${result.modifications.map((m) => `- ${m}`).join("\n")}`,
    ]
      .filter(Boolean)
      .join("\n");
  }, [result]);

  return (
    <ToolLayout id="contract-clause-explainer">
      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Paste Contract Clause
        </span>
        <textarea
          value={clause}
          onChange={(e) => {
            setClause(e.target.value);
            setAnalyzed(false);
          }}
          rows={10}
          placeholder="Paste the contract clause you want analyzed..."
          className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-4 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          style={{ borderColor: clause ? color : undefined }}
        />
      </div>

      <div>
        <ToolButton onClick={handleAnalyze} disabled={!clause.trim()}>
          Analyze Clause
        </ToolButton>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
              <div className="font-mono text-xs uppercase tracking-wider text-muted">
                Risk Level
              </div>
              <div
                className="mt-1 font-display text-2xl font-extrabold uppercase"
                style={{ color: riskColor }}
              >
                {result.riskLevel}
              </div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
              <div className="font-mono text-xs uppercase tracking-wider text-muted">
                Risk Score
              </div>
              <div
                className="mt-1 font-display text-2xl font-extrabold"
                style={{ color: riskColor }}
              >
                {result.riskPercent}%
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-paper-dim/50">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${result.riskPercent}%`, backgroundColor: riskColor }}
                />
              </div>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
              <div className="font-mono text-xs uppercase tracking-wider text-muted">
                Word Count
              </div>
              <div className="mt-1 font-display text-2xl font-extrabold" style={{ color }}>
                {result.wordCount}
              </div>
            </div>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Plain English Summary
            </div>
            <p className="font-mono text-sm text-input-text">{result.summary}</p>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              What You&apos;re Agreeing To
            </div>
            <ul className="space-y-2">
              {result.obligations.map((o, i) => (
                <li key={i} className="flex items-start gap-2 font-mono text-sm text-input-text">
                  <span style={{ color }}>&#8226;</span>
                  {o}
                </li>
              ))}
            </ul>
          </div>

          {result.foundRisks.length > 0 && (
            <div className="rounded-md border-2 border-line bg-input-bg p-4">
              <div className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Key Risks Identified
              </div>
              <div className="flex flex-wrap gap-2">
                {result.foundRisks.map((r, i) => (
                  <span
                    key={i}
                    className="rounded-full border-2 px-3 py-1 font-mono text-xs"
                    style={{ borderColor: riskColor, color: riskColor }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Suggested Modifications
            </div>
            <ul className="space-y-2">
              {result.modifications.map((m, i) => (
                <li key={i} className="flex items-start gap-2 font-mono text-sm text-input-text">
                  <span style={{ color }}>&#9654;</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Full Analysis
              </span>
              <CopyButton text={fullText} />
            </div>
            <pre className="max-h-[300px] overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-input-text">
              {fullText}
            </pre>
          </div>
        </div>
      )}

      {!analyzed && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Paste a contract clause above and click Analyze to get insights
        </div>
      )}
    </ToolLayout>
  );
}
