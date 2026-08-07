import { useState, useRef, useCallback, useEffect } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

export function BpmTapTempo() {
  const [taps, setTaps] = useState<number[]>([]);
  const [bpm, setBpm] = useState(0);
  const [lastTap, setLastTap] = useState(0);
  const { color } = useToolAccent();
  const beatRef = useRef<HTMLDivElement>(null);

  const handleTap = useCallback(() => {
    const now = performance.now();
    setTaps((prev) => {
      const newTaps = [...prev, now].slice(-20);
      if (newTaps.length >= 2) {
        const intervals: number[] = [];
        for (let i = 1; i < newTaps.length; i++) {
          intervals.push(newTaps[i] - newTaps[i - 1]);
        }
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        setBpm(Math.round(60000 / avgInterval));
      }
      return newTaps;
    });
    setLastTap(now);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleTap]);

  useEffect(() => {
    if (bpm === 0) return;
    const interval = 60000 / bpm;
    const timer = setInterval(() => {
      if (beatRef.current) {
        beatRef.current.style.transform = "scale(1.3)";
        beatRef.current.style.backgroundColor = color;
        setTimeout(() => {
          if (beatRef.current) {
            beatRef.current.style.transform = "scale(1)";
            beatRef.current.style.backgroundColor = `${color}40`;
          }
        }, 100);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [bpm, color]);

  const reset = () => {
    setTaps([]);
    setBpm(0);
    setLastTap(0);
  };

  const recentIntervals = taps.length >= 2
    ? taps.slice(-5).reduce<{ interval: number; bpm: number }[]>((acc, t, i, arr) => {
        if (i > 0) {
          const interval = t - arr[i - 1];
          acc.push({ interval: Math.round(interval), bpm: Math.round(60000 / interval) });
        }
        return acc;
      }, [])
    : [];

  return (
    <ToolLayout id="bpm-tap-tempo">
      <div className="flex flex-col items-center gap-6">
        <div
          ref={beatRef}
          onClick={handleTap}
          className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-full border-4 transition-all active:scale-95"
          style={{
            borderColor: color,
            backgroundColor: `${color}40`,
            transform: "scale(1)",
          }}
        >
          <span className="font-mono text-sm font-bold" style={{ color }}>
            TAP
          </span>
        </div>

        <div className="text-center">
          <p className="font-mono text-5xl font-bold" style={{ color }}>
            {bpm || "—"}
          </p>
          <p className="font-mono text-xs uppercase text-muted">BPM</p>
        </div>

        {bpm > 0 && (
          <div className="flex items-center gap-3">
            <div
              className="h-4 w-4 rounded-full"
              style={{
                backgroundColor: color,
                animation: `pulse ${60 / bpm}s ease-in-out infinite`,
              }}
            />
            <span className="font-mono text-xs text-muted">
              {Math.round(60 / bpm * 1000)}ms interval
            </span>
          </div>
        )}

        {recentIntervals.length > 0 && (
          <div className="w-full">
            <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Recent Taps
            </p>
            <div className="flex gap-2 overflow-x-auto">
              {recentIntervals.map((r, i) => (
                <div
                  key={i}
                  className="shrink-0 rounded-md border-2 border-line bg-input-bg px-3 py-2 text-center"
                >
                  <p className="font-mono text-sm font-bold" style={{ color }}>{r.bpm}</p>
                  <p className="font-mono text-[10px] text-muted">{r.interval}ms</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="rounded-md border-2 border-line px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-foreground hover:text-foreground"
          >
            Reset
          </button>
          {bpm > 0 && (
            <span className="rounded-md border-2 border-line px-4 py-2 font-mono text-xs text-muted">
              {taps.length} taps
            </span>
          )}
        </div>

        <p className="font-mono text-[10px] text-muted">
          Press Space or click the button to tap
        </p>
      </div>
    </ToolLayout>
  );
}
