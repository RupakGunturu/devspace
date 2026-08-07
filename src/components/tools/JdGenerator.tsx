import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

const SENIORITY_LEVELS = ["Junior", "Mid-Level", "Senior", "Lead"] as const;
const WORK_MODELS = ["Remote", "Hybrid", "Onsite"] as const;
const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Operations",
  "Finance",
  "HR",
] as const;

const RESPONSIBILITY_TEMPLATES: Record<string, string[]> = {
  Engineering: [
    "Design, build, and maintain scalable software systems",
    "Write clean, well-tested, production-ready code",
    "Participate in code reviews and technical design discussions",
    "Collaborate with cross-functional teams to deliver features",
    "Troubleshoot production issues and implement fixes",
  ],
  Design: [
    "Create user-centered design solutions based on research",
    "Develop wireframes, prototypes, and high-fidelity mockups",
    "Maintain and evolve the design system",
    "Collaborate closely with engineering for pixel-perfect implementation",
    "Conduct usability testing and iterate on feedback",
  ],
  Product: [
    "Define product strategy and roadmap",
    "Gather and prioritize requirements from stakeholders",
    "Write detailed user stories and acceptance criteria",
    "Analyze product metrics and user feedback",
    "Work with engineering and design to deliver impactful features",
  ],
  Marketing: [
    "Develop and execute marketing campaigns",
    "Analyze campaign performance and optimize ROI",
    "Create compelling content across channels",
    "Manage social media presence and community engagement",
    "Collaborate with design on brand-aligned creative assets",
  ],
  Sales: [
    "Build and maintain a pipeline of qualified leads",
    "Conduct product demonstrations and presentations",
    "Negotiate contracts and close deals",
    "Maintain CRM accuracy and forecast revenue",
    "Build lasting relationships with key accounts",
  ],
  Operations: [
    "Streamline internal processes and workflows",
    "Manage vendor relationships and contracts",
    "Oversee day-to-day operational efficiency",
    "Develop SOPs and documentation",
    "Identify cost-saving opportunities",
  ],
  Finance: [
    "Prepare financial reports and analysis",
    "Manage budgeting and forecasting processes",
    "Ensure compliance with accounting standards",
    "Support audit preparation and execution",
    "Provide data-driven financial recommendations",
  ],
  HR: [
    "Manage full-cycle recruitment for open positions",
    "Administer employee benefits and payroll",
    "Develop and implement HR policies",
    "Handle employee relations and conflict resolution",
    "Drive engagement and retention initiatives",
  ],
};

const BENEFIT_OPTIONS = [
  "Competitive salary and equity",
  "Health, dental, and vision insurance",
  "Unlimited PTO",
  "Flexible work hours",
  "Remote-friendly environment",
  "Learning & development budget",
  "401(k) with company match",
  "Gym membership reimbursement",
  "Home office stipend",
  "Team offsites and events",
];

