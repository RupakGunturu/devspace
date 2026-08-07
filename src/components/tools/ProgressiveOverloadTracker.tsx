import { useCallback, useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";

interface LiftEntry {
  id: string;
  exercise: string;
  weight: number;
  sets: number;
  reps: number;
  date: string;
}

function createId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ProgressiveOverloadTracker() {
  const { color } = useToolAccent();
  const [entries, setEntries] = useState<LiftEntry[]>([
    { id: "1", exercise: "Bench Press", weight: 60, sets: 3, reps: 8, date: "2026-07-01" },
    { id: "2", exercise: "Bench Press", weight: 62.5, sets: 3, reps: 8, date: "2026-07-08" },
    { id: "3", exercise: "Bench Press", weight: 65, sets: 3, reps: 8, date: "2026-07-15" },
    { id: "4", exercise: "Squat", weight: 80, sets: 4, reps: 6, date: "2026-07-01" },
    { id: "5", exercise: "Squat", weight: 85, sets: 4, reps: 6, date: "2026-07-08" },
    { id: "6", exercise: "Squat", weight: 90, sets: 4, reps: 6, date: "2026-07-15" },
    { id: "7", exercise: "Deadlift", weight: 100, sets: 3, reps: 5, date: "2026-07-01" },
    { id: "8", exercise: "Deadlift", weight: 105, sets: 3, reps: 5, date: "2026-07-08" },
    { id: "9", exercise: "Deadlift", weight: 110, sets: 3, reps: 5, date: "2026-07-15" },
  ]);
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("8");
  const [date, setDate] = useState(dateKey(new Date()));
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  const addEntry = useCallback(() => {
    const w = parseFloat(weight);
    const s = parseInt(sets);
    const r = parseInt(reps);
    if (!exercise.trim() || isNaN(w) || isNaN(s) || isNaN(r) || w <= 0 || s <= 0 || r <= 0) return;
    const entry: LiftEntry = {
      id: createId(),
      exercise: exercise.trim(),
      weight: w,
      sets: s,
      reps: r,
      date,
    };
    setEntries((prev) => [...prev, entry]);
    setWeight("");
  }, [exercise, weight, sets, reps, date]);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const exerciseNames = useMemo(() => {
    const names = new Set(entries.map((e) => e.exercise));
    return Array.from(names).sort();
  }, [entries]);

  const exerciseData = useMemo(() => {
    const data: Record<string, LiftEntry[]> = {};
    for (const name of exerciseNames) {
      data[name] = entries
        .filter((e) => e.exercise === name)
        .sort((a, b) => a.date.localeCompare(b.date));
    }
    return data;
  }, [entries, exerciseNames]);

  const exerciseStats = useMemo(() => {
    return exerciseNames.map((name) => {
      const lifts = exerciseData[name];
      if (!lifts || lifts.length === 0)
        return { name, improvement: 0, firstWeight: 0, lastWeight: 0, sessions: 0 };
      const first = lifts[0].weight;
      const last = lifts[lifts.length - 1].weight;
      const improvement = first > 0 ? ((last - first) / first) * 100 : 0;
      return {
        name,
        improvement: Math.round(improvement * 10) / 10,
        firstWeight: first,
        lastWeight: last,
        sessions: lifts.length,
      };
    });
  }, [exerciseNames, exerciseData]);

  const maxWeight = useMemo(() => {
    let m = 0;
    for (const e of entries) m = Math.max(m, e.weight);
    return m;
  }, [entries]);

  return (
    <ToolLayout id="progressive-overload-tracker">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Exercise
          </span>
          <input
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="e.g. Bench Press"
            list="exercise-suggestions"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: exercise ? color : undefined }}
          />
          <datalist id="exercise-suggestions">
            {exerciseNames.map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Weight (kg)
          </span>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="80"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: weight ? color : undefined }}
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Sets
          </span>
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            placeholder="3"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          />
        </div>
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Reps
          </span>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="8"
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Date
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
          />
        </div>
        <div className="flex items-end">
          <ToolButton onClick={addEntry} disabled={!exercise.trim() || !weight}>
            Add Entry
          </ToolButton>
        </div>
      </div>

      {exerciseStats.length > 0 && (
        <div>
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Progression Summary
          </span>
          <div className="space-y-2">
            {exerciseStats.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-3 rounded-md border-2 bg-input-bg px-3 py-2 cursor-pointer transition-all"
                style={{ borderColor: selectedExercise === s.name ? color : "var(--border)" }}
                onClick={() => setSelectedExercise(selectedExercise === s.name ? null : s.name)}
              >
                <span className="min-w-[100px] font-mono text-xs font-bold text-input-text">
                  {s.name}
                </span>
                <span className="font-mono text-xs text-muted">
                  {s.firstWeight}kg → {s.lastWeight}kg
                </span>
                <span
                  className="ml-auto font-mono text-xs font-bold"
                  style={{ color: s.improvement >= 0 ? "#10b981" : "#ef4444" }}
                >
                  {s.improvement >= 0 ? "+" : ""}
                  {s.improvement}%
                </span>
                <span className="font-mono text-[10px] text-muted">{s.sessions} sessions</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedExercise && exerciseData[selectedExercise] && (
        <div>
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            {selectedExercise} - Weight Progression
          </span>
          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="flex items-end gap-1" style={{ height: 120 }}>
              {exerciseData[selectedExercise].map((entry) => {
                const height = maxWeight > 0 ? (entry.weight / maxWeight) * 100 : 0;
                return (
                  <div key={entry.id} className="flex flex-1 flex-col items-center gap-1">
                    <span className="font-mono text-[9px] font-bold" style={{ color }}>
                      {entry.weight}
                    </span>
                    <div
                      className="w-full rounded-t-sm transition-all"
                      style={{ height: `${height}%`, backgroundColor: color, minHeight: 4 }}
                    />
                    <span className="font-mono text-[8px] text-muted">{entry.date.slice(5)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          All Entries ({entries.length})
        </span>
        <div className="max-h-[300px] space-y-1 overflow-y-auto">
          {entries
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-md border border-line bg-paper-dim/10 px-3 py-1.5"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted">{entry.date}</span>
                  <span className="font-mono text-xs font-bold text-input-text">
                    {entry.exercise}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs" style={{ color }}>
                    {entry.weight}kg
                  </span>
                  <span className="font-mono text-[10px] text-muted">
                    {entry.sets}x{entry.reps}
                  </span>
                  <button
                    onClick={() => removeEntry(entry.id)}
                    className="text-xs text-muted hover:text-foreground"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {entries.length === 0 && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Add your first lifting entry above to start tracking progressive overload
        </div>
      )}
    </ToolLayout>
  );
}
