import { useMemo, useState } from "react";

type Q = { q: string; choices: string[]; answer: number };

const QUESTIONS: Q[] = [
  { q: "What does CSS stand for?", choices: ["Creative Style Syntax", "Cascading Style Sheets", "Computed Style Sheet", "Coded Style System"], answer: 1 },
  { q: "Which HTTP status means 'I'm a teapot'?", choices: ["402", "418", "451", "503"], answer: 1 },
  { q: "In Big-O, what's the time complexity of binary search?", choices: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 1 },
  { q: "Which one is NOT a JavaScript primitive?", choices: ["string", "number", "object", "symbol"], answer: 2 },
  { q: "What does DOM stand for?", choices: ["Document Object Model", "Data Object Map", "Direct Object Method", "Display Order Manager"], answer: 0 },
  { q: "Which git command creates a new branch and switches to it?", choices: ["git branch -m", "git checkout -b", "git switch --new", "git new"], answer: 1 },
  { q: "TCP is which layer of the OSI model?", choices: ["Network", "Transport", "Session", "Application"], answer: 1 },
  { q: "Which of these is a NoSQL database?", choices: ["Postgres", "SQLite", "MongoDB", "MySQL"], answer: 2 },
  { q: "What port does HTTPS use by default?", choices: ["80", "443", "8080", "22"], answer: 1 },
  { q: "Which JS keyword makes a block-scoped constant?", choices: ["var", "let", "const", "static"], answer: 2 },
  { q: "React's useEffect runs when?", choices: ["Before render", "During render", "After commit", "Never"], answer: 2 },
  { q: "SQL: which clause filters after GROUP BY?", choices: ["WHERE", "HAVING", "ORDER BY", "LIMIT"], answer: 1 },
  { q: "Which HTTP method is idempotent?", choices: ["POST", "PUT", "PATCH", "None"], answer: 1 },
  { q: "What does JSON stand for?", choices: ["Java Standard Object Notation", "JavaScript Object Notation", "Joined Serial Object Nest", "JS Ordered Notation"], answer: 1 },
  { q: "Which sort has the best average-case time?", choices: ["Bubble sort", "Insertion sort", "Merge sort", "Selection sort"], answer: 2 },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function DevTrivia() {
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => shuffle(QUESTIONS).slice(0, 10), [seed]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const q = questions[idx];
  const done = idx >= questions.length;

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  };
  const next = () => {
    setPicked(null);
    setIdx((i) => i + 1);
  };
  const reset = () => {
    setSeed((s) => s + 1);
    setIdx(0);
    setPicked(null);
    setScore(0);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="space-y-4 text-center">
        <div className="font-mono text-xs text-muted">final score</div>
        <div className="font-display text-6xl font-extrabold text-yellow">
          {score}/{questions.length}
        </div>
        <div className="font-mono text-sm text-muted">{pct}% — {pct >= 80 ? "solid" : pct >= 50 ? "not bad" : "we'll get 'em next time"}</div>
        <button
          onClick={reset}
          className="rounded-sm border-2 border-yellow bg-yellow px-6 py-3 font-mono text-sm font-bold text-ink"
          style={{ boxShadow: "4px 4px 0 var(--coral)" }}
        >
          play again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between font-mono text-xs text-muted">
        <span>question {idx + 1} of {questions.length}</span>
        <span>score: <span className="font-bold text-coral">{score}</span></span>
      </div>
      <div className="rounded-sm border-2 border-line bg-ink p-5">
        <div className="font-display text-xl font-bold text-text">{q.q}</div>
      </div>
      <div className="grid gap-2">
        {q.choices.map((c, i) => {
          const isRight = picked !== null && i === q.answer;
          const isWrongPick = picked === i && i !== q.answer;
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={picked !== null}
              className={`rounded-sm border-2 p-3 text-left font-mono text-sm transition ${
                isRight
                  ? "border-yellow bg-yellow text-ink"
                  : isWrongPick
                  ? "border-coral bg-coral text-ink"
                  : "border-line bg-ink text-text hover:border-yellow"
              }`}
            >
              <span className="mr-2 text-muted">{String.fromCharCode(65 + i)}.</span>
              {c}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <button
          onClick={next}
          className="w-full rounded-sm border-2 border-yellow bg-yellow px-4 py-3 font-mono text-sm font-bold text-ink"
          style={{ boxShadow: "3px 3px 0 var(--coral)" }}
        >
          next →
        </button>
      )}
    </div>
  );
}
