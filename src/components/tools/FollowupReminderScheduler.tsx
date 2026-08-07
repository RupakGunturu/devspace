import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";
import { AntdDatePicker } from "@/components/ui/antd-date-picker";

interface ScheduleItem {
  label: string;
  days: number;
  date: Date;
  note: string;
}

const SCHEDULE_GAPS = [1, 3, 7, 14, 30];

export function FollowupReminderScheduler() {
  const [contact, setContact] = useState("");
  const [company, setCompany] = useState("");
  const [lastDate, setLastDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const { color } = useToolAccent();

  const generate = () => {
    if (!contact.trim() || !lastDate) return;
    const base = lastDate;
    if (isNaN(base.getTime())) return;

    const notes = [
      "Quick check-in — see how things are going",
      "Share relevant resource or update",
      "Ask for feedback on previous conversation",
      "Propose next step or meeting",
      "Final touchpoint — gauge interest level",
    ];

    const items: ScheduleItem[] = SCHEDULE_GAPS.map((days, i) => {
      const date = new Date(base);
      date.setDate(date.getDate() + days);
      return { label: `Follow-up ${i + 1}`, days, date, note: notes[i] };
    });

    setSchedule(items);
  };

  const priorityColors = { low: "#3b82f6", medium: "#f59e0b", high: "#ef4444" };

  const reset = () => {
    setContact("");
    setCompany("");
    setLastDate(null);
    setPriority("medium");
    setSchedule([]);
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const allText = useMemo(() => {
    if (schedule.length === 0) return "";
    let text = `Follow-up Schedule: ${contact}${company ? ` (${company})` : ""}\nPriority: ${priority}\n\n`;
    text += schedule
      .map(
        (s) =>
          `${s.label} — ${formatDate(s.date)}\n  ${s.days} days after last contact\n  ${s.note}`,
      )
      .join("\n\n");
    return text;
  }, [schedule, contact, company, priority]);

  return (
    <ToolLayout id="followup-reminder-scheduler">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Contact Name
          </label>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="e.g. Jane Smith"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none placeholder:text-muted"
            style={{ borderColor: contact ? color : undefined }}
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Company
          </label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Acme Corp"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none placeholder:text-muted"
            style={{ borderColor: company ? color : undefined }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Last Contact Date
          </label>
          <AntdDatePicker value={lastDate} onChange={setLastDate} placeholder="Select date" />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Priority
          </label>
          <div className="flex gap-1">
            {(["low", "medium", "high"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className="flex-1 rounded-md border-2 px-3 py-2 font-mono text-xs capitalize transition-all"
                style={
                  priority === p
                    ? {
                        borderColor: priorityColors[p],
                        backgroundColor: priorityColors[p],
                        color: "#fff",
                      }
                    : { borderColor: "var(--border)" }
                }
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <ToolButton onClick={generate} disabled={!contact.trim() || !lastDate}>
          Generate Schedule
        </ToolButton>
        <ToolButton variant="secondary" onClick={reset}>
          Reset
        </ToolButton>
      </div>

      {schedule.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Follow-up Schedule for {contact}
              {company ? ` @ ${company}` : ""}
            </span>
            <CopyButton text={allText} />
          </div>

          <div className="relative ml-4 border-l-2 border-line pl-6 space-y-4">
            {schedule.map((item, i) => (
              <div key={i} className="relative">
                <div
                  className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2"
                  style={{ borderColor: color, backgroundColor: i === 0 ? color : "var(--bg)" }}
                />
                <div className="rounded-lg border-2 border-line bg-input-bg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold" style={{ color }}>
                      {item.label}
                    </span>
                    <span className="font-mono text-[10px] text-muted">{item.days}d after</span>
                  </div>
                  <p className="font-mono text-xs text-input-text">{formatDate(item.date)}</p>
                  <p className="mt-1 font-mono text-[10px] text-muted">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {schedule.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Fill in the details above to generate a follow-up schedule
        </div>
      )}
    </ToolLayout>
  );
}
