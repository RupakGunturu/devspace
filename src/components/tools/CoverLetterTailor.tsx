import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

export function CoverLetterTailor() {
  const [yourName, setYourName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [generated, setGenerated] = useState(false);
  const { color } = useToolAccent();

  const skillList = useMemo(
    () =>
      skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [skills]
  );

  const letter = useMemo(() => {
    const name = yourName.trim() || "[Your Name]";
    const comp = company.trim() || "[Company]";
    const r = role.trim() || "[Role]";

    const opening = `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${r} position at ${comp}. With my background and passion for building impactful solutions, I am confident I would be a valuable addition to your team.`;

    const whyCompany = `What excites me most about ${comp} is the opportunity to work alongside a team that clearly values innovation and excellence. Your recent work and commitment to pushing boundaries align perfectly with the kind of engineering challenges I thrive on, and I am eager to contribute to the continued success and growth of your organization.`;

    const skillSection =
      skillList.length > 0
        ? `My technical skill set aligns closely with the requirements of this role. I bring hands-on experience with ${skillList.slice(0, -1).join(", ")}${skillList.length > 1 ? " and " : ""}${skillList[skillList.length - 1]}, which I have applied across real-world projects to deliver reliable, scalable solutions. Combined with my experience summary below, I am well-prepared to make an immediate impact:\n\n${experience.trim() || "[Describe your key accomplishments, projects, and impact here — e.g. 'Led a team of 5 to deliver a microservices platform that reduced API latency by 40%']"}`
        : `My technical skill set aligns closely with the requirements of this role. I bring hands-on experience across modern stacks, which I have applied across real-world projects to deliver reliable, scalable solutions. Combined with my experience summary below, I am well-prepared to make an immediate impact:\n\n${experience.trim() || "[Describe your key accomplishments, projects, and impact here — e.g. 'Led a team of 5 to deliver a microservices platform that reduced API latency by 40%']"}`;

    const closing = `I would welcome the opportunity to discuss how my background and skills can contribute to ${comp}'s goals. Thank you for considering my application — I look forward to the possibility of contributing to your team.\n\nSincerely,\n${name}`;

    return [opening, "", whyCompany, "", skillSection, "", closing].join("\n");
  }, [yourName, company, role, skillList, experience]);

  const handleGenerate = () => {
    if (yourName.trim() || company.trim() || role.trim()) setGenerated(true);
  };

  return (
    <ToolLayout id="cover-letter-tailor">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Your Name
          </span>
          <input
            value={yourName}
            onChange={(e) => setYourName(e.target.value)}
            placeholder="Jane Smith"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: yourName ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Target Company
          </span>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Corp"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: company ? color : undefined }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Role Title
          </span>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Senior Software Engineer"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: role ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Key Skills (comma-separated)
          </span>
          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="React, TypeScript, Node.js"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: skills ? color : undefined }}
          />
        </div>
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Experience Summary
        </span>
        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Describe your key accomplishments and impact..."
          rows={4}
          className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          style={{ borderColor: experience ? color : undefined }}
        />
      </div>

      <div className="flex gap-2">
        <ToolButton onClick={handleGenerate} disabled={!yourName.trim() && !company.trim() && !role.trim()}>
          Generate Cover Letter
        </ToolButton>
      </div>

      {generated && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Generated Cover Letter
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
          Fill in the details above and click Generate to create a tailored cover letter
        </div>
      )}
    </ToolLayout>
  );
}
