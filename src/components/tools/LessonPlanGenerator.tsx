import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

const SUBJECTS = [
  "Mathematics",
  "Science",
  "English Language Arts",
  "History",
  "Computer Science",
  "Art",
  "Music",
  "Physical Education",
  "Foreign Language",
  "Other",
] as const;
const GRADES = ["K-2", "3-5", "6-8", "9-12", "College"] as const;

interface Section {
  name: string;
  timePct: number;
  description: string;
}

function generateLessonPlan(
  subject: string,
  grade: string,
  duration: number,
  topic: string,
  objectives: string[],
): Section[] {
  const warmup = Math.round(duration * 0.1);
  const instruction = Math.round(duration * 0.3);
  const activity = Math.round(duration * 0.35);
  const assessment = Math.round(duration * 0.15);
  const homework = duration - warmup - instruction - activity - assessment;

  const objectiveText =
    objectives.length > 0 ? objectives.join("; ") : `Understand key concepts of ${topic}`;

  return [
    {
      name: "Warm-Up",
      timePct: warmup,
      description: `Begin with a ${warmup}-minute review activity to activate prior knowledge related to ${topic}. Use a quick think-pair-share or bell-ringer question to engage students immediately. Connect previous lessons to today's topic: ${topic}.`,
    },
    {
      name: "Direct Instruction",
      timePct: instruction,
      description: `Present core content on ${topic} using visual aids, examples, and real-world applications. Learning objectives: ${objectiveText}. Break concepts into manageable chunks with check-for-understanding pauses. Use questioning techniques to maintain engagement throughout the ${instruction}-minute segment.`,
    },
    {
      name: "Guided/Independent Activity",
      timePct: activity,
      description: `Students engage in a hands-on activity applying ${topic} concepts. Provide structured worksheets or collaborative group tasks differentiated by skill level. Circulate the room to provide targeted support and formative feedback. Include think-alouds and peer discussion opportunities.`,
    },
    {
      name: "Assessment",
      timePct: assessment,
      description: `Conduct a ${assessment}-minute formative assessment to gauge understanding of ${topic}. Options: exit ticket, quick quiz, reflection journal, or oral presentation. Collect data to inform future instruction and identify students needing additional support.`,
    },
    {
      name: "Homework/Follow-Up",
      timePct: homework,
      description: `Assign practice work reinforcing ${topic} concepts. Include a mix of review problems and extension challenges. Provide clear instructions and rubric expectations. Optional: resource links for students wanting deeper exploration of ${topic}.`,
    },
  ];
}

