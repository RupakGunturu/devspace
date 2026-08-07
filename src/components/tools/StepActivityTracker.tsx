import { useCallback, useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";

interface StepEntry {
  date: string;
  steps: number;
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getDayLabel(d: Date): string {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
}

function getWeekDates(): Date[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const start = new Date(today);
  start.setDate(today.getDate() - dayOfWeek);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function StepActivityTracker() {
  const { color } = useToolAccent();
  const [goal, setGoal] = useState(10000);
  const [entries, setEntries] = useState<StepEntry[]>(() => {
    const initial: StepEntry[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      initial.push({
        date: dateKey(d),
        steps: i === 0 ? 0 : Math.floor(Math.random() * 8000 + 2000),
      });
    }
    return initial;
  });
  const [newSteps, setNewSteps] = useState("");
  const [newDate, setNewDate] = useState(dateKey(new Date()));

  const todayKey = dateKey(new Date());

  const addEntry = useCallback(() => {
    const s = parseInt(newSteps);
    if (isNaN(s) || s < 0) return;
    setEntries((prev) => {
      const existing = prev.findIndex((e) => e.date === newDate);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { ...next[existing], steps: s };
        return next;
      }
      return [...prev, { date: newDate, steps: s }].sort((a, b) => a.date.localeCompare(b.date));
    });
    setNewSteps("");
  }, [newSteps, newDate]);

  const weekDates = useMemo(() => getWeekDates(), []);

  const weekData = useMemo(() => {
    return weekDates.map((d) => {
      const key = dateKey(d);
      const entry = entries.find((e) => e.date === key);
      return { date: d, key, steps: entry?.steps ?? 0, label: getDayLabel(d) };
    });
  }, [weekDates, entries]);

  const weekTotal = useMemo(() => weekData.reduce((s, d) => s + d.steps, 0), [weekData]);
  const weekAvg = Math.round(weekTotal / 7);
  const maxSteps = Math.max(...weekData.map((d) => d.steps), goal);

  const todayEntry = entries.find((e) => e.date === todayKey);
  const todaySteps = todayEntry?.steps ?? 0;
  const progress = goal > 0 ? Math.min((todaySteps / goal) * 100, 100) : 0;

  const streak = useMemo(() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = dateKey(d);
      const entry = entries.find((e) => e.date === key);
      if (entry && entry.steps >= goal) {
        count++;
      } else if (i > 0) {
        break;
      } else {
        break;
      }
    }
    return count;
  }, [entries, goal]);

  return (
    <ToolLayout id="step-activity-tracker">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Daily Step Goal
          </span>
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(parseInt(e.target.value) || 10000)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors"
            style={{ borderColor: color }}
          />
        </div>
        <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
          <div className="font-mono text-xs uppercase tracking-wider text-muted">Today</div>
          <div className="mt-1 font-display text-3xl font-extrabold" style={{ color }}>
            {todaySteps.toLocaleString()}
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: color }}
            />
          </div>
          <div className="mt-1 font-mono text-[10px] text-muted">
            {progress.toFixed(0)}% of {goal.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
          <div className="font-mono text-xs text-muted">Week Total</div>
          <div className="mt-1 font-display text-xl font-extrabold text-input-text">
            {weekTotal.toLocaleString()}
          </div>
        </div>
        <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
          <div className="font-mono text-xs text-muted">Daily Average</div>
          <div className="mt-1 font-display text-xl font-extrabold text-input-text">
            {weekAvg.toLocaleString()}
          </div>
        </div>
        <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
          <div className="font-mono text-xs text-muted">Goal Streak</div>
          <div className="mt-1 font-display text-xl font-extrabold" style={{ color }}>
            {streak}d
          </div>
        </div>
      </div>

      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Weekly Bar Chart
        </span>
        <div className="flex items-end gap-2 h-40">
          {weekData.map((d) => {
            const height = maxSteps > 0 ? (d.steps / maxSteps) * 100 : 0;
            const isToday = d.key === todayKey;
            return (
              <div key={d.key} className="flex flex-1 flex-col items-center gap-1">
                <span className="font-mono text-[10px] text-muted">
                  {d.steps > 0 ? d.steps.toLocaleString() : ""}
                </span>
                <div className="relative w-full" style={{ height: "100px" }}>
                  <div
                    className="absolute bottom-0 w-full rounded-t-sm transition-all duration-300"
                    style={{
                      height: `${height}%`,
                      backgroundColor: isToday ? color : "var(--border)",
                      opacity: isToday ? 1 : 0.5,
                    }}
                  />
                  <div
                    className="absolute left-0 right-0 border-t border-dashed border-muted"
                    style={{ bottom: `${(goal / maxSteps) * 100}%` }}
                  />
                </div>
                <span
                  className="font-mono text-[10px]"
                  style={{
                    color: isToday ? color : "var(--muted)",
                    fontWeight: isToday ? 700 : 400,
                  }}
                >
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-md border-2 border-line bg-input-bg p-4">
        <div className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Log Steps
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="rounded-md border-2 border-line bg-input-bg p-2 font-mono text-sm text-input-text outline-none"
          />
          <input
            type="number"
            value={newSteps}
            onChange={(e) => setNewSteps(e.target.value)}
            placeholder="Steps"
            className="rounded-md border-2 border-line bg-input-bg p-2 font-mono text-sm text-input-text outline-none placeholder:text-muted"
            style={{ borderColor: newSteps ? color : undefined }}
          />
          <ToolButton onClick={addEntry} disabled={!newSteps}>
            Log
          </ToolButton>
        </div>
      </div>
    </ToolLayout>
  );
}
