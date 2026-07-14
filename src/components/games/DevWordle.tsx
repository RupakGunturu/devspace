import { useEffect, useMemo, useState } from "react";
import { useSaveGameScore } from "@/hooks/useSaveGameScore";

const WORDS = [
  "REACT", "ASYNC", "MERGE", "BUILD", "CACHE", "STACK", "QUEUE", "MODEL",
  "PROXY", "SHELL", "ROUTE", "TOKEN", "REDUX", "SWIFT", "SCOPE", "MUTEX",
  "LINUX", "PATCH", "NPMJS",
];

type Verdict = "hit" | "near" | "miss";

function verdict(guess: string, answer: string): Verdict[] {
  const res: Verdict[] = Array(5).fill("miss");
  const answerArr = answer.split("");
  const used = Array(5).fill(false);
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answerArr[i]) {
      res[i] = "hit";
      used[i] = true;
    }
  }
  for (let i = 0; i < 5; i++) {
    if (res[i] === "hit") continue;
    const idx = answerArr.findIndex((c, j) => !used[j] && c === guess[i]);
    if (idx !== -1) {
      res[i] = "near";
      used[idx] = true;
    }
  }
  return res;
}

function tileClass(v?: Verdict) {
  if (v === "hit") return "bg-yellow border-yellow text-ink";
  if (v === "near") return "bg-coral border-coral text-ink";
  if (v === "miss") return "bg-line border-line text-foreground";
  return "border-line text-foreground";
}

const KEYS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

export function DevWordle() {
  const { save } = useSaveGameScore();
  const [answer, setAnswer] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [message, setMessage] = useState("");

  const done = guesses.includes(answer) || guesses.length >= 6;

  useEffect(() => {
    if (done) {
      const won = guesses.includes(answer);
      save("devwordle", won ? 100 + (6 - guesses.length) * 50 : 0, 0);
    }
  }, [done]);

  const keyState = useMemo(() => {
    const state: Record<string, Verdict> = {};
    for (const g of guesses) {
      const v = verdict(g, answer);
      for (let i = 0; i < 5; i++) {
        const c = g[i];
        const cur = state[c];
        const next = v[i];
        if (cur === "hit") continue;
        if (cur === "near" && next === "miss") continue;
        state[c] = next;
      }
    }
    return state;
  }, [guesses, answer]);

  const submit = () => {
    if (current.length !== 5) {
      setMessage("5 letters, please.");
      return;
    }
    setGuesses((g) => [...g, current]);
    setCurrent("");
    setMessage("");
  };

  const press = (k: string) => {
    if (done) return;
    if (k === "ENTER") return submit();
    if (k === "BACK") return setCurrent((c) => c.slice(0, -1));
    if (current.length < 5) setCurrent((c) => (c + k).slice(0, 5));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done) return;
      if (e.key === "Enter") submit();
      else if (e.key === "Backspace") setCurrent((c) => c.slice(0, -1));
      else if (/^[a-zA-Z]$/.test(e.key)) setCurrent((c) => (c + e.key.toUpperCase()).slice(0, 5));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, done]);

  const reset = () => {
    let next = WORDS[Math.floor(Math.random() * WORDS.length)];
    if (WORDS.length > 1) while (next === answer) next = WORDS[Math.floor(Math.random() * WORDS.length)];
    setAnswer(next);
    setGuesses([]);
    setCurrent("");
    setMessage("");
  };

  const rows: (string | undefined)[] = Array(6)
    .fill(undefined)
    .map((_, i) => (i < guesses.length ? guesses[i] : i === guesses.length ? current : undefined));

  return (
    <div className="space-y-4">
      <div className="text-center font-mono text-xs text-muted">
        guess the 5-letter dev term · {6 - guesses.length} guesses left
      </div>
      <div className="mx-auto grid w-fit gap-1.5">
        {rows.map((row, ri) => {
          const isSubmitted = ri < guesses.length;
          const v = isSubmitted ? verdict(row!, answer) : undefined;
          return (
            <div key={ri} className="flex gap-1.5">
              {Array.from({ length: 5 }).map((_, ci) => {
                const c = row?.[ci] ?? "";
                return (
                  <div
                    key={ci}
                    className={`flex h-11 w-11 items-center justify-center border-2 font-display text-xl font-bold ${tileClass(v?.[ci])}`}
                  >
                    {c}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {message && <div className="text-center font-mono text-xs text-coral">{message}</div>}

      {!done && (
        <div className="space-y-1.5">
          {KEYS.map((row, ri) => (
            <div key={ri} className="flex justify-center gap-1">
              {ri === 2 && (
                <button
                  onClick={() => press("ENTER")}
                  className="rounded-sm border-2 border-line bg-line px-2 py-2 font-mono text-[10px] font-bold text-foreground"
                >
                  ENTER
                </button>
              )}
              {row.split("").map((k) => (
                <button
                  key={k}
                  onClick={() => press(k)}
                  className={`min-w-[26px] rounded-sm border-2 px-1.5 py-2 font-mono text-xs font-bold ${tileClass(keyState[k])}`}
                >
                  {k}
                </button>
              ))}
              {ri === 2 && (
                <button
                  onClick={() => press("BACK")}
                  className="rounded-sm border-2 border-line bg-line px-2 py-2 font-mono text-[10px] font-bold text-foreground"
                >
                  ⌫
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {done && (
        <div className="rounded-sm border-2 border-line bg-ink p-4 text-center text-text">
          {guesses.includes(answer) ? (
            <div className="font-display text-xl font-bold text-yellow">Got it — {answer}</div>
          ) : (
            <div className="font-display text-xl font-bold text-coral">Word was {answer}</div>
          )}
          <button
            onClick={reset}
            className="mt-3 rounded-sm border-2 border-yellow bg-yellow px-4 py-2 font-mono text-sm font-bold text-ink"
            style={{ boxShadow: "3px 3px 0 var(--coral)" }}
          >
            play again
          </button>
        </div>
      )}
    </div>
  );
}