export function LessonPlanGenerator() {
  const [subject, setSubject] = useState<string>("Mathematics");
  const [grade, setGrade] = useState<string>("6-8");
  const [duration, setDuration] = useState("50");
  const [topic, setTopic] = useState("");
  const [objectives, setObjectives] = useState("");
  const [generated, setGenerated] = useState(false);
  const { color } = useToolAccent();

  const objectiveList = useMemo(
    () =>
      objectives
        .split("\n")
        .map((o) => o.trim())
        .filter(Boolean),
    [objectives],
  );

  const sections = useMemo(() => {
    if (!topic.trim()) return null;
    const dur = parseInt(duration) || 50;
    return generateLessonPlan(subject, grade, dur, topic.trim(), objectiveList);
  }, [subject, grade, duration, topic, objectiveList]);

  const handleGenerate = () => {
    if (topic.trim()) setGenerated(true);
  };

  const fullText = useMemo(() => {
    if (!sections) return "";
    const dur = parseInt(duration) || 50;
    return [
      `LESSON PLAN`,
      `Subject: ${subject} | Grade: ${grade} | Duration: ${dur} min`,
      `Topic: ${topic}`,
      objectiveList.length > 0 ? `Objectives:\n${objectives}` : "",
      `\n${"=".repeat(50)}`,
      ...sections.map((s) => {
        const timeStart = sections
          .slice(0, sections.indexOf(s))
          .reduce((sum, sec) => sum + sec.timePct, 0);
        return [
          `\n${s.name.toUpperCase()} (${s.timePct} min | ${timeStart}-${timeStart + s.timePct} min)`,
          s.description,
        ].join("\n");
      }),
      `\n${"=".repeat(50)}`,
      `\nMaterials: Whiteboard, projector, worksheets, assessment rubric`,
      `\nDifferentiation: Adapt activities for diverse learners, provide scaffolded materials`,
    ]
      .filter(Boolean)
      .join("\n");
  }, [sections, subject, grade, duration, topic, objectives, objectiveList]);

  return (
    <ToolLayout id="lesson-plan-generator">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Subject
          </span>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Grade Level
          </span>
          <div className="flex gap-1">
            {GRADES.map((g) => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className="flex-1 rounded-md border-2 px-2 py-2.5 font-mono text-xs transition-all"
                style={
                  grade === g
                    ? { borderColor: color, backgroundColor: color, color: "#fff" }
                    : { borderColor: "var(--border)" }
                }
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Duration (min)
          </span>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="50"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: duration ? color : undefined }}
          />
        </div>
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Topic
        </span>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          placeholder="e.g. Introduction to Fractions"
          className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          style={{ borderColor: topic ? color : undefined }}
        />
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Learning Objectives (one per line, optional)
        </span>
        <textarea
          value={objectives}
          onChange={(e) => setObjectives(e.target.value)}
          rows={3}
          placeholder={
            "Define fractions and their parts\nCompare like fractions\nConvert improper fractions"
          }
          className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-4 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          style={{ borderColor: objectives ? color : undefined }}
        />
      </div>

      <div>
        <ToolButton onClick={handleGenerate} disabled={!topic.trim()}>
          Generate Lesson Plan
        </ToolButton>
      </div>

      {generated && sections && (
        <div className="space-y-4">
          <div className="rounded-md border-2 p-4" style={{ borderColor: color }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-xs uppercase tracking-wider text-muted">
                  Lesson Plan
                </div>
                <div className="mt-1 font-display text-lg font-extrabold" style={{ color }}>
                  {topic}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs text-muted">
                  {subject} | {grade}
                </div>
                <div className="font-mono text-sm font-bold" style={{ color }}>
                  {duration} min
                </div>
              </div>
            </div>
            {objectiveList.length > 0 && (
              <div className="mt-3">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted mb-1">
                  Objectives
                </div>
                {objectiveList.map((o, i) => (
                  <div key={i} className="flex items-start gap-2 font-mono text-xs text-input-text">
                    <span style={{ color }}>&#10003;</span>
                    {o}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Time Allocation
            </span>
            <div className="flex h-8 overflow-hidden rounded-md border-2 border-line">
              {sections.map((s, i) => {
                const colors = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444"];
                return (
                  <div
                    key={s.name}
                    className="flex items-center justify-center font-mono text-[10px] font-bold text-white transition-all"
                    style={{ width: `${s.timePct}%`, backgroundColor: colors[i] }}
                    title={`${s.name}: ${s.timePct} min`}
                  >
                    {s.timePct >= 10 && `${s.timePct}m`}
                  </div>
                );
              })}
            </div>
            <div className="mt-1 flex gap-3">
              {sections.map((s, i) => {
                const colors = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444"];
                return (
                  <div key={s.name} className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[i] }} />
                    <span className="font-mono text-[10px] text-muted">{s.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {sections.map((s, i) => {
            const colors = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444"];
            const timeStart = sections.slice(0, i).reduce((sum, sec) => sum + sec.timePct, 0);
            return (
              <div key={s.name} className="rounded-md border-2 border-line bg-input-bg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[i] }} />
                    <span className="font-mono text-sm font-bold text-input-text">{s.name}</span>
                  </div>
                  <span className="font-mono text-xs" style={{ color }}>
                    {s.timePct} min ({timeStart}-{timeStart + s.timePct})
                  </span>
                </div>
                <p className="mt-2 font-mono text-xs text-input-text">{s.description}</p>
              </div>
            );
          })}

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Full Lesson Plan
              </span>
              <CopyButton text={fullText} />
            </div>
            <pre className="max-h-[300px] overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-input-text">
              {fullText}
            </pre>
          </div>
        </div>
      )}

      {!generated && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter a topic and click Generate to create your lesson plan
        </div>
      )}
    </ToolLayout>
  );
}