export function JdGenerator() {
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState<string>("Engineering");
  const [seniority, setSeniority] = useState<string>("Mid-Level");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("San Francisco, CA");
  const [workModel, setWorkModel] = useState<string>("Hybrid");
  const [generated, setGenerated] = useState(false);
  const { color } = useToolAccent();

  const skillList = useMemo(
    () =>
      skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [skills],
  );

  const jd = useMemo(() => {
    if (!jobTitle.trim()) return null;

    const title = jobTitle.trim();
    const responsibilities =
      RESPONSIBILITY_TEMPLATES[department] || RESPONSIBILITY_TEMPLATES.Engineering;
    const skillsFormatted =
      skillList.length > 0
        ? skillList.map((s) => `\u2022 ${s}`).join("\n")
        : `\u2022 Relevant technical and professional skills\n\u2022 Strong communication abilities\n\u2022 Problem-solving mindset`;

    const seniorityNote =
      seniority === "Junior"
        ? "entry-level professionals eager to learn and grow"
        : seniority === "Mid-Level"
          ? "experienced professionals ready to take on new challenges"
          : seniority === "Senior"
            ? "seasoned experts who can lead initiatives and mentor others"
            : "visionary leaders who drive technical strategy and team excellence";

    return [
      `${title} \u2014 ${department}`,
      ``,
      `About the Role`,
      `We are looking for a ${seniority.toLowerCase()} ${title} to join our ${department} team. This role is ideal for ${seniorityNote}. You will work ${workModel.toLowerCase()} from ${location}, collaborating with a talented team to build impactful products.`,
      ``,
      `Responsibilities`,
      ...responsibilities.map((r) => `\u2022 ${r}`),
      seniority === "Lead" || seniority === "Senior"
        ? `\u2022 Mentor and guide junior team members`
        : null,
      seniority === "Lead" ? `\u2022 Drive technical strategy and architecture decisions` : null,
      ``,
      `Requirements`,
      `\u2022 ${seniority === "Junior" ? "0\u20132" : seniority === "Mid-Level" ? "3\u20135" : seniority === "Senior" ? "5\u20138" : "8+"} years of experience in ${department.toLowerCase()}`,
      ...skillList.slice(0, 6).map((s) => `\u2022 Proficiency in ${s}`),
      `\u2022 Strong ${seniority === "Junior" ? "foundational" : "advanced"} problem-solving skills`,
      `\u2022 Excellent written and verbal communication`,
      seniority !== "Junior" ? `\u2022 Experience with agile development methodologies` : null,
      ``,
      `Nice-to-Have`,
      `\u2022 Open-source contributions or personal projects`,
      `\u2022 Experience in a startup or fast-paced environment`,
      `\u2022 Strong technical blog or public speaking experience`,
      ``,
      `Benefits`,
      ...BENEFIT_OPTIONS.slice(0, 6).map((b) => `\u2022 ${b}`),
      ``,
      `${workModel} \u2014 ${location}`,
      ``,
      `${title} at ${seniority} Level | ${department} Department`,
    ]
      .filter(Boolean)
      .join("\n");
  }, [jobTitle, department, seniority, location, workModel, skillList]);

  const handleGenerate = () => {
    if (jobTitle.trim()) setGenerated(true);
  };

  return (
    <ToolLayout id="jd-generator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Job Title
          </span>
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Frontend Engineer"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: jobTitle ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Location
          </span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="San Francisco, CA"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Department
          </span>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Seniority
          </span>
          <div className="flex gap-1">
            {SENIORITY_LEVELS.map((s) => (
              <button
                key={s}
                onClick={() => setSeniority(s)}
                className="flex-1 rounded-md border-2 px-2 py-2 font-mono text-xs font-medium transition-all"
                style={
                  seniority === s
                    ? { borderColor: color, backgroundColor: color, color: "#fff" }
                    : { borderColor: "var(--border)" }
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Work Model
          </span>
          <div className="flex gap-1">
            {WORK_MODELS.map((w) => (
              <button
                key={w}
                onClick={() => setWorkModel(w)}
                className="flex-1 rounded-md border-2 px-2 py-2 font-mono text-xs font-medium transition-all"
                style={
                  workModel === w
                    ? { borderColor: color, backgroundColor: color, color: "#fff" }
                    : { borderColor: "var(--border)" }
                }
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Required Skills (comma-separated)
        </span>
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="e.g. React, TypeScript, GraphQL, CSS"
          className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          style={{ borderColor: skills ? color : undefined }}
        />
      </div>

      <div>
        <ToolButton onClick={handleGenerate} disabled={!jobTitle.trim()}>
          Generate Job Description
        </ToolButton>
      </div>

      {generated && jd && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Generated Job Description
            </span>
            <CopyButton text={jd} />
          </div>
          <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap font-mono text-sm text-input-text leading-relaxed">
            {jd}
          </pre>
        </div>
      )}

      {!generated && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Fill in job details and click Generate to create a professional job description
        </div>
      )}
    </ToolLayout>
  );
}
