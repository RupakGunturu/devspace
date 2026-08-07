import { useCallback, useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseInput(raw: string): Map<string, number> {
  const map = new Map<string, number>();
  const lines = raw.split(/[,\n]+/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    const match = line.match(/^(\d{4}-\d{2}-\d{2})\s*[=:]\s*(\d+)$/);
    if (match) {
      const date = match[1];
      const count = parseInt(match[2], 10);
      map.set(date, (map.get(date) ?? 0) + count);
      continue;
    }
    const altMatch = line.match(/^(\d+)\s* problems?$/i);
    if (altMatch) {
      const d = new Date();
      d.setDate(d.getDate() - map.size);
      map.set(dateKey(d), parseInt(altMatch[1], 10));
    }
  }
  return map;
}

function getMonthName(monthIndex: number): string {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][monthIndex];
}

export function LeetcodeStreakVisualizer() {
  const { color } = useToolAccent();
  const [raw, setRaw] = useState(() => {
    const lines: string[] = [];
    for (let i = 0; i < 60; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const count = i < 5 ? Math.floor(Math.random() * 4) : Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : 0;
      if (count > 0) lines.push(`${dateKey(d)}: ${count}`);
    }
    return lines.join("\n");
  });

  const data = useMemo(() => parseInput(raw), [raw]);

  const stats = useMemo(() => {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let total = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = dateKey(d);
      const count = data.get(key) ?? 0;
      total += count;
      if (count > 0) {
        tempStreak++;
        if (i === currentStreak) currentStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    const avg = data.size > 0 ? (total / data.size).toFixed(1) : "0";

    const monthly: { month: string; total: number }[] = [];
    const monthMap = new Map<string, number>();
    for (const [key, count] of data) {
      const d = new Date(key);
      const mk = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthMap.set(mk, (monthMap.get(mk) ?? 0) + count);
    }
    const sorted = [...monthMap.entries()].sort((a, b) => b[0].localeCompare(a[0]));
    for (const [mk, total] of sorted) {
      const [y, m] = mk.split("-");
      monthly.push({ month: `${getMonthName(parseInt(m, 10) - 1)} ${y}`, total });
    }

    return { currentStreak, longestStreak, total, avg, monthly };
  }, [data]);

  const calendar = useMemo(() => {
    const weeks: { date: Date; count: number; key: string }[][] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);
    const dayOfWeek = startDate.getDay();
    const firstWeek: { date: Date; count: number; key: string }[] = [];
    for (let i = 0; i < dayOfWeek; i++) {
      const filler = new Date(startDate);
      filler.setDate(filler.getDate() - (dayOfWeek - i));
      firstWeek.push({ date: filler, count: -1, key: dateKey(filler) });
    }
    for (let i = 0; i < 365; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = dateKey(d);
      firstWeek.push({ date: d, count: data.get(key) ?? 0, key });
      if (firstWeek.length === 7) {
        weeks.push(firstWeek);
        firstWeek.length = 0;
      }
    }
    if (firstWeek.length > 0) {
      while (firstWeek.length < 7) {
        const last = firstWeek[firstWeek.length - 1].date;
        const filler = new Date(last);
        filler.setDate(filler.getDate() + 1);
        firstWeek.push({ date: filler, count: -1, key: dateKey(filler) });
      }
      weeks.push(firstWeek);
    }
    return weeks;
  }, [data]);

  const maxCount = useMemo(() => {
    let m = 0;
    for (const count of data.values()) m = Math.max(m, count);
    return m;
  }, [data]);

  const getColor = useCallback(
    (count: number) => {
      if (count === -1) return "transparent";
      if (count === 0) return "var(--paper-dim)";
      const intensity = maxCount > 0 ? count / maxCount : 0;
      const opacity = 0.2 + intensity * 0.8;
      return color.replace(")", `, ${opacity})`).replace("rgb", "rgba");
    },
    [color, maxCount]
  );

  return (
    <ToolLayout id="leetcode-streak-visualizer">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Input problems (format: date: count, one per line)
        </label>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={4}
          placeholder={"2026-07-20: 3\n2026-07-19: 1\n2026-07-18: 0"}
          className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none placeholder:text-muted"
          onFocus={(e) => { e.currentTarget.style.borderColor = color; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = ""; }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Current Streak", value: `${stats.currentStreak}d` },
          { label: "Longest Streak", value: `${stats.longestStreak}d` },
          { label: "Total Problems", value: String(stats.total) },
          { label: "Daily Average", value: stats.avg },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border-2 border-line bg-input-bg p-3 text-center">
            <span className="mb-1 block font-mono text-lg font-bold" style={{ color }}>
              {value}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{label}</span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          52-week activity heatmap
        </span>
        <div className="flex gap-[3px]">
          {calendar.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.key}
                  title={`${day.date.toLocaleDateString()}: ${day.count >= 0 ? day.count : ""} problems`}
                  className="h-3 w-3 rounded-[2px] transition-colors"
                  style={{ backgroundColor: getColor(day.count) }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1 text-[10px] text-muted">
          <span>Less</span>
          {[0, 0.25, 0.5, 0.75, 1].map((intensity) => (
            <div
              key={intensity}
              className="h-3 w-3 rounded-[2px]"
              style={{
                backgroundColor:
                  intensity === 0
                    ? "var(--paper-dim)"
                    : color.replace(")", `, ${0.2 + intensity * 0.8})`).replace("rgb", "rgba"),
              }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      {stats.monthly.length > 0 && (
        <div>
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Monthly breakdown
          </span>
          <div className="space-y-1.5">
            {stats.monthly.map(({ month, total: monthTotal }) => {
              const pct = stats.total > 0 ? (monthTotal / stats.total) * 100 : 0;
              return (
                <div key={month} className="flex items-center gap-2">
                  <span className="w-20 shrink-0 text-right font-mono text-xs text-muted">{month}</span>
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-paper-dim/30">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.7 }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right font-mono text-xs font-bold" style={{ color }}>
                    {monthTotal}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
