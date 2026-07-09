import { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolButton } from "../ToolButton";

export default function PomodoroTimer() {
  const [workMin, setWorkMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(workMin * 60);
  }, [workMin]);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          if (!isBreak) {
            setSessions((s) => s + 1);
            setIsBreak(true);
            return breakMin * 60;
          } else {
            setIsBreak(false);
            return workMin * 60;
          }
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, isBreak, workMin, breakMin]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = isBreak
    ? ((breakMin * 60 - timeLeft) / (breakMin * 60)) * 100
    : ((workMin * 60 - timeLeft) / (workMin * 60)) * 100;

  return (
    <ToolLayout id="pomodoro-timer">
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Work (min)</label>
          <input type="number" value={workMin} onChange={(e) => { setWorkMin(Number(e.target.value)); if (!isRunning) setTimeLeft(Number(e.target.value) * 60); }} min={1} max={60} className="w-20 p-2 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Break (min)</label>
          <input type="number" value={breakMin} onChange={(e) => setBreakMin(Number(e.target.value))} min={1} max={30} className="w-20 p-2 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 py-8">
        <span className={`text-xs uppercase tracking-widest font-medium ${isBreak ? "text-coral" : "text-yellow"}`}>
          {isBreak ? "Break Time" : "Focus Time"}
        </span>
        <span className="font-mono text-6xl md:text-8xl font-bold text-foreground tabular-nums">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
        <div className="w-64 h-2 bg-paper-dim rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${isBreak ? "bg-coral" : "bg-yellow"}`} style={{ width: `${progress}%` }} />
        </div>
        <span className="text-sm text-muted-foreground">Sessions completed: {sessions}</span>
      </div>
      <div className="flex justify-center gap-3">
        <ToolButton onClick={() => setIsRunning(!isRunning)}>{isRunning ? "Pause" : "Start"}</ToolButton>
        <ToolButton onClick={reset} variant="secondary">Reset</ToolButton>
      </div>
    </ToolLayout>
  );
}
