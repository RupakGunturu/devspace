import { useCallback, useEffect, useRef, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";

export function RaffleWinnerPicker() {
  const [entries, setEntries] = useState("");
  const [numWinners, setNumWinners] = useState(1);
  const [currentName, setCurrentName] = useState("");
  const [winners, setWinners] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [isPicking, setIsPicking] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { color } = useToolAccent();

  const names = entries
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const available = names.filter((n) => !winners.includes(n));

  const stopPicking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPicking(false);
    setShowResult(true);
  }, []);

  const pickWinners = () => {
    if (available.length === 0 || numWinners < 1) return;
    setWinners([]);
    setShowResult(false);
    setIsPicking(true);

    let count = 0;
    const toPick = Math.min(numWinners, available.length);
    const picked: string[] = [];

    intervalRef.current = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * names.length);
      setCurrentName(names[randomIdx]);
      count++;

      if (count >= toPick * 15) {
        const shuffled = [...available].sort(() => Math.random() - 0.5);
        picked.push(...shuffled.slice(0, toPick));
        setWinners(picked);
        setHistory((prev) => [...prev, ...picked]);
        stopPicking();
      }
    }, 50);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const reset = () => {
    setEntries("");
    setNumWinners(1);
    setCurrentName("");
    setWinners([]);
    setShowResult(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPicking(false);
  };

  const clearHistory = () => setHistory([]);

  return (
    <ToolLayout id="raffle-winner-picker">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Names / Entries (one per line)
        </label>
        <textarea
          value={entries}
          onChange={(e) => setEntries(e.target.value)}
          rows={8}
          placeholder={"Alice\nBob\nCharlie\nDiana\nEve"}
          className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-4 font-mono text-sm text-input-text outline-none placeholder:text-muted"
          style={{ borderColor: entries ? color : undefined }}
        />
      </div>

      <div className="flex items-center gap-3">
        <div>
          <label className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Number of Winners
          </label>
          <input
            type="number"
            min={1}
            max={Math.max(1, available.length)}
            value={numWinners}
            onChange={(e) => setNumWinners(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none"
          />
        </div>
        <span className="self-end font-mono text-xs text-muted">
          {names.length} entries, {available.length} remaining
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <ToolButton
          onClick={pickWinners}
          disabled={available.length === 0 || isPicking || numWinners > available.length}
        >
          {isPicking ? "Picking..." : "Pick Winner(s)"}
        </ToolButton>
        <ToolButton variant="secondary" onClick={reset}>
          Reset
        </ToolButton>
      </div>

      {isPicking && (
        <div className="rounded-lg border-2 p-8 text-center" style={{ borderColor: color }}>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
            Spinning...
          </span>
          <div className="font-display text-4xl font-extrabold text-foreground animate-pulse">
            {currentName}
          </div>
        </div>
      )}

      {showResult && winners.length > 0 && (
        <div className="space-y-2">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Winner(s)
          </span>
          {winners.map((w, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border-2 bg-input-bg px-4 py-3"
              style={{ borderColor: color }}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold"
                style={{ backgroundColor: color, color: "#fff" }}
              >
                {i + 1}
              </span>
              <span className="font-display text-xl font-extrabold text-foreground">{w}</span>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Pick History ({history.length})
            </span>
            <button
              onClick={clearHistory}
              className="font-mono text-[10px] text-muted underline transition-colors hover:text-foreground"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {history.map((h, i) => (
              <span
                key={i}
                className="rounded-full border-2 border-line bg-input-bg px-3 py-1 font-mono text-xs text-input-text"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      )}

      {names.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter names above (one per line) to get started
        </div>
      )}
    </ToolLayout>
  );
}
