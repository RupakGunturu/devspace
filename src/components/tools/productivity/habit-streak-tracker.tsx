import { useState, useEffect } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";

interface Habit { name: string; streak: number; lastCompleted: string }

export default function HabitStreakTracker() {
  const [habits, setHabits] = useState<Habit[]>(() => { try { return JSON.parse(localStorage.getItem("habits") || "[]"); } catch { return []; } });
  const [newHabit, setNewHabit] = useState("");

  useEffect(() => { localStorage.setItem("habits", JSON.stringify(habits)); }, [habits]);

  const add = () => { if (!newHabit.trim()) return; setHabits([...habits, { name: newHabit.trim(), streak: 0, lastCompleted: "" }]); setNewHabit(""); };
  const complete = (i: number) => {
    const today = new Date().toISOString().split("T")[0];
    setHabits(habits.map((h, idx) => idx === i ? { ...h, streak: h.lastCompleted === today ? h.streak : h.streak + 1, lastCompleted: today } : h));
  };
  const remove = (i: number) => setHabits(habits.filter((_, idx) => idx !== i));

  return (
    <ToolLayout id="habit-streak-tracker">
      <div className="flex gap-2">
        <input value={newHabit} onChange={(e) => setNewHabit(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="New habit..." className="flex-1 p-3 bg-paper-dim/50 border border-border rounded-sm text-sm text-foreground" />
        <ToolButton onClick={add}>Add</ToolButton>
      </div>
      <div className="space-y-1.5">
        {habits.map((h, i) => {
          const today = new Date().toISOString().split("T")[0];
          const done = h.lastCompleted === today;
          return (
            <div key={i} className="flex items-center justify-between p-3 bg-paper-dim/50 border border-border rounded-sm">
              <div><span className="text-sm font-medium text-foreground">{h.name}</span><span className="text-xs text-muted-foreground ml-2">{h.streak} day streak 🔥</span></div>
              <div className="flex gap-2">
                <button onClick={() => complete(i)} className={`px-2 py-1 text-xs rounded ${done ? "bg-coral/10 text-coral" : "bg-paper-dim text-muted-foreground hover:text-foreground"}`}>{done ? "Done ✓" : "Complete"}</button>
                <button onClick={() => remove(i)} className="text-xs text-coral hover:text-coral px-1">✕</button>
              </div>
            </div>
          );
        })}
      </div>
      {habits.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Add habits to start tracking streaks.</p>}
    </ToolLayout>
  );
}
