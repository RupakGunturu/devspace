import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

interface Task {
  text: string;
  checked: boolean;
}

interface WeekPlan {
  title: string;
  tasks: Task[];
}

const ROLE_TASKS: Record<string, Record<string, WeekPlan[]>> = {
  Engineer: {
    default: [
      {
        title: "Week 1 - Setup & Orientation",
        tasks: [
          { text: "Receive laptop and equipment", checked: false },
          { text: "Set up development environment", checked: false },
          { text: "Install required tools and IDEs", checked: false },
          { text: "Complete security training", checked: false },
          { text: "Review team wiki and documentation", checked: false },
          { text: "Meet your onboarding buddy", checked: false },
          { text: "Attend new hire orientation", checked: false },
          { text: "Set up email, Slack, and calendar", checked: false },
        ],
      },
      {
        title: "Week 2 - Codebase & Processes",
        tasks: [
          { text: "Clone and build the main repository", checked: false },
          { text: "Review architecture documentation", checked: false },
          { text: "Run the application locally", checked: false },
          { text: "Attend sprint planning", checked: false },
          { text: "Review coding standards and style guide", checked: false },
          { text: "Pair with a teammate on a small task", checked: false },
          { text: "Understand CI/CD pipeline", checked: false },
          { text: "Complete first code review", checked: false },
        ],
      },
      {
        title: "Week 3 - First Contributions",
        tasks: [
          { text: "Pick up a starter ticket", checked: false },
          { text: "Submit first pull request", checked: false },
          { text: "Attend team standups regularly", checked: false },
          { text: "Review monitoring and alerting dashboards", checked: false },
          { text: "Meet key stakeholders", checked: false },
          { text: "Understand deployment process", checked: false },
        ],
      },
      {
        title: "Week 4 - Ramp Up",
        tasks: [
          { text: "Take on a medium-complexity task", checked: false },
          { text: "Document learnings and gaps", checked: false },
          { text: "Schedule 1:1 with manager for feedback", checked: false },
          { text: "Set initial performance goals", checked: false },
          { text: "Join on-call rotation (observe only)", checked: false },
          { text: "Provide feedback on onboarding experience", checked: false },
        ],
      },
    ],
  },
  Designer: {
    default: [
      {
        title: "Week 1 - Setup & Orientation",
        tasks: [
          { text: "Receive laptop and equipment", checked: false },
          { text: "Set up Figma and design tools", checked: false },
          { text: "Review brand guidelines", checked: false },
          { text: "Complete security training", checked: false },
          { text: "Meet your onboarding buddy", checked: false },
          { text: "Attend new hire orientation", checked: false },
          { text: "Review existing design system", checked: false },
          { text: "Set up email, Slack, and calendar", checked: false },
        ],
      },
      {
        title: "Week 2 - Design Process",
        tasks: [
          { text: "Review current product designs", checked: false },
          { text: "Attend design critiques", checked: false },
          { text: "Understand design-to-dev handoff process", checked: false },
          { text: "Review Figma component library", checked: false },
          { text: "Meet engineering counterparts", checked: false },
          { text: "Shadow a design review session", checked: false },
          { text: "Understand user research process", checked: false },
          { text: "Review accessibility standards", checked: false },
        ],
      },
      {
        title: "Week 3 - First Project",
        tasks: [
          { text: "Take on a small design task", checked: false },
          { text: "Present first design to the team", checked: false },
          { text: "Iterate based on feedback", checked: false },
          { text: "Review analytics for your area", checked: false },
          { text: "Meet product managers", checked: false },
        ],
      },
      {
        title: "Week 4 - Ramp Up",
        tasks: [
          { text: "Take on a medium-complexity design project", checked: false },
          { text: "Document design decisions", checked: false },
          { text: "Schedule 1:1 with manager for feedback", checked: false },
          { text: "Set initial performance goals", checked: false },
          { text: "Contribute to design system improvements", checked: false },
          { text: "Provide feedback on onboarding experience", checked: false },
        ],
      },
    ],
  },
  Product: {
    default: [
      {
        title: "Week 1 - Setup & Orientation",
        tasks: [
          { text: "Receive laptop and equipment", checked: false },
          { text: "Set up project management tools", checked: false },
          { text: "Review product roadmap", checked: false },
          { text: "Complete security training", checked: false },
          { text: "Meet your onboarding buddy", checked: false },
          { text: "Attend new hire orientation", checked: false },
          { text: "Review competitive landscape", checked: false },
          { text: "Set up email, Slack, and calendar", checked: false },
        ],
      },
      {
        title: "Week 2 - Product Deep Dive",
        tasks: [
          { text: "Review user personas and research", checked: false },
          { text: "Attend sprint ceremonies", checked: false },
          { text: "Review analytics dashboards", checked: false },
          { text: "Meet engineering and design leads", checked: false },
          { text: "Understand current OKRs", checked: false },
          { text: "Review recent product launches", checked: false },
          { text: "Understand stakeholder communication", checked: false },
          { text: "Review support tickets and common issues", checked: false },
        ],
      },
      {
        title: "Week 3 - First Contributions",
        tasks: [
          { text: "Write a product brief or PRD", checked: false },
          { text: "Conduct user research session", checked: false },
          { text: "Attend cross-functional planning", checked: false },
          { text: "Review A/B test results", checked: false },
          { text: "Meet key customers or users", checked: false },
        ],
      },
      {
        title: "Week 4 - Ramp Up",
        tasks: [
          { text: "Lead a product review", checked: false },
          { text: "Document product processes and gaps", checked: false },
          { text: "Schedule 1:1 with manager for feedback", checked: false },
          { text: "Set initial performance goals", checked: false },
          { text: "Create a 30-60-90 day plan", checked: false },
          { text: "Provide feedback on onboarding experience", checked: false },
        ],
      },
    ],
  },
};

