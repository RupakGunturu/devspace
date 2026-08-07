import { useCallback, useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

interface Criterion {
  id: number;
  name: string;
  weight: number;
}

const LEVEL_COUNTS = [4, 5] as const;
const DEFAULT_LEVELS = ["Excellent", "Good", "Satisfactory", "Needs Improvement"];

let nextId = 1;

export function RubricBuilder() {
  const [assignment, setAssignment] = useState("");
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: nextId++, name: "Content Understanding", weight: 30 },
    { id: nextId++, name: "Critical Thinking", weight: 25 },
  ]);
  const [newName, setNewName] = useState("");
  const [newWeight, setNewWeight] = useState("20");
  const [levelCount, setLevelCount] = useState<4 | 5>(4);
  const [levelNames, setLevelNames] = useState<string[]>(DEFAULT_LEVELS);
  const [generated, setGenerated] = useState(false);
  const { color } = useToolAccent();

  const addCriterion = () => {
    const trimmed = newName.trim();
    const w = parseInt(newWeight);
    if (!trimmed || isNaN(w) || w <= 0) return;
    setCriteria((prev) => [...prev, { id: nextId++, name: trimmed, weight: w }]);
    setNewName("");
    setNewWeight("20");
  };

  const removeCriterion = (id: number) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
  };

  const updateLevelName = (index: number, val: string) => {
    setLevelNames((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const totalWeight = useMemo(() => criteria.reduce((s, c) => s + c.weight, 0), [criteria]);

  const grid = useMemo(() => {
    if (!generated) return null;
    return criteria.map((c) => ({
      ...c,
      levels: levelNames.map((name, i) => ({
        name,
        points: levelCount - i,
        description: `${name} level work for ${c.name}`,
      })),
    }));
  }, [generated, criteria, levelNames, levelCount]);

  const handleGenerate = () => {
    if (assignment.trim() && criteria.length > 0) setGenerated(true);
  };

  const fullText = useMemo(() => {
    if (!grid) return "";
    const lines = [
      `RUBRIC: ${assignment}`,
      `\nTotal Weight: ${totalWeight}%`,
      `\nPerformance Levels: ${levelNames.join(" | ")}`,
      `\n${"=".repeat(60)}`,
    ];

    grid.forEach((c) => {
      lines.push(`\n${c.name} (${c.weight}%)`);
      c.levels.forEach((l) => {
        lines.push(`  ${l.points} pts - ${l.name}: ${l.description}`);
      });
    });

    lines.push(`\n${"=".repeat(60)}`);
    lines.push(`\nScoring: Total = sum of (level points × criterion weight)`);
    lines.push(`Maximum Score: ${criteria.length * levelCount}`);

    return lines.join("\n");
  }, [grid, assignment, totalWeight, criteria, levelCount, levelNames]);

  return (
    <ToolLayout id="rubric-builder">
      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Assignment Name</span>
        <input
          value={assignment}
          onChange={(e) => setAssignment(e.target.value)}
          placeholder="e.g. Research Paper on Climate Change"
          className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          style={{ borderColor: assignment ? color : undefined }}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">Criteria</span>
          <span
            className="font-mono text-xs font-bold"
            style={{ color: totalWeight === 100 ? "#22c55e" : totalWeight > 100 ? "#ef4444" : "#f59e0b" }}
          >
            {totalWeight}% / 100%
          </span>
        </div>

        <div className="space-y-2">
          {criteria.map((c) => (
            <div key={c.id} className="flex items-center gap-2">
              <span className="flex-1 rounded-md border-2 border-line bg-input-bg px-3 py-2 font-mono text-sm text-input-text">
                {c.name}
              </span>
              <span className="w-16 rounded-md border-2 border-line bg-input-bg px-3 py-2 text-center font-mono text-sm" style={{ color }}>
                {c.weight}%
              </span>
              <button
                onClick={() => removeCriterion(c.id)}
                className="rounded-md border-2 border-line px-2 py-2 text-muted transition-colors hover:text-coral"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <div className="mt-2 flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCriterion()}
            placeholder="Criterion name..."
            className="flex-1 rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none placeholder:text-muted"
          />
          <input
            type="number"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            placeholder="Weight %"
            className="w-20 rounded-md border-2 border-line bg-input-bg p-2.5 font-mono text-sm text-input-text outline-none"
          />
          <ToolButton onClick={addCriterion} disabled={!newName.trim()}>Add</ToolButton>
        </div>
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Performance Levels ({levelCount})
        </span>
        <div className="mb-2 flex gap-2">
          {LEVEL_COUNTS.map((n) => (
            <button
              key={n}
              onClick={() => {
                setLevelCount(n);
                setLevelNames(n === 5 ? [...DEFAULT_LEVELS, "Incomplete"] : [...DEFAULT_LEVELS]);
              }}
              className="rounded-md border-2 px-4 py-2 font-mono text-sm transition-all"
              style={levelCount === n ? { borderColor: color, backgroundColor: color, color: "#fff" } : { borderColor: "var(--border)" }}
            >
              {n} Levels
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {levelNames.map((name, i) => (
            <input
              key={i}
              value={name}
              onChange={(e) => updateLevelName(i, e.target.value)}
              className="rounded-md border-2 border-line bg-input-bg px-3 py-2 font-mono text-xs text-input-text outline-none transition-colors"
              style={{ borderColor: name ? color : undefined }}
            />
          ))}
        </div>
      </div>

      <div>
        <ToolButton onClick={handleGenerate} disabled={!assignment.trim() || criteria.length === 0}>
          Generate Rubric
        </ToolButton>
      </div>

      {generated && grid && (
        <div className="space-y-4">
          <div className="rounded-md border-2 p-4" style={{ borderColor: color }}>
            <div className="font-mono text-xs uppercase tracking-wider text-muted">Rubric: {assignment}</div>
            <div className="mt-1 font-mono text-xs text-muted">{criteria.length} criteria | {levelCount} levels | Max score: {criteria.length * levelCount}</div>
          </div>

          <div className="overflow-x-auto rounded-md border-2 border-line">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b-2 border-line bg-input-bg">
                  <th className="px-3 py-2 text-left text-muted">Criterion</th>
                  <th className="px-3 py-2 text-center text-muted">Weight</th>
                  {levelNames.map((name, i) => (
                    <th key={i} className="px-3 py-2 text-center text-muted">
                      {name}<br />
                      <span style={{ color }}>{levelCount - i} pt{levelCount - i !== 1 ? "s" : ""}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grid.map((c) => (
                  <tr key={c.id} className="border-b border-line last:border-b-0">
                    <td className="px-3 py-3 font-bold text-input-text">{c.name}</td>
                    <td className="px-3 py-3 text-center" style={{ color }}>{c.weight}%</td>
                    {c.levels.map((l, li) => (
                      <td key={li} className="px-3 py-3 text-center text-input-text">
                        {l.description}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">Full Rubric</span>
              <CopyButton text={fullText} />
            </div>
            <pre className="max-h-[300px] overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-input-text">
              {fullText}
            </pre>
          </div>
        </div>
      )}

      {!generated && (
        <div className="rounded-md border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Add criteria and click Generate to create your scoring rubric
        </div>
      )}
    </ToolLayout>
  );
}
