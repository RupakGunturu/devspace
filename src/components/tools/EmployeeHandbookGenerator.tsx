import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

type SectionType = "PTO" | "Remote Work" | "Code of Conduct" | "Benefits" | "Dress Code";

interface HandbookConfig {
  companyName: string;
  sectionType: SectionType;
  ptoDays: string;
  remoteDays: string;
  probationPeriod: string;
  healthInsurance: string;
  retirementPlan: string;
  dressDetails: string;
}

const SECTION_TEMPLATES: Record<SectionType, (config: HandbookConfig) => string> = {
  PTO: (c) => {
    const company = c.companyName || "[Company Name]";
    const days = c.ptoDays || "20";
    const probation = c.probationPeriod || "90";
    return [
      `${company} - Paid Time Off (PTO) Policy`,
      ``,
      `1. PURPOSE`,
      `This policy outlines the paid time off benefits available to all full-time employees of ${company}. We believe that time away from work is essential for maintaining productivity, creativity, and overall well-being.`,
      ``,
      `2. PTO ACCRUAL`,
      `Full-time employees accrue ${days} days of PTO per calendar year. PTO is accrued on a per-pay-period basis and can be used after the completion of the ${probation}-day probationary period.`,
      ``,
      `PTO Accrual Schedule:`,
      `  \u2022 Years 0-2: ${days} days per year`,
      `  \u2022 Years 3-5: ${days} + 2 days per year`,
      `  \u2022 Years 6+: ${days} + 5 days per year (max 30 days)`,
      ``,
      `3. REQUESTING PTO`,
      `  \u2022 PTO requests must be submitted at least 2 weeks in advance for planned absences`,
      `  \u2022 Requests are approved by your direct manager`,
      `  \u2022 During critical project periods, managers may request adjusted timing`,
      `  \u2022 Same-day PTO requests are permitted for unexpected situations`,
      ``,
      `4. PTO CARRY-OVER`,
      `  \u2022 Up to 5 unused PTO days may be carried over to the next calendar year`,
      `  \u2022 Unused PTO beyond the carry-over limit expires on December 31st`,
      `  \u2022 PTO cannot be cashed out upon separation, except where required by law`,
      ``,
      `5. HOLIDAYS`,
      `${company} observes the following paid holidays:`,
      `  \u2022 New Year's Day`,
      `  \u2022 Martin Luther King Jr. Day`,
      `  \u2022 Presidents' Day`,
      `  \u2022 Memorial Day`,
      `  \u2022 Independence Day`,
      `  \u2022 Labor Day`,
      `  \u2022 Thanksgiving Day`,
      `  \u2022 Day after Thanksgiving`,
      `  \u2022 Christmas Day`,
      ``,
      `6. SICK LEAVE`,
      `In addition to PTO, employees receive ${Math.round(parseInt(days) * 0.4) || 8} sick days per year for health-related absences. Sick leave is not carried over year to year.`,
      ``,
      `7. CONTACT`,
      `For questions about PTO, contact your manager or HR at hr@${company.toLowerCase().replace(/\s+/g, "")}.com.`,
    ].join("\n");
  },
  "Remote Work": (c) => {
    const company = c.companyName || "[Company Name]";
    const days = c.remoteDays || "3";
    return [
      `${company} - Remote Work Policy`,
      ``,
      `1. PURPOSE`,
      `${company} supports flexible work arrangements that enable employees to perform their best work while maintaining collaboration and company culture. This policy establishes guidelines for remote and hybrid work.`,
      ``,
      `2. ELIGIBILITY`,
      `  \u2022 All full-time employees who have completed their probationary period`,
      `  \u2022 Role must be suitable for remote work (determined by manager)`,
      `  \u2022 satisfactory performance record`,
      `  \u2022 Manager approval required`,
      ``,
      `3. HYBRID WORK SCHEDULE`,
      `  \u2022 Employees may work remotely up to ${days} days per week`,
      `  \u2022 Core in-office days: Tuesday, Wednesday, Thursday`,
      `  \u2022 Flexible days: Monday, Friday (remote or in-office)`,
      `  \u2022 Schedule must be agreed upon with your manager`,
      ``,
      `4. FULLY REMOTE`,
      `Fully remote arrangements require:`,
      `  \u2022 VP-level approval`,
      `  \u2022 Must be in a supported time zone (within 4 hours of core business hours)`,
      `  \u2022 Quarterly in-person visits to the office`,
      `  \u2022 Updated equipment and home office setup`,
      ``,
      `5. HOME OFFER REQUIREMENTS`,
      `  \u2022 Dedicated, quiet workspace`,
      `  \u2022 Reliable internet (minimum 50 Mbps download)`,
      `  \u2022 Ergonomic setup recommended`,
      `  \u2022 Company will provide a one-time $500 home office stipend`,
      ``,
      `6. EXPECTATIONS`,
      `  \u2022 Available during core hours: 10am-3pm local time`,
      `  \u2022 Respond to messages within 1 hour during work hours`,
      `  \u2022 Camera on for team meetings`,
      `  \u2022 Keep calendar updated`,
      `  \u2022 Maintain secure connection (VPN required)`,
      ``,
      `7. PERFORMANCE`,
      `Remote work is a privilege, not a right. Continued remote work eligibility is based on:`,
      `  \u2022 Meeting or exceeding performance expectations`,
      `  \u2022 Active collaboration with team`,
      `  \u2022 Compliance with this policy`,
      ``,
      `8. REVIEWS`,
      `Remote work arrangements are reviewed quarterly and may be adjusted based on business needs.`,
    ].join("\n");
  },
  "Code of Conduct": (c) => {
    const company = c.companyName || "[Company Name]";
    return [
      `${company} - Code of Conduct`,
      ``,
      `1. OUR COMMITMENT`,
      `${company} is committed to maintaining a workplace built on respect, integrity, and professionalism. Every employee plays a role in upholding these standards.`,
      ``,
      `2. RESPECTFUL WORKPLACE`,
      `All employees are expected to:`,
      `  \u2022 Treat colleagues with dignity and respect`,
      `  \u2022 Communicate professionally in all channels`,
      `  \u2022 Value diverse perspectives and backgrounds`,
      `  \u2022 Provide constructive feedback respectfully`,
      `  \u2022 Address conflicts directly and professionally`,
      ``,
      `3. ANTI-HARASSMENT POLICY`,
      `${company} has zero tolerance for harassment of any kind, including:`,
      `  \u2022 Verbal, written, or physical harassment`,
      `  \u2022 Discrimination based on race, gender, age, religion, disability, sexual orientation, or any protected characteristic`,
      `  \u2022 Retaliation against anyone who reports harassment`,
      ``,
      `If you experience or witness harassment:`,
      `  \u2022 Report immediately to your manager or HR`,
      `  \u2022 Contact the anonymous ethics hotline: 1-800-XXX-XXXX`,
      ``,
      `4. DATA PRIVACY & SECURITY`,
      `  \u2022 Protect company and customer data`,
      `  \u2022 Never share credentials`,
      `  \u2022 Follow security protocols for data handling`,
      `  \u2022 Report security incidents immediately`,
      ``,
      `5. CONFLICTS OF INTEREST`,
      `  \u2022 Disclose any outside employment or business interests`,
      `  \u2022 Avoid situations where personal interests conflict with company interests`,
      `  \u2022 Do not use company resources for personal gain`,
      ``,
      `6. COMMUNICATION STANDARDS`,
      `  \u2022 Use professional language in all communications`,
      `  \u2022 Be mindful of cultural differences in global teams`,
      `  \u2022 Keep confidential information private`,
      `  \u2022 Document important decisions`,
      ``,
      `7. VIOLATIONS`,
      `Violations of this code may result in disciplinary action, up to and including termination of employment.`,
      ``,
      `8. REPORTING`,
      `Report concerns to your manager, HR, or through the anonymous ethics hotline.`,
    ].join("\n");
  },
  Benefits: (c) => {
    const company = c.companyName || "[Company Name]";
    const health = c.healthInsurance || "Comprehensive health, dental, and vision insurance";
    const retirement = c.retirementPlan || "401(k) with company match up to 4%";
    return [
      `${company} - Employee Benefits`,
      ``,
      `1. HEALTH & WELLNESS`,
      `${health}`,
      `  \u2022 Coverage starts on your first day of employment`,
      `  \u2022 ${company} covers 80% of premiums for employees, 50% for dependents`,
      `  \u2022 HSA and FSA options available`,
      `  \u2022 Mental health support: 12 free therapy sessions per year via EAP`,
      `  \u2022 Wellness stipend: $50/month for gym, fitness, or wellness activities`,
      ``,
      `2. FINANCIAL BENEFITS`,
      `${retirement}`,
      `  \u2022 Equity/stock options for all full-time employees`,
      `  \u2022 Annual performance bonus (up to 15% of salary)`,
      `  \u2022 Life insurance: 2x annual salary, company-paid`,
      `  \u2022 Disability insurance: short-term and long-term, company-paid`,
      ``,
      `3. TIME OFF`,
      `  \u2022 ${c.ptoDays || "20"} days PTO per year`,
      `  \u2022 ${Math.round(parseInt(c.ptoDays || "20") * 0.4)} sick days per year`,
      `  \u2022 10 paid holidays`,
      `  \u2022 Parental leave: 16 weeks paid`,
      `  \u2022 Bereavement leave: 5 days`,
      ``,
      `4. PROFESSIONAL DEVELOPMENT`,
      `  \u2022 $2,000 annual learning and development budget`,
      `  \u2022 Conference attendance (1 per year, fully funded)`,
      `  \u2022 Internal mentorship program`,
      `  \u2022 Tuition reimbursement for relevant degree programs`,
      ``,
      `5. WORK-LIFE BALANCE`,
      `  \u2022 Flexible work hours`,
      `  \u2022 Remote/hybrid work options`,
      `  \u2022 Commuter benefits`,
      `  \u2022 Employee discount program`,
      `  \u2022 Company events and team outings`,
      ``,
      `6. ADDITIONAL PERKS`,
      `  \u2022 Free snacks and beverages in office`,
      `  \u2022 Home office setup stipend ($500 one-time)`,
      `  \u2022 Pet-friendly office`,
      `  \u2022 Volunteer time off: 2 days per year`,
    ].join("\n");
  },
  "Dress Code": (c) => {
    const company = c.companyName || "[Company Name]";
    const details = c.dressDetails || "Business casual on most days";
    return [
      `${company} - Dress Code Policy`,
      ``,
      `1. OVERVIEW`,
      `${company} ${details}. We believe that how you present yourself reflects both personal professionalism and our company culture.`,
      ``,
      `2. DAILY DRESS CODE`,
      `Business Casual (Default):`,
      `  \u2022 Collared shirts, blouses, sweaters, or tasteful tops`,
      `  \u2022 Dress pants, chinos, khakis, or clean dark jeans`,
      `  \u2022 Loafers, flats, boots, or clean sneakers`,
      `  \u2022 Neat, well-maintained appearance`,
      ``,
      `3. CASUAL FRIDAYS`,
      `On Fridays, employees may dress in smart casual attire:`,
      `  \u2022 Clean, non-distressed jeans`,
      `  \u2022 Polos, t-shirts (no offensive graphics), or casual tops`,
      `  \u2022 Clean sneakers or casual shoes`,
      ``,
      `4. CLIENT-FACING MEETINGS`,
      `When meeting with clients or presenting externally:`,
      `  \u2022 Business professional or elevated business casual`,
      `  \u2022 Blazers, tailored pieces, polished shoes`,
      `  \u2022 When in doubt, overdress rather than underdress`,
      ``,
      `5. NOT ACCEPTABLE`,
      `  \u2022 Clothing with offensive language, images, or slogans`,
      `  \u2022 Flip-flops or beachwear`,
      `  \u2022 Extremely casual athletic wear (gym clothes)`,
      `  \u2022 Visible undergarments`,
      `  \u2022 Excessively revealing clothing`,
      ``,
      `6. ACCOMMODATIONS`,
      `${company} respects cultural and religious dress practices. Reasonable accommodations will be made for:`,
      `  \u2022 Religious attire and head coverings`,
      `  \u2022 Cultural dress`,
      `  \u2022 Medical or disability-related needs`,
      ``,
      `7. QUESTIONS`,
      `If you are unsure whether something is appropriate, err on the side of more formal, or ask your manager.`,
    ].join("\n");
  },
};

