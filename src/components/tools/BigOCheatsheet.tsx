import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";

interface ComplexityEntry {
  notation: string;
  name: string;
  description: string;
  examples: string[];
  scale: number;
}

const COMPLEXITIES: ComplexityEntry[] = [
  {
    notation: "O(1)",
    name: "Constant",
    description: "Doesn't depend on input size. Flat performance.",
    examples: ["Array index access", "Hash map lookup", "Push/Pop on stack"],
    scale: 1,
  },
  {
    notation: "O(log n)",
    name: "Logarithmic",
    description: "Doubles input, adds one step. Very efficient.",
    examples: ["Binary search", "Balanced BST operations", "Exponentiation by squaring"],
    scale: 4,
  },
  {
    notation: "O(n)",
    name: "Linear",
    description: "Scales directly with input size.",
    examples: ["Linear search", "Array traversal", "Find min/max"],
    scale: 8,
  },
  {
    notation: "O(n log n)",
    name: "Linearithmic",
    description: "Slightly worse than linear. Best comparison sort bound.",
    examples: ["Merge sort", "Quick sort (avg)", "Heap sort"],
    scale: 14,
  },
  {
    notation: "O(n^2)",
    name: "Quadratic",
    description: "Doubles input → 4x operations. Nested loops.",
    examples: ["Bubble sort", "Selection sort", "All pairs comparison"],
    scale: 24,
  },
  {
    notation: "O(2^n)",
    name: "Exponential",
    description: "Adds one input → doubles time. Avoid.",
    examples: ["Fibonacci (naive)", "Subset enumeration", "Tower of Hanoi"],
    scale: 38,
  },
  {
    notation: "O(n!)",
    name: "Factorial",
    description: "Permutes all elements. Explosive growth.",
    examples: ["Traveling salesman (brute)", "Permutation generation", "N-Queens (backtrack)"],
    scale: 50,
  },
];

const MAX_BAR = 50;

function computeOps(n: number, notation: string): number {
  switch (notation) {
    case "O(1)":
      return 1;
    case "O(log n)":
      return Math.max(1, Math.ceil(Math.log2(n)));
    case "O(n)":
      return n;
    case "O(n log n)":
      return Math.ceil(n * Math.log2(Math.max(2, n)));
    case "O(n^2)":
      return n * n;
    case "O(2^n)":
      return Math.min(2 ** Math.min(n, 30), 1e12);
    case "O(n!)": {
      let r = 1;
      for (let i = 2; i <= Math.min(n, 20); i++) r *= i;
      return Math.min(r, 1e12);
    }
    default:
      return 0;
  }
}

function formatOps(ops: number): string {
  if (ops >= 1e12) return "> 1 trillion";
  if (ops >= 1e9) return `${(ops / 1e9).toFixed(1)}B`;
  if (ops >= 1e6) return `${(ops / 1e6).toFixed(1)}M`;
  if (ops >= 1e3) return `${(ops / 1e3).toFixed(1)}K`;
  return String(ops);
}

export function BigOCheatsheet() {
  const { color } = useToolAccent();
  const [arraySize, setArraySize] = useState(16);
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    return COMPLEXITIES.filter(
      (c) =>
        c.notation.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.examples.some((e) => e.toLowerCase().includes(q)),
    );
  }, [filter]);

  return (
    <ToolLayout id="big-o-cheatsheet">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Search complexity
        </label>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="e.g. quadratic, O(n^2), binary search..."
          className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none placeholder:text-muted focus:border-accent"
          style={{ ["--tw-ring-color" as string]: color }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = color;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "";
          }}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Array size: n = {arraySize}
          </span>
          <span className="font-mono text-xs text-muted">{arraySize} elements</span>
        </div>
        <input
          type="range"
          min={1}
          max={64}
          value={arraySize}
          onChange={(e) => setArraySize(Number(e.target.value))}
          className="w-full accent-current"
          style={{ accentColor: color }}
        />
        <div className="mt-1 flex justify-between font-mono text-[10px] text-muted">
          <span>1</span>
          <span>16</span>
          <span>32</span>
          <span>48</span>
          <span>64</span>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted py-8">No matching complexities found.</p>
        )}
        {filtered.map((entry) => {
          const ops = computeOps(arraySize, entry.notation);
          const barWidth = Math.max(2, (entry.scale / MAX_BAR) * 100);
          return (
            <div
              key={entry.notation}
              className="rounded-lg border-2 border-line bg-input-bg p-4 transition-all hover:border-accent"
              style={{ ["--accent" as string]: color }}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <span className="mr-2 font-mono text-lg font-bold" style={{ color }}>
                    {entry.notation}
                  </span>
                  <span className="text-sm text-foreground">{entry.name}</span>
                </div>
                <span className="rounded-full border border-line px-2 py-0.5 font-mono text-xs text-muted">
                  n={arraySize} → {formatOps(ops)} ops
                </span>
              </div>
              <p className="mb-3 text-sm text-muted">{entry.description}</p>
              <div className="mb-3 h-4 w-full overflow-hidden rounded-full bg-paper-dim/50">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${barWidth}%`, backgroundColor: color }}
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {entry.examples.map((ex) => (
                  <span
                    key={ex}
                    className="rounded-md border border-line bg-paper-dim/30 px-2 py-0.5 font-mono text-[11px] text-muted"
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border-2 border-line bg-input-bg p-4">
        <span className="mb-3 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Growth comparison at n = {arraySize}
        </span>
        <div className="space-y-2">
          {COMPLEXITIES.map((entry) => {
            const ops = computeOps(arraySize, entry.notation);
            const maxOps = computeOps(arraySize, "O(n^2)");
            const barPct =
              maxOps > 0 ? Math.max(1, (Math.log10(ops + 1) / Math.log10(maxOps + 1)) * 100) : 1;
            return (
              <div key={entry.notation} className="flex items-center gap-2">
                <span
                  className="w-16 shrink-0 text-right font-mono text-xs font-bold"
                  style={{ color }}
                >
                  {entry.notation}
                </span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-paper-dim/30">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, barPct)}%`,
                      backgroundColor: color,
                      opacity: 0.7,
                    }}
                  />
                </div>
                <span className="w-16 shrink-0 font-mono text-[10px] text-muted">
                  {formatOps(ops)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
