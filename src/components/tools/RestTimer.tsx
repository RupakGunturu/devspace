import { useCallback, useEffect, useRef, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";

const PRESETS = [
  { label: "30s", seconds: 30 },
  { label: "60s", seconds: 60 },
  { label: "90s", seconds: 90 },
  { label: "120s", seconds: 120 },
  { label: "180s", seconds: 180 },
];

export function RestTimer() {
  const { color } = useToolAccent();
  const [targetSeconds, setTargetSeconds] = useState(60);
  const [customInput, setCustomInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const progress = targetSeconds > 0 ? ((targetSeconds - timeLeft) / targetSeconds) * 100 : 0;
  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference * (1 - progress / 100);

  const playBeep = useCallback(() => {
    try {
      const ctx = audioCtxRef.current || new AudioContext();
      audioCtxRef.current = ctx;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.value = 880;
      oscillator.type = "sine";
      gainNode.gain.value = 0.3;
      oscillator.start(ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (_e) {
      return;
    }
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            setIsRunning(false);
            playBeep();
            setTotalRounds((r) => r + 1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, playBeep]);

  const selectPreset = useCallback((seconds: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setTargetSeconds(seconds);
    setTimeLeft(seconds);
  }, []);

  const applyCustom = useCallback(() => {
    const val = parseInt(customInput);
    if (isNaN(val) || val <= 0) return;
    selectPreset(val);
    setCustomInput("");
  }, [customInput, selectPreset]);

  const startPause = useCallback(() => {
    if (timeLeft <= 0) {
      setTimeLeft(targetSeconds);
    }
    setIsRunning((prev) => !prev);
  }, [timeLeft, targetSeconds]);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setTimeLeft(targetSeconds);
  }, [targetSeconds]);

  const nextRound = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setRound((r) => r + 1);
    setTimeLeft(targetSeconds);
  }, [targetSeconds]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const timerColor = timeLeft <= 5 && timeLeft > 0 ? "#ef4444" : color;

  return (
    <ToolLayout id="rest-timer">
      <div>
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Presets
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.seconds}
              onClick={() => selectPreset(p.seconds)}
              className="rounded-md border-2 px-4 py-2 font-mono text-sm font-bold transition-all"
              style={
                targetSeconds === p.seconds
                  ? { borderColor: color, backgroundColor: color, color: "var(--foreground, #fff)" }
                  : { borderColor: "var(--border)", color: "var(--muted)" }
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Custom Time (seconds)
        </span>
        <div className="flex gap-2">
          <input
            type="number"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyCustom()}
            placeholder="e.g. 75"
            className="flex-1 rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
            style={{ borderColor: customInput ? color : undefined }}
          />
          <ToolButton onClick={applyCustom} disabled={!customInput} variant="secondary">
            Set
          </ToolButton>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          <svg width="160" height="160" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="4" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={timerColor}
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dashoffset 0.5s linear, stroke 0.3s" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span
              className="font-mono text-4xl font-bold tabular-nums"
              style={{ color: timerColor }}
            >
              {timeDisplay}
            </span>
            <span className="font-mono text-[10px] text-muted">{targetSeconds}s target</span>
          </div>
        </div>

        <div className="flex gap-2">
          <ToolButton onClick={startPause}>
            {isRunning ? "Pause" : timeLeft <= 0 ? "Restart" : "Start"}
          </ToolButton>
          <ToolButton variant="secondary" onClick={reset}>
            Reset
          </ToolButton>
          <ToolButton variant="secondary" onClick={nextRound}>
            Next Round
          </ToolButton>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
          <div className="font-mono text-xs uppercase tracking-wider text-muted">Current Set</div>
          <div className="mt-1 font-display text-2xl font-extrabold" style={{ color }}>
            {round}
          </div>
        </div>
        <div className="rounded-md border-2 border-line bg-input-bg p-4 text-center">
          <div className="font-mono text-xs uppercase tracking-wider text-muted">Completed</div>
          <div className="mt-1 font-display text-2xl font-extrabold text-input-text">
            {totalRounds}
          </div>
        </div>
      </div>

      <div className="rounded-md border-2 border-line bg-input-bg p-4">
        <div className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Round History
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: Math.max(totalRounds, 0) }, (_, i) => (
            <span
              key={i}
              className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-[10px] font-bold"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {i + 1}
            </span>
          ))}
          {totalRounds === 0 && (
            <span className="font-mono text-xs text-muted">No rounds completed yet</span>
          )}
        </div>
      </div>

      <div className="rounded-md border-2 border-dashed border-line p-4 font-mono text-xs leading-relaxed text-muted">
        Select a preset or enter a custom rest time. The timer will beep when complete. Use Next
        Round to increment your set counter and restart the timer.
      </div>
    </ToolLayout>
  );
}
