import { useCallback, useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { CopyButton } from "./CopyButton";
import { useToolAccent } from "@/components/ToolAccentContext";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
}

function createId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function formatClockTime(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily", count: 1 },
  { value: "2x", label: "2x Daily", count: 2 },
  { value: "3x", label: "3x Daily", count: 3 },
  { value: "weekly", label: "Weekly", count: 1 },
];

const DEFAULT_TIMES: Record<string, string[]> = {
  daily: ["08:00"],
  "2x": ["08:00", "20:00"],
  "3x": ["08:00", "14:00", "20:00"],
  weekly: ["08:00"],
};

export function MedicationReminderBuilder() {
  const { color } = useToolAccent();
  const [meds, setMeds] = useState<Medication[]>([]);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [times, setTimes] = useState(["08:00"]);

  const setFrequencyAndReset = useCallback((freq: string) => {
    setFrequency(freq);
    setTimes(DEFAULT_TIMES[freq] || ["08:00"]);
  }, []);

  const updateTime = useCallback((idx: number, val: string) => {
    setTimes((prev) => prev.map((t, i) => (i === idx ? val : t)));
  }, []);

  const addMed = useCallback(() => {
    if (!name.trim()) return;
    const med: Medication = {
      id: createId(),
      name: name.trim(),
      dosage: dosage.trim() || "N/A",
      frequency,
      times: [...times].sort(),
    };
    setMeds((prev) => [...prev, med]);
    setName("");
    setDosage("");
  }, [name, dosage, frequency, times]);

  const removeMed = useCallback((id: string) => {
    setMeds((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const allScheduleEntries = useMemo(() => {
    const entries: { time: string; med: Medication }[] = [];
    for (const med of meds) {
      for (const t of med.times) {
        entries.push({ time: t, med });
      }
    }
    return entries.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  }, [meds]);

  const scheduleAsText = useMemo(() => {
    if (allScheduleEntries.length === 0) return "";
    const lines = allScheduleEntries.map(
      (e) => `${formatClockTime(e.time)} - ${e.med.name} (${e.med.dosage})`,
    );
    return ["Medication Schedule", "=".repeat(25), ...lines].join("\n");
  }, [allScheduleEntries]);

  const clockPositions = useMemo(() => {
    return allScheduleEntries.map((e) => {
      const [h, m] = e.time.split(":").map(Number);
      const angle = ((h % 12) / 12) * 360 + (m / 60) * 30 - 90;
      return { ...e, angle };
    });
  }, [allScheduleEntries]);

  return (
    <ToolLayout id="medication-reminder-builder">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Medication Name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ibuprofen"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: name ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Dosage
          </span>
          <input
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="e.g. 200mg"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: dosage ? color : undefined }}
          />
        </div>
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Frequency
        </span>
        <div className="flex flex-wrap gap-2">
          {FREQUENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFrequencyAndReset(opt.value)}
              className="rounded-md border-2 px-3 py-1.5 font-mono text-xs transition-all"
              style={
                frequency === opt.value
                  ? { borderColor: color, backgroundColor: color, color: "var(--foreground, #fff)" }
                  : { borderColor: "var(--border)", color: "var(--muted)" }
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Times
        </span>
        <div className="flex flex-wrap gap-2">
          {times.map((t, i) => (
            <input
              key={i}
              type="time"
              value={t}
              onChange={(e) => updateTime(i, e.target.value)}
              className="rounded-md border-2 border-line bg-input-bg p-2 font-mono text-sm text-input-text outline-none"
              style={{ borderColor: color }}
            />
          ))}
        </div>
      </div>

      <ToolButton onClick={addMed} disabled={!name.trim()}>
        Add Medication
      </ToolButton>

      {allScheduleEntries.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
            <div>
              <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Daily Timeline
              </span>
              <div className="relative h-48 w-full max-w-[300px] mx-auto">
                <div className="absolute inset-0 rounded-full border-2 border-line" />
                {Array.from({ length: 12 }, (_, i) => {
                  const angle = (i / 12) * 360 - 90;
                  const rad = (angle * Math.PI) / 180;
                  const labelR = 46;
                  const x = 50 + labelR * Math.cos(rad);
                  const y = 50 + labelR * Math.sin(rad);
                  const hour = i === 0 ? 12 : i;
                  return (
                    <span
                      key={i}
                      className="absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] text-muted"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      {hour}
                    </span>
                  );
                })}
                {clockPositions.map((cp, i) => {
                  const rad = (cp.angle * Math.PI) / 180;
                  const dotR = 38;
                  const x = 50 + dotR * Math.cos(rad);
                  const y = 50 + dotR * Math.sin(rad);
                  return (
                    <div
                      key={i}
                      className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 font-mono text-[8px]"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        borderColor: color,
                        backgroundColor: color,
                        color: "var(--foreground, #fff)",
                      }}
                      title={`${formatClockTime(cp.time)} - ${cp.med.name}`}
                    ></div>
                  );
                })}
              </div>
            </div>

            <div className="flex-1">
              <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Medications ({meds.length})
              </span>
              <div className="space-y-1.5">
                {allScheduleEntries.map((entry, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-md border-2 border-line bg-input-bg px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold" style={{ color }}>
                        {formatClockTime(entry.time)}
                      </span>
                      <span className="font-mono text-xs text-input-text">{entry.med.name}</span>
                      <span className="font-mono text-[10px] text-muted">{entry.med.dosage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Copy Schedule
            </span>
            <CopyButton text={scheduleAsText} />
          </div>
        </>
      )}

      {meds.length === 0 && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Add medications above to build your reminder schedule
        </div>
      )}
    </ToolLayout>
  );
}