const GENERIC_TASKS: WeekPlan[] = [
  {
    title: "Week 1 - Setup & Orientation",
    tasks: [
      { text: "Receive laptop and equipment", checked: false },
      { text: "Set up work tools and accounts", checked: false },
      { text: "Complete security and compliance training", checked: false },
      { text: "Review company handbook and policies", checked: false },
      { text: "Meet your onboarding buddy", checked: false },
      { text: "Attend new hire orientation", checked: false },
      { text: "Set up email, Slack, and calendar", checked: false },
      { text: "Review team structure and org chart", checked: false },
    ],
  },
  {
    title: "Week 2 - Learn & Observe",
    tasks: [
      { text: "Review team documentation", checked: false },
      { text: "Shadow team members on key workflows", checked: false },
      { text: "Attend team meetings and ceremonies", checked: false },
      { text: "Understand your role's key processes", checked: false },
      { text: "Meet cross-functional partners", checked: false },
      { text: "Review current projects and priorities", checked: false },
    ],
  },
  {
    title: "Week 3 - Start Contributing",
    tasks: [
      { text: "Take on a small, well-scoped task", checked: false },
      { text: "Contribute to team discussions", checked: false },
      { text: "Review and provide feedback on peers' work", checked: false },
      { text: "Document any questions or gaps", checked: false },
      { text: "Meet with stakeholders in your area", checked: false },
    ],
  },
  {
    title: "Week 4 - Ramp Up",
    tasks: [
      { text: "Take on a medium-complexity task", checked: false },
      { text: "Schedule 1:1 with manager for feedback", checked: false },
      { text: "Set initial performance goals", checked: false },
      { text: "Document learnings and recommendations", checked: false },
      { text: "Create a 30-60-90 day plan", checked: false },
      { text: "Provide feedback on onboarding experience", checked: false },
    ],
  },
];

