import { useEffect, useMemo, useRef, useState } from "react";
import { useSaveGameScore } from "@/hooks/useSaveGameScore";

type Snippet = {
  lines: string[];
  bug: number; // 0-indexed line
  hint: string;
};

const SNIPPETS: Snippet[] = [
  {
    lines: [
      "function sum(arr) {",
      "  let total = 0;",
      "  for (let i = 0; i <= arr.length; i++) {",
      "    total += arr[i];",
      "  }",
      "  return total;",
      "}",
    ],
    bug: 2,
    hint: "off-by-one",
  },
  {
    lines: [
      "const users = await fetch('/api/users');",
      "const data = users.json();",
      "console.log(data.length);",
    ],
    bug: 1,
    hint: "missing await",
  },
  {
    lines: [
      "function isAdult(age) {",
      "  if (age > 18) {",
      "    return true;",
      "  }",
      "  return false;",
      "}",
    ],
    bug: 1,
    hint: "should be >=",
  },
  {
    lines: [
      "const arr = [1, 2, 3];",
      "arr.forEach((n) => {",
      "  return n * 2;",
      "});",
      "console.log(arr);",
    ],
    bug: 1,
    hint: "forEach doesn't return; use map",
  },
  {
    lines: [
      "function greet(name = 'friend') {",
      "  console.log('Hi, ' + Name);",
      "}",
      "greet('Ada');",
    ],
    bug: 1,
    hint: "capitalized Name",
  },
  {
    lines: [
      "const nums = [10, 5, 2, 30];",
      "nums.sort();",
      "console.log(nums[0]);",
    ],
    bug: 1,
    hint: "sort() is lexicographic by default",
  },
  {
    lines: [
      "let count = 0;",
      "const btn = document.querySelector('#go');",
      "btn.addEventListener('click', () => count++);",
      "console.log(count);",
    ],
    bug: 3,
    hint: "reads count before click happens",
  },
  {
    lines: [
      "function divide(a, b) {",
      "  return a / b;",
      "}",
      "divide(10);",
    ],
    bug: 3,
    hint: "b is undefined → NaN",
  },
];

export function BugFinder() {
  const { save } = useSaveGameScore();
  const [round, setRound] = useState(0);
  const [snippetIdx, setSnippetIdx] = useState(() => Math.floor(Math.random() * SNIPPETS.length));
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<"playing" | "won" | "lost" | "timeout">("playing");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const snippet = SNIPPETS[snippetIdx];

  useEffect(() => {
    if (status !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setStatus("timeout");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, round]);

  const guess = (lineIdx: number) => {
    if (status !== "playing") return;
    if (lineIdx === snippet.bug) {
      setScore((s) => s + Math.max(10, timeLeft * 5));
      setStatus("won");
      save("bug-finder", Math.max(10, timeLeft * 5), 0);
    } else {
      setStatus("lost");
    }
  };

  const next = () => {
    let ni = Math.floor(Math.random() * SNIPPETS.length);
    if (SNIPPETS.length > 1) while (ni === snippetIdx) ni = Math.floor(Math.random() * SNIPPETS.length);
    setSnippetIdx(ni);
    setTimeLeft(30);
    setStatus("playing");
    setRound((r) => r + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between font-mono text-sm">
        <div>
          score: <span className="font-bold text-coral">{score}</span>
        </div>
        <div>
          time:{" "}
          <span className={`font-bold ${timeLeft <= 5 ? "text-coral" : ""}`}>{timeLeft}s</span>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border-2 border-ink bg-ink">
        {snippet.lines.map((line, i) => {
          const highlight =
            status !== "playing" && i === snippet.bug ? "bg-coral text-ink" : "";
          return (
            <button
              key={i}
              disabled={status !== "playing"}
              onClick={() => guess(i)}
              className={`flex w-full items-start gap-3 border-b border-line/40 px-3 py-2 text-left font-mono text-sm text-text hover:bg-line/50 disabled:cursor-default ${highlight}`}
            >
              <span className="w-5 shrink-0 select-none text-right text-muted">{i + 1}</span>
              <span className="whitespace-pre">{line}</span>
            </button>
          );
        })}
      </div>
      {status !== "playing" && (
        <div className="rounded-sm border-2 border-line bg-ink p-4 text-text">
          {status === "won" && (
            <div>
              <div className="font-display text-xl font-bold text-yellow">Nice — bug spotted.</div>
              <div className="mt-1 font-mono text-sm text-muted">Hint was: {snippet.hint}</div>
            </div>
          )}
          {status === "lost" && (
            <div>
              <div className="font-display text-xl font-bold text-coral">Not that one.</div>
              <div className="mt-1 font-mono text-sm text-muted">
                The bug was on line {snippet.bug + 1}: {snippet.hint}
              </div>
            </div>
          )}
          {status === "timeout" && (
            <div>
              <div className="font-display text-xl font-bold text-coral">Time's up.</div>
              <div className="mt-1 font-mono text-sm text-muted">
                Line {snippet.bug + 1} — {snippet.hint}
              </div>
            </div>
          )}
          <button
            onClick={next}
            className="mt-4 rounded-sm border-2 border-yellow bg-yellow px-4 py-2 font-mono text-sm font-bold text-ink"
            style={{ boxShadow: "3px 3px 0 var(--coral)" }}
          >
            next round →
          </button>
        </div>
      )}
    </div>
  );
}
