import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

export function SalaryNegotiationScript() {
  const [currentSalary, setCurrentSalary] = useState("");
  const [desiredSalary, setDesiredSalary] = useState("");
  const [yearsExp, setYearsExp] = useState("");
  const [achievements, setAchievements] = useState("");
  const [generated, setGenerated] = useState(false);
  const { color } = useToolAccent();

  const achievementList = useMemo(
    () =>
      achievements
        .split("\n")
        .map((a) => a.trim())
        .filter(Boolean),
    [achievements]
  );

  const script = useMemo(() => {
    const current = parseFloat(currentSalary) || 0;
    const desired = parseFloat(desiredSalary) || 0;
    const years = parseInt(yearsExp) || 0;
    const diff = desired - current;
    const diffPct = current > 0 ? ((diff / current) * 100).toFixed(0) : "0";

    const achievementsText =
      achievementList.length > 0
        ? achievementList.map((a) => `  \u2022 ${a}`).join("\n")
        : `  \u2022 Led key initiatives that delivered measurable impact\n  \u2022 Consistently exceeded performance expectations\n  \u2022 Contributed to team growth and knowledge sharing`;

    const anchorPoint = Math.round(desired * 1.1);
    const counterLow = Math.round(desired * 0.95);

    return [
      `SALARY NEGOTIATION SCRIPT`,
      ``,
      `Prepared for: ${years} years of experience`,
      `Current Salary: ${current > 0 ? `$${current.toLocaleString()}` : "[Current]"}`,
      `Target Salary: ${desired > 0 ? `$${desired.toLocaleString()}` : "[Target]"}`,
      diff > 0 ? `Increase Requested: $${diff.toLocaleString()} (${diffPct}%)` : "",
      ``,
      `--- OPENING ---`,
      ``,
      `Thank you for extending this offer. I'm genuinely excited about the opportunity to join the team and contribute to [Company]. After reviewing the offer carefully, I'd like to discuss the compensation package.`,
      ``,
      `Based on my research of market rates for this role, and considering my ${years} years of experience, I was expecting a compensation in the range of $${anchorPoint.toLocaleString()}. I believe this reflects the value I'll bring to the organization.`,
      ``,
      `--- VALUE PROPOSITION ---`,
      ``,
      `I want to highlight the specific value I bring to this role:`,
      ``,
      achievementsText,
      ``,
      `These contributions demonstrate my ability to deliver results that directly impact the bottom line. I'm confident I can bring similar or greater value to your team from day one.`,
      ``,
      `--- COUNTER-OFFER STRATEGY ---`,
      ``,
      `If they offer below target:`,
      ``,
      `I appreciate the offer, and I want to find a number that works for both of us. Given my experience and the market data, would you be able to meet me at $${desired.toLocaleString()}? I'm confident this reflects the value I'll deliver.`,
      ``,
      `If they cannot meet the target:`,
      ``,
      `I understand budget constraints. Could we explore alternatives such as:`,
      `  \u2022 Signing bonus to bridge the gap`,
      `  \u2022 Additional equity or stock options`,
      `  \u2022 Earlier performance review (6 months instead of 12)`,
      `  \u2022 Additional PTO days`,
      `  \u2022 Remote work flexibility`,
      `  \u2022 Professional development budget`,
      ``,
      `If they push back firmly:`,
      ``,
      `I understand. I'd like to proceed with the current offer, but could we agree in writing to a salary review at 6 months based on performance metrics we define together?`,
      ``,
      `--- CLOSING ---`,
      ``,
      `I want to emphasize that compensation is one factor — I'm truly excited about this role and the team. I'm confident we can reach an agreement that reflects my value and aligns with your budget. I look forward to your response.`,
      ``,
      `--- KEY TIPS ---`,
      ``,
      `  \u2022 Never give a number first if possible — let them anchor`,
      `  \u2022 Always have data to back up your request`,
      `  \u2022 Practice your tone: confident, not aggressive`,
      `  \u2022 Silence is powerful — after stating your number, wait`,
      `  \u2022 Get any agreement in writing before signing`,
    ]
      .filter((line) => line !== undefined)
      .join("\n");
  }, [currentSalary, desiredSalary, yearsExp, achievementList]);

  const handleGenerate = () => {
    setGenerated(true);
  };

  return (
    <ToolLayout id="salary-negotiation-script">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Current Salary ($)
          </span>
          <input
            type="number"
            value={currentSalary}
            onChange={(e) => setCurrentSalary(e.target.value)}
            placeholder="95000"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: currentSalary ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Desired Salary ($)
          </span>
          <input
            type="number"
            value={desiredSalary}
            onChange={(e) => setDesiredSalary(e.target.value)}
            placeholder="130000"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: desiredSalary ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Years of Experience
          </span>
          <input
            type="number"
            value={yearsExp}
            onChange={(e) => setYearsExp(e.target.value)}
            placeholder="7"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: yearsExp ? color : undefined }}
          />
        </div>
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Key Achievements (one per line)
        </span>
        <textarea
          value={achievements}
          onChange={(e) => setAchievements(e.target.value)}
          placeholder={"Led migration that reduced costs by 40%\nDelivered feature that increased revenue by $500K\nMentored 3 junior developers to mid-level"}
          rows={4}
          className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          style={{ borderColor: achievements ? color : undefined }}
        />
      </div>

      <ToolButton onClick={handleGenerate}>
        Generate Negotiation Script
      </ToolButton>

      {generated && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Negotiation Script
            </span>
            <CopyButton text={script} />
          </div>
          <pre className="max-h-[600px] overflow-auto whitespace-pre-wrap font-mono text-sm text-input-text leading-relaxed">
            {script}
          </pre>
        </div>
      )}

      {!generated && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Fill in your details and click Generate to create a personalized negotiation script
        </div>
      )}
    </ToolLayout>
  );
}
