import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { ToolInput } from "./ToolInput";
import { CopyButton } from "./CopyButton";
import { useToolAccent } from "@/components/ToolAccentContext";

function generateGrid(description: string): number[][] {
  const hash = description.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const grid: number[][] = [];
  for (let week = 0; week < 52; week++) {
    const row: number[] = [];
    for (let day = 0; day < 7; day++) {
      const seed = (hash + week * 7 + day) % 100;
      let level = 0;
      if (seed < 15) level = 0;
      else if (seed < 40) level = 1;
      else if (seed < 65) level = 2;
      else if (seed < 85) level = 3;
      else level = 4;
      row.push(level);
    }
    grid.push(row);
  }
  return grid;
}

const LEVELS = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

export function GithubContributionCustomizer() {
  const [desc, setDesc] = useState("");
  const { color } = useToolAccent();

  const grid = useMemo(() => (desc.trim() ? generateGrid(desc) : []), [desc]);

  const stats = useMemo(() => {
    if (grid.length === 0) return { total: 0, max: 0, active: 0 };
    let total = 0;
    let max = 0;
    let active = 0;
    for (const week of grid) {
      for (const level of week) {
        total += level;
        if (level > max) max = level;
        if (level > 0) active++;
      }
    }
    return { total, max, active };
  }, [grid]);

  const gridText = useMemo(
    () => grid.map((week) => week.map((l) => "●".repeat(l + 1)).join(" ")).join("\n"),
    [grid]
  );

  return (
    <ToolLayout id="github-contribution-customizer">
      <ToolInput
        value={desc}
        onChange={setDesc}
        label="Describe your desired pattern"
        placeholder="e.g. Heavy commits in summer, light in winter, weekly bursts..."
        rows={3}
      />

      {grid.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Contribution Grid
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {LEVELS.map((l, i) => (
                  <div key={i} className="h-3 w-3 rounded-sm" style={{ backgroundColor: l }} />
                ))}
              </div>
              <CopyButton text={gridText} />
            </div>
          </div>

          <div className="overflow-x-auto rounded-md border-2 border-line bg-input-bg p-4">
            <div className="flex gap-[3px]">
              {grid.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((level, di) => (
                    <div
                      key={di}
                      className="h-[11px] w-[11px] rounded-[2px]"
                      style={{ backgroundColor: LEVELS[level] }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-6">
            <div className="rounded-md border-2 border-line bg-input-bg px-4 py-3 text-center">
              <p className="font-mono text-2xl font-bold" style={{ color }}>
                {stats.total.toLocaleString()}
              </p>
              <p className="font-mono text-[10px] uppercase text-muted">Total Contributions</p>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg px-4 py-3 text-center">
              <p className="font-mono text-2xl font-bold" style={{ color }}>
                {stats.active}
              </p>
              <p className="font-mono text-[10px] uppercase text-muted">Active Days</p>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg px-4 py-3 text-center">
              <p className="font-mono text-2xl font-bold" style={{ color }}>
                {stats.max}
              </p>
              <p className="font-mono text-[10px] uppercase text-muted">Max Level</p>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