const SECTION_OPTIONS: SectionType[] = [
  "PTO",
  "Remote Work",
  "Code of Conduct",
  "Benefits",
  "Dress Code",
];

export function EmployeeHandbookGenerator() {
  const [config, setConfig] = useState<HandbookConfig>({
    companyName: "",
    sectionType: "PTO",
    ptoDays: "20",
    remoteDays: "3",
    probationPeriod: "90",
    healthInsurance: "",
    retirementPlan: "",
    dressDetails: "",
  });
  const [generated, setGenerated] = useState(false);
  const { color } = useToolAccent();

  const updateConfig = (field: keyof HandbookConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const policyText = useMemo(() => {
    const generator = SECTION_TEMPLATES[config.sectionType];
    return generator(config);
  }, [config]);

  const handleGenerate = () => {
    setGenerated(true);
  };

  return (
    <ToolLayout id="employee-handbook-generator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Company Name
          </span>
          <input
            value={config.companyName}
            onChange={(e) => updateConfig("companyName", e.target.value)}
            placeholder="Acme Corp"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: config.companyName ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Section Type
          </span>
          <div className="flex flex-wrap gap-2">
            {SECTION_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => updateConfig("sectionType", s)}
                className="rounded-md border-2 px-3 py-2 font-mono text-xs font-medium transition-all"
                style={
                  config.sectionType === s
                    ? { borderColor: color, backgroundColor: color, color: "#fff" }
                    : { borderColor: "var(--border)" }
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-md border-2 border-line bg-input-bg p-4">
        <div className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Customize {config.sectionType} Policy
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {config.sectionType === "PTO" && (
            <>
              <div>
                <span className="mb-1 block font-mono text-xs text-muted">PTO Days Per Year</span>
                <input
                  type="number"
                  value={config.ptoDays}
                  onChange={(e) => updateConfig("ptoDays", e.target.value)}
                  className="w-full rounded-md border border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none"
                />
              </div>
              <div>
                <span className="mb-1 block font-mono text-xs text-muted">
                  Probation Period (days)
                </span>
                <input
                  type="number"
                  value={config.probationPeriod}
                  onChange={(e) => updateConfig("probationPeriod", e.target.value)}
                  className="w-full rounded-md border border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none"
                />
              </div>
            </>
          )}
          {config.sectionType === "Remote Work" && (
            <div>
              <span className="mb-1 block font-mono text-xs text-muted">Remote Days Per Week</span>
              <input
                type="number"
                value={config.remoteDays}
                onChange={(e) => updateConfig("remoteDays", e.target.value)}
                className="w-full rounded-md border border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none"
              />
            </div>
          )}
          {config.sectionType === "Benefits" && (
            <>
              <div>
                <span className="mb-1 block font-mono text-xs text-muted">
                  Health Insurance Details
                </span>
                <input
                  value={config.healthInsurance}
                  onChange={(e) => updateConfig("healthInsurance", e.target.value)}
                  placeholder="Custom health insurance details..."
                  className="w-full rounded-md border border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none placeholder:text-muted"
                />
              </div>
              <div>
                <span className="mb-1 block font-mono text-xs text-muted">Retirement Plan</span>
                <input
                  value={config.retirementPlan}
                  onChange={(e) => updateConfig("retirementPlan", e.target.value)}
                  placeholder="Custom retirement plan..."
                  className="w-full rounded-md border border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none placeholder:text-muted"
                />
              </div>
            </>
          )}
          {config.sectionType === "Dress Code" && (
            <div className="sm:col-span-2">
              <span className="mb-1 block font-mono text-xs text-muted">
                Dress Code Description
              </span>
              <input
                value={config.dressDetails}
                onChange={(e) => updateConfig("dressDetails", e.target.value)}
                placeholder="e.g., Smart casual with no jeans on client days"
                className="w-full rounded-md border border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none placeholder:text-muted"
              />
            </div>
          )}
          {config.sectionType === "Code of Conduct" && (
            <div className="sm:col-span-2 font-mono text-xs text-muted">
              The Code of Conduct is a standardized policy. Customize the company name to
              personalize it.
            </div>
          )}
        </div>
      </div>

      <ToolButton onClick={handleGenerate} disabled={!config.companyName.trim()}>
        Generate Policy Section
      </ToolButton>

      {generated && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              {config.sectionType} Policy
            </span>
            <CopyButton text={policyText} />
          </div>
          <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap font-mono text-sm text-input-text leading-relaxed">
            {policyText}
          </pre>
        </div>
      )}

      {!generated && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter your company name and select a section type, then click Generate
        </div>
      )}
    </ToolLayout>
  );
}