export function OnboardingChecklist() {
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [generated, setGenerated] = useState(false);
  const [weekPlans, setWeekPlans] = useState<WeekPlan[]>([]);
  const { color } = useToolAccent();

  const roles = ["Engineer", "Designer", "Product", "Other"];

  const handleGenerate = () => {
    const roleKey = role || "Other";
    const plans = ROLE_TASKS[roleKey]?.default || GENERIC_TASKS;
    setWeekPlans(
      plans.map((week) => ({
        ...week,
        tasks: week.tasks.map((t) => ({ ...t })),
      })),
    );
    setGenerated(true);
  };

  const toggleTask = (weekIndex: number, taskIndex: number) => {
    setWeekPlans((prev) =>
      prev.map((week, wi) =>
        wi === weekIndex
          ? {
              ...week,
              tasks: week.tasks.map((t, ti) =>
                ti === taskIndex ? { ...t, checked: !t.checked } : t,
              ),
            }
          : week,
      ),
    );
  };

  const completedCount = weekPlans.reduce(
    (acc, week) => acc + week.tasks.filter((t) => t.checked).length,
    0,
  );
  const totalCount = weekPlans.reduce((acc, week) => acc + week.tasks.length, 0);
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const exportText = useMemo(() => {
    if (weekPlans.length === 0) return "";
    const lines: string[] = [];
    lines.push(`ONBOARDING CHECKLIST - ${role || "General"}`);
    if (department) lines.push(`Department: ${department}`);
    lines.push(
      `Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    );
    lines.push("=".repeat(40));
    lines.push("");

    for (const week of weekPlans) {
      lines.push(week.title);
      lines.push("-".repeat(30));
      for (const task of week.tasks) {
        lines.push(`  [${task.checked ? "x" : " "}] ${task.text}`);
      }
      lines.push("");
    }

    lines.push(`Progress: ${completedCount}/${totalCount} (${progress.toFixed(0)}%)`);
    return lines.join("\n");
  }, [weekPlans, role, department, completedCount, totalCount, progress]);

  return (
    <ToolLayout id="onboarding-checklist">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Role
          </span>
          <div className="flex flex-wrap gap-2">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="rounded-md border-2 px-3 py-2 font-mono text-xs font-medium transition-all"
                style={
                  role === r
                    ? { borderColor: color, backgroundColor: color, color: "#fff" }
                    : { borderColor: "var(--border)" }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Department (optional)
          </span>
          <input
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Engineering, Design, Marketing..."
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: department ? color : undefined }}
          />
        </div>
      </div>

      <ToolButton onClick={handleGenerate} disabled={!role}>
        Generate Checklist
      </ToolButton>

      {generated && weekPlans.length > 0 && (
        <>
          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Progress: {completedCount}/{totalCount}
              </span>
              <span className="font-mono text-xs font-bold" style={{ color }}>
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: color }}
              />
            </div>
          </div>

          {weekPlans.map((week, weekIndex) => {
            const weekDone = week.tasks.filter((t) => t.checked).length;
            return (
              <div key={weekIndex} className="rounded-md border-2 border-line bg-input-bg">
                <div className="flex items-center justify-between border-b border-line p-4">
                  <span className="font-mono text-sm font-medium text-input-text">
                    {week.title}
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {weekDone}/{week.tasks.length}
                  </span>
                </div>
                <div className="p-4">
                  {week.tasks.map((task, taskIndex) => (
                    <label
                      key={taskIndex}
                      className="flex cursor-pointer items-center gap-3 border-b border-line/50 py-2.5 last:border-b-0"
                    >
                      <input
                        type="checkbox"
                        checked={task.checked}
                        onChange={() => toggleTask(weekIndex, taskIndex)}
                        className="h-4 w-4 rounded border-2 border-line accent-current"
                        style={{ accentColor: color }}
                      />
                      <span
                        className={`font-mono text-sm ${
                          task.checked ? "text-muted line-through" : "text-input-text"
                        }`}
                      >
                        {task.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="flex gap-2">
            <CopyButton text={exportText} />
          </div>
        </>
      )}

      {!generated && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Select a role and click Generate to create a tailored onboarding checklist
        </div>
      )}
    </ToolLayout>
  );
}
