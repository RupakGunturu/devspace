import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";

interface DiffLine {
  type: "same" | "added" | "removed";
  leftNum: number | null;
  rightNum: number | null;
  text: string;
}

function computeDiff(left: string, right: string): DiffLine[] {
  const leftLines = left.split("\n");
  const rightLines = right.split("\n");
  const result: DiffLine[] = [];

  const maxLen = Math.max(leftLines.length, rightLines.length);
  const lcs = lcsMatrix(leftLines, rightLines);
  let i = leftLines.length;
  let j = rightLines.length;

  const temp: DiffLine[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && leftLines[i - 1] === rightLines[j - 1]) {
      temp.unshift({ type: "same", leftNum: i, rightNum: j, text: leftLines[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
      temp.unshift({ type: "added", leftNum: null, rightNum: j, text: rightLines[j - 1] });
      j--;
    } else {
      temp.unshift({ type: "removed", leftNum: i, rightNum: null, text: leftLines[i - 1] });
      i--;
    }
  }

  let leftNum = 0;
  let rightNum = 0;
  for (const line of temp) {
    if (line.type === "same" || line.type === "removed") leftNum++;
    if (line.type === "same" || line.type === "added") rightNum++;
    result.push({
      ...line,
      leftNum: line.type === "added" ? null : leftNum,
      rightNum: line.type === "removed" ? null : rightNum,
    });
  }

  return result;
}

function lcsMatrix(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp;
}

export function DiffChecker() {
  const [left, setLeft] = useState(
    "function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet('World'));",
  );
  const [right, setRight] = useState(
    "function greet(name, greeting = 'Hello') {\n  return `${greeting}, ${name}!`;\n}\n\nconsole.log(greet('World', 'Hi'));",
  );

  const diff = useMemo(() => computeDiff(left, right), [left, right]);

  const stats = useMemo(() => {
    const added = diff.filter((d) => d.type === "added").length;
    const removed = diff.filter((d) => d.type === "removed").length;
    const same = diff.filter((d) => d.type === "same").length;
    return { added, removed, same };
  }, [diff]);

  return (
    <ToolLayout id="diff-checker">
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Original
          </label>
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            spellCheck={false}
            className="h-64 w-full resize-y rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none focus:border-accent"
            placeholder="Paste original text..."
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Modified
          </label>
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            spellCheck={false}
            className="h-64 w-full resize-y rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none focus:border-accent"
            placeholder="Paste modified text..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono">
        <span className="text-green-500">+{stats.added} added</span>
        <span className="text-red-500">-{stats.removed} removed</span>
        <span className="text-muted">{stats.same} unchanged</span>
      </div>

      <div className="overflow-auto rounded-md border-2 border-line">
        <table className="w-full font-mono text-xs">
          <tbody>
            {diff.map((line, idx) => (
              <tr
                key={idx}
                className={
                  line.type === "added"
                    ? "bg-green-500/10 text-green-600 dark:bg-green-500/5 dark:text-green-400"
                    : line.type === "removed"
                      ? "bg-red-500/10 text-red-600 dark:bg-red-500/5 dark:text-red-400"
                      : ""
                }
              >
                <td className="w-10 select-none border-r border-line px-2 py-0.5 text-right text-muted">
                  {line.leftNum ?? ""}
                </td>
                <td className="w-10 select-none border-r border-line px-2 py-0.5 text-right text-muted">
                  {line.rightNum ?? ""}
                </td>
                <td className="w-6 select-none px-2 py-0.5 text-center">
                  {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                </td>
                <td className="whitespace-pre px-2 py-0.5">{line.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolLayout>
  );
}
