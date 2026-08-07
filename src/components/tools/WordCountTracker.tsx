import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";
import { AntdDatePicker } from "@/components/ui/antd-date-picker";

interface Entry {
  date: string;
  words: number;
}

export function WordCountTracker() {
  const [goal, setGoal] = useState("500");
  const [entries, setEntries] = useState<Entry[]>([
    { date: "2025-01-06", words: 320 },
    { date: "2025-01-07", words: 580 },
    { date: "2025-01-08", words: 0 },
    { date: "2025-01-09", words: 750 },
    { date: "2025-01-10", words: 420 },
    { date: "2025-01-11", words: 900 },
    { date: "2025-01-12", words: 650 },
  ]);
  const [newDate, setNewDate] = useState<Date | null>(null);
  const [newWords, setNewWords] = useState("");
  const { color } = useToolAccent();

  const goalNum = parseInt(goal) || 500;

  const addEntry = () => {
    if (!newDate || !newWords) return;
    const dateStr = newDate.toISOString().split("T")[0];
    setEntries([...entries, { date: dateStr, words: parseInt(newWords) || 0 }]);
    setNewDate(null);
    setNewWords("");
  };

  const weeklyEntries = useMemo(() => entries.slice(-7), [entries]);
  const maxWords = useMemo(
    () => Math.max(...weeklyEntries.map((e) => e.words), 1),
    [weeklyEntries],
  );

  const totalWords = useMemo(() => entries.reduce((sum, e) => sum + e.words, 0), [entries]);

  const streak = useMemo(() => {
    let count = 0;
    for (let i = entries.length - 1; i >= 0; i--) {
      if (entries[i].words >= goalNum) count++;
      else break;
    }
    return count;
  }, [entries, goalNum]);

  return (
    <ToolLayout id="word-count-tracker">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Daily Goal (words)
        </label>
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Date
          </label>
          <AntdDatePicker value={newDate} onChange={setNewDate} placeholder="Select date" />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Word Count
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={newWords}
              onChange={(e) => setNewWords(e.target.value)}
              placeholder="0"
              className="flex-1 rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none"
            />
            <button
              onClick={addEntry}
              disabled={!newDate || !newWords}
              className="rounded-md border-2 px-4 py-2 font-mono text-sm font-medium transition-all disabled:opacity-50"
              style={{ borderColor: color, backgroundColor: color, color: "#fff" }}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Weekly Bar Chart
        </span>
        <div
          className="flex items-end gap-2 rounded-md border-2 border-line bg-input-bg p-4"
          style={{ height: 180 }}
        >
          {weeklyEntries.map((e, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <span className="font-mono text-[10px] text-muted">{e.words}</span>
              <div className="w-full" style={{ height: 120 }}>
                <div
                  className="w-full rounded-t transition-all"
                  style={{
                    height: `${(e.words / maxWords) * 100}%`,
                    backgroundColor: e.words >= goalNum ? color : `${color}60`,
                    marginTop: "auto",
                  }}
                />
              </div>
              <span className="font-mono text-[9px] text-muted">
                {new Date(e.date).toLocaleDateString("en", { weekday: "short" })}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded" style={{ backgroundColor: color }} />
          <span className="font-mono text-[10px] text-muted">Met goal ({goalNum} words)</span>
          <div className="ml-2 h-3 w-3 rounded" style={{ backgroundColor: `${color}60` }} />
          <span className="font-mono text-[10px] text-muted">Below goal</span>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="rounded-md border-2 border-line bg-input-bg px-4 py-3 text-center">
          <p className="font-mono text-2xl font-bold" style={{ color }}>
            {totalWords.toLocaleString()}
          </p>
          <p className="font-mono text-[10px] uppercase text-muted">Total Words</p>
        </div>
        <div className="rounded-md border-2 border-line bg-input-bg px-4 py-3 text-center">
          <p className="font-mono text-2xl font-bold" style={{ color }}>
            {streak}
          </p>
          <p className="font-mono text-[10px] uppercase text-muted">Day Streak</p>
        </div>
        <div className="rounded-md border-2 border-line bg-input-bg px-4 py-3 text-center">
          <p className="font-mono text-2xl font-bold" style={{ color }}>
            {entries.length}
          </p>
          <p className="font-mono text-[10px] uppercase text-muted">Total Days</p>
        </div>
      </div>
    </ToolLayout>
  );
}
