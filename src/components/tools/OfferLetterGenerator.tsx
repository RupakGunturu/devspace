import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

export function OfferLetterGenerator() {
  const [candidateName, setCandidateName] = useState("");
  const [position, setPosition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [salary, setSalary] = useState("");
  const [benefits, setBenefits] = useState("");
  const [manager, setManager] = useState("");
  const [generated, setGenerated] = useState(false);
  const { color } = useToolAccent();

  const benefitsList = useMemo(
    () =>
      benefits
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean),
    [benefits],
  );

  const letter = useMemo(() => {
    if (!candidateName.trim() || !position.trim()) return null;

    const name = candidateName.trim();
    const pos = position.trim();
    const mgr = manager.trim() || "the hiring manager";
    const sal = salary.trim() ? `$${salary.trim()}` : "[Salary]";
    const date = startDate
      ? new Date(startDate + "T00:00:00").toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "[Start Date]";

    const benefitsFormatted =
      benefitsList.length > 0
        ? benefitsList.map((b) => `    \u2022 ${b}`).join("\n")
        : `    \u2022 Health, dental, and vision insurance\n    \u2022 401(k) with company match\n    \u2022 Unlimited PTO\n    \u2022 Flexible work arrangement`;

    return [
      `OFFER LETTER`,
      ``,
      `${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
      ``,
      `Dear ${name},`,
      ``,
      `We are thrilled to extend to you an offer of employment for the position of ${pos} at our organization. After careful consideration, we believe your skills, experience, and enthusiasm make you an excellent fit for our team, and we are excited to welcome you aboard.`,
      ``,
      `POSITION DETAILS`,
      ``,
      `Position: ${pos}`,
      `Reporting To: ${mgr}`,
      `Start Date: ${date}`,
      `Employment Type: Full-time, Exempt`,
      ``,
      `COMPENSATION`,
      ``,
      `We are pleased to offer you an annual salary of ${sal}, payable in accordance with our standard payroll schedule. This compensation reflects your qualifications and the value you will bring to the role. You will also be eligible for our performance review cycle.`,
      ``,
      `BENEFITS`,
      ``,
      `As a full-time employee, you will be eligible for the following benefits, subject to the terms and conditions of each plan:`,
      ``,
      benefitsFormatted,
      ``,
      `Additional benefits details will be provided during your onboarding orientation.`,
      ``,
      `AT-WILL EMPLOYMENT`,
      ``,
      `Please note that this offer and your employment, if accepted, are at-will. This means that either you or the company may terminate the employment relationship at any time, with or without cause or notice. This letter does not constitute a contract of employment for any specific duration.`,
      ``,
      `NEXT STEPS`,
      ``,
      `To accept this offer, please sign and return this letter by the end of business day on [Response Deadline]. If you have any questions regarding this offer or your benefits, please do not hesitate to reach out.`,
      ``,
      `We are genuinely excited about the possibility of you joining our team and believe you will make a significant impact. We look forward to working with you.`,
      ``,
      `Warm regards,`,
      ``,
      `[Hiring Manager Name]`,
      `[Title]`,
      `[Company Name]`,
      ``,
      ``,
      `ACCEPTANCE`,
      ``,
      `I, ${name}, have read, understood, and accept this offer of employment.`,
      ``,
      `Signature: ____________________________    Date: ________________`,
    ].join("\n");
  }, [candidateName, position, startDate, salary, manager, benefitsList]);

  const handleGenerate = () => {
    if (candidateName.trim() && position.trim()) setGenerated(true);
  };

  const printLetter = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !letter) return;
    printWindow.document.write(`
      <html><head><title>Offer Letter - ${candidateName}</title>
      <style>body{font-family:Georgia,serif;max-width:700px;margin:40px auto;padding:20px;line-height:1.8;color:#1a1a2e;white-space:pre-wrap}h1{text-align:center;font-size:20px;margin-bottom:20px;}</style>
      </head><body><h1>OFFER LETTER</h1>${letter
        .replace("OFFER LETTER\n", "")
        .split("\n")
        .map((l) => l || "<br>")
        .join("\n")}</body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <ToolLayout id="offer-letter-generator">
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
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Position
          </span>
          <input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Senior Software Engineer"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: position ? color : undefined }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Start Date
          </span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Annual Salary ($)
          </span>
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="120000"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Reporting Manager
          </span>
          <input
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            placeholder="John Doe"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          />
        </div>
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Benefits (comma-separated)
        </span>
        <input
          value={benefits}
          onChange={(e) => setBenefits(e.target.value)}
          placeholder="e.g. Health insurance, 401k match, Unlimited PTO"
          className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
        />
      </div>

      <div className="flex gap-2">
        <ToolButton onClick={handleGenerate} disabled={!candidateName.trim() || !position.trim()}>
          Generate Offer Letter
        </ToolButton>
        {generated && letter && (
          <ToolButton onClick={printLetter} variant="secondary">
            Print
          </ToolButton>
        )}
      </div>

      {generated && letter && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Offer Letter
            </span>
            <CopyButton text={letter} />
          </div>
          <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap font-mono text-sm text-input-text leading-relaxed">
            {letter}
          </pre>
        </div>
      )}

      {!generated && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Fill in the candidate details to generate a formal offer letter
        </div>
      )}
    </ToolLayout>
  );
}
