import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { useSaveGameScore } from "@/hooks/useSaveGameScore";

const TOTAL = 10;
const SEC = 20;

function getRange(r: number): [number, number] {
  return r < 3 ? [1, 15] : r < 7 ? [16, 63] : [64, 255];
}
function getDiff(r: number) {
  return r < 3 ? "Easy" : r < 7 ? "Medium" : "Hard";
}
function getDiffCls(r: number) {
  return r < 3 ? "d-easy" : r < 7 ? "d-medium" : "d-hard";
}
function getRoundInfo(r: number) {
  return r < 3
    ? "Numbers 1–15 (4 bits)"
    : r < 7
      ? "Numbers 16–63 (6 bits)"
      : "Numbers 64–255 (8 bits)";
}
function getMult(s: number) {
  return s >= 3 ? 2.5 : s >= 2 ? 2.0 : s >= 1 ? 1.5 : 1.0;
}

function generateNumbers(): number[] {
  const nums: number[] = [];
  for (let i = 0; i < TOTAL; i++) {
    const [mn, mx] = getRange(i);
    let n: number;
    do {
      n = Math.floor(Math.random() * (mx - mn + 1)) + mn;
    } while (nums.includes(n));
    nums.push(n);
  }
  return nums;
}

export function BinaryRace() {
  const { save } = useSaveGameScore();
  const [phase, setPhase] = useState<"intro" | "game" | "end">("intro");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SEC);
  const [answered, setAnswered] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [typed, setTyped] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [flash, setFlash] = useState(false);
  const [heroAnim, setHeroAnim] = useState<"correct" | "wrong" | null>(null);
  const [feedback, setFeedback] = useState<{ type: "win" | "lose"; html: string } | null>(null);
  const [showNext, setShowNext] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentNum = numbers[round] ?? 0;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const startGame = useCallback(() => {
    setScore(0);
    setRound(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectCount(0);
    setNumbers(generateNumbers());
    setPhase("game");
  }, []);

  useEffect(() => {
    if (phase !== "game" || round >= TOTAL) return;
    setAnswered(false);
    setHintUsed(false);
    setTyped("");
    setShowHint(false);
    setFlash(false);
    setHeroAnim(null);
    setFeedback(null);
    setShowNext(false);
    setTimeLeft(SEC);
    clearTimer();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearTimer();
  }, [phase, round, clearTimer]);

  const handleTimeUp = useCallback(() => {
    setAnswered(true);
    clearTimer();
    setStreak(0);
    setFeedback({
      type: "lose",
      html: `<strong>⏰ Time's up!</strong>The answer was <code>${currentNum.toString(2)}</code> — decimal ${currentNum} = binary ${currentNum.toString(2)}`,
    });
    setShowNext(true);
    setHeroAnim("wrong");
  }, [clearTimer, currentNum]);

  useEffect(() => {
    if (phase === "game" && timeLeft === 0 && !answered) {
      handleTimeUp();
    }
  }, [timeLeft, phase, answered, handleTimeUp]);

  const showHintFn = useCallback(() => {
    if (answered || hintUsed) return;
    setHintUsed(true);
    setShowHint(true);
  }, [answered, hintUsed]);

  const submitAnswer = useCallback(() => {
    if (answered || !typed.trim()) return;
    const val = typed.trim();
    setAnswered(true);
    clearTimer();

    const correctBin = currentNum.toString(2);
    const isCorrect = val === correctBin;

    if (isCorrect) {
      setCorrectCount((p) => p + 1);
      setStreak((s) => {
        const newStreak = s + 1;
        setBestStreak((b) => Math.max(b, newStreak));
        const mult = getMult(s);
        const gained = Math.round((100 + timeLeft * 4) * mult);
        setScore((sc) => sc + gained);
        setFeedback({
          type: "win",
          html: `<strong>✅ Correct! +${gained} pts${timeLeft >= 15 ? " ⚡ Quick!" : ""}</strong>${correctBin} — Speed bonus: +${timeLeft * 4} · Streak: ×${mult.toFixed(1)} · New streak: 🔥${newStreak}`,
        });
        return newStreak;
      });
      setFlash(true);
      setHeroAnim("correct");
    } else {
      setStreak(0);
      setFeedback({
        type: "lose",
        html: `<strong>❌ Not quite.</strong>You typed: <code>${val}</code> — Correct: <code>${correctBin}</code>`,
      });
      setHeroAnim("wrong");
    }
    setShowNext(true);
  }, [answered, typed, clearTimer, currentNum, timeLeft]);

  const skipRound = useCallback(() => {
    if (answered) return;
    setStreak(0);
    setAnswered(true);
    clearTimer();
    setFeedback({
      type: "lose",
      html: `<strong>⏭ Skipped.</strong>The answer was <code>${currentNum.toString(2)}</code> (decimal ${currentNum})`,
    });
    setShowNext(true);
  }, [answered, clearTimer, currentNum]);

  const nextRound = useCallback(() => {
    if (round + 1 >= TOTAL) {
      setPhase("end");
      save("binary-race", score, bestStreak);
    } else {
      setRound((r) => r + 1);
    }
  }, [round, score, bestStreak, save]);

  const handleInput = useCallback((val: string) => {
    const cleaned = val.replace(/[^01]/g, "").slice(0, 16);
    setTyped(cleaned);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !answered) submitAnswer();
    },
    [answered, submitAnswer],
  );

  const tapBit = useCallback(
    (b: string) => {
      if (answered) return;
      if (typed.length >= 16) return;
      setTyped((p) => p + b);
      inputRef.current?.focus();
    },
    [answered, typed],
  );

  const tapBack = useCallback(() => {
    if (answered) return;
    setTyped((p) => p.slice(0, -1));
    inputRef.current?.focus();
  }, [answered]);

  const hintSteps = (() => {
    let n = currentNum;
    const steps: { n: number; q: number; r: number }[] = [];
    while (n > 0) {
      const q = Math.floor(n / 2);
      const r = n % 2;
      steps.push({ n, q, r });
      n = q;
    }
    return steps;
  })();

  const timerPct = (timeLeft / SEC) * 100;
  const danger = timeLeft <= 6;

  if (phase === "intro") {
    return (
      <div className="mx-auto flex max-w-[620px] flex-col items-center gap-5 rounded-md border-2 border-line bg-paper p-5 text-center sm:p-8">
        <h2 className="font-display text-xl font-bold sm:text-2xl">
          How fast can you think in binary? 🤖
        </h2>
        <p className="max-w-[400px] text-sm leading-relaxed text-muted">
          A decimal number appears. You type its binary equivalent. Accuracy and speed both count —
          build a streak for bonus multipliers.
        </p>
        <ul className="w-full max-w-[380px] space-y-1.5 rounded-lg border border-line bg-paper-dim p-4 text-left">
          {[
            ["⏱", "20 seconds per round — 10 rounds total"],
            ["🎯", "Correct = 100 pts + speed bonus (time × 4)"],
            ["🔥", "Streak multiplier: 1× → 1.5× → 2× → 2.5×"],
            ["💡", "Hint shows division steps — costs −25 pts"],
            ["📈", "Gets harder: 4-bit → 6-bit → 8-bit"],
          ].map(([icon, text]) => (
            <li key={text} className="flex gap-2.5 text-sm text-muted">
              <span className="min-w-[22px] font-bold text-green">{icon}</span>
              {text}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={startGame}
          className="rounded-md border-0 bg-green px-11 py-3 text-sm font-bold text-ink transition-all hover:opacity-85 hover:-translate-y-0.5"
        >
          Start Race →
        </button>
      </div>
    );
  }

  if (phase === "end") {
    const acc = TOTAL > 0 ? Math.round((correctCount / TOTAL) * 100) : 0;
    const max = TOTAL * (100 + SEC * 4) * 2.5;
    const pct = score / max;
    let rank: string;
    let msg: string;
    if (pct >= 0.8) {
      rank = "🏆 Binary Master";
      msg = "You think in bits. Seriously impressive speed and accuracy.";
    } else if (pct >= 0.58) {
      rank = "🥈 Bit Flipper";
      msg = "Strong performance. A few slipped but your instincts are sharp.";
    } else if (pct >= 0.35) {
      rank = "🥉 Bit Curious";
      msg = "Getting there. Study the division method — it becomes second nature.";
    } else {
      rank = "🐛 Decimal Dependent";
      msg = "That's where everyone starts! Study the bit reference and try again.";
    }

    return (
      <div className="mx-auto flex max-w-[500px] flex-col items-center gap-4 rounded-md border-2 border-line bg-paper p-5 text-center sm:p-8">
        <div className="text-3xl sm:text-4xl">🏁</div>
        <h2 className="font-display text-xl font-bold sm:text-2xl">Race Complete!</h2>
        <div className="font-mono text-4xl font-bold text-green sm:text-6xl">{score}</div>
        <div className="rounded-lg border border-green bg-green/5 px-4 py-1.5 text-xs font-semibold text-green sm:px-5 sm:py-2 sm:text-sm">
          {rank}
        </div>
        <div className="grid w-full grid-cols-3 gap-2">
          {[
            { val: `${correctCount}/${TOTAL}`, lbl: "Correct" },
            { val: String(bestStreak), lbl: "Best Streak" },
            { val: `${acc}%`, lbl: "Accuracy" },
          ].map((s) => (
            <div
              key={s.lbl}
              className="rounded-lg border border-line bg-paper-dim p-2 text-center sm:p-2.5"
            >
              <div className="text-[9px] uppercase tracking-wider text-muted sm:text-[10px]">
                {s.lbl}
              </div>
              <div className="mt-0.5 font-mono text-xs font-bold text-foreground sm:text-sm">
                {s.val}
              </div>
            </div>
          ))}
        </div>
        <p className="max-w-[320px] text-xs leading-relaxed text-muted sm:text-sm">{msg}</p>
        <button
          type="button"
          onClick={startGame}
          className="rounded-md border-0 bg-green px-8 py-2.5 text-sm font-bold text-ink transition-all hover:opacity-85 sm:px-11 sm:py-3"
        >
          Race Again
        </button>
      </div>
    );
  }

  const correctBin = currentNum.toString(2);
  const bits = typed.split("");

  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 max-sm:grid-cols-2">
        {[
          { lbl: "Score", val: String(score), cls: "text-green" },
          {
            lbl: "🔥 Streak",
            val: `×${getMult(streak).toFixed(1)}`,
            cls: "text-[var(--yellow)]",
          },
          { lbl: "Round", val: `${round + 1}/${TOTAL}`, cls: "text-[#79c0ff]" },
          { lbl: "Time", val: String(timeLeft), cls: danger ? "text-coral" : "" },
        ].map((s) => (
          <div
            key={s.lbl}
            className={cn(
              "rounded-md border border-line bg-paper px-2 py-2.5 text-center",
              s.lbl === "Time" && danger && "border-coral",
            )}
          >
            <div className="text-[10px] uppercase tracking-wider text-muted">{s.lbl}</div>
            <div className={cn("mt-0.5 font-mono text-lg font-bold", s.cls)}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Timer bar */}
      <div className="h-1 rounded-full bg-line overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 linear",
            danger ? "bg-coral" : "bg-green",
          )}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Diff row */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "rounded-md px-3 py-0.5 text-xs font-semibold",
            getDiffCls(round) === "d-easy" && "border border-green bg-green/10 text-green",
            getDiffCls(round) === "d-medium" &&
              "border border-[var(--yellow)] bg-[var(--yellow)]/10 text-[var(--yellow)]",
            getDiffCls(round) === "d-hard" && "border border-coral bg-coral/10 text-coral",
          )}
        >
          {getDiff(round)}
        </span>
        <span className="text-xs text-muted">{getRoundInfo(round)}</span>
      </div>

      {/* Hero number */}
      <div className="relative flex flex-col items-center gap-2 overflow-hidden rounded-md border border-line bg-paper px-6 py-8 text-center">
        <div className="text-[10px] uppercase tracking-[2px] text-muted">Convert to binary</div>
        <div
          className={cn(
            "font-mono text-[clamp(4rem,14vw,7rem)] font-bold leading-none transition-colors relative z-10",
            heroAnim === "correct" && "animate-[numCorrect_0.5s_ease]",
            heroAnim === "wrong" && "animate-[numWrong_0.4s_ease]",
          )}
        >
          {currentNum}
        </div>
        {flash && (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-semibold text-green opacity-0 animate-[flashIn_0.7s_ease_forwards] pointer-events-none z-20">
            {Array.from({ length: 40 }, () => Math.round(Math.random())).join(" ")}
          </div>
        )}
      </div>

      {/* Bit boxes */}
      <div className="flex flex-wrap justify-center gap-1.5 min-h-[48px] items-center">
        {answered && feedback?.type === "lose"
          ? (() => {
              const maxLen = Math.max(bits.length, correctBin.length);
              const pVal = typed.padStart(maxLen, "0");
              const pCor = correctBin.padStart(maxLen, "0");
              return Array.from({ length: maxLen }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex h-[40px] w-[40px] items-center justify-center rounded-[7px] border-[1.5px] font-mono text-lg font-bold max-sm:h-[34px] max-sm:w-[34px] max-sm:text-base",
                    pVal[i] === pCor[i]
                      ? "border-green bg-green/10 text-green"
                      : "border-coral bg-coral/10 text-coral",
                  )}
                >
                  {pVal[i]}
                </div>
              ));
            })()
          : bits.map((b, i) => (
              <div
                key={i}
                className="flex h-[40px] w-[40px] items-center justify-center rounded-[7px] border-[1.5px] border-green bg-green/10 font-mono text-lg font-bold text-green max-sm:h-[34px] max-sm:w-[34px] max-sm:text-base"
              >
                {b}
              </div>
            ))}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        inputMode="none"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder="type 0s and 1s…"
        maxLength={16}
        value={typed}
        onChange={(e) => handleInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={answered}
        className={cn(
          "w-full rounded-md border-[1.5px] border-line bg-paper-dim px-4 py-3.5 text-center font-mono text-xl font-semibold tracking-[4px] text-foreground outline-none transition-colors",
          "placeholder:text-muted placeholder:text-sm placeholder:tracking-normal",
          answered && feedback?.type === "win" && "!border-green !bg-green/10",
          answered && feedback?.type === "lose" && "!border-coral !bg-coral/10",
          !answered && "focus:border-green",
        )}
      />

      {/* Tap pad */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => tapBit("0")}
          disabled={answered}
          className="rounded-md border-[1.5px] border-line bg-paper p-3.5 font-mono text-2xl font-bold text-foreground transition-all active:scale-[0.93] hover:border-[#79c0ff] hover:text-[#79c0ff] hover:bg-[#79c0ff]/10 disabled:opacity-40"
        >
          0
        </button>
        <button
          type="button"
          onClick={() => tapBit("1")}
          disabled={answered}
          className="rounded-md border-[1.5px] border-line bg-paper p-3.5 font-mono text-2xl font-bold text-foreground transition-all active:scale-[0.93] hover:border-green hover:text-green hover:bg-green/10 disabled:opacity-40"
        >
          1
        </button>
        <button
          type="button"
          onClick={tapBack}
          disabled={answered}
          className="rounded-md border-[1.5px] border-line bg-paper p-3.5 font-mono text-2xl font-bold text-foreground transition-all active:scale-[0.93] hover:border-coral hover:text-coral hover:bg-coral/10 disabled:opacity-40"
        >
          ⌫
        </button>
      </div>

      {/* Bit reference */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 rounded-lg border border-line bg-paper-dim p-2.5 text-center">
        {[7, 6, 5, 4, 3, 2, 1, 0].map((p) => (
          <div key={p}>
            <div className="font-mono text-[10px] text-muted">
              2<sup>{p}</sup>
            </div>
            <div className="font-mono text-xs font-semibold text-[#79c0ff]">{Math.pow(2, p)}</div>
          </div>
        ))}
      </div>

      {/* Hint box */}
      {showHint && (
        <div className="rounded-md border border-[var(--yellow)] bg-[var(--yellow)]/5 p-3.5">
          <h4 className="mb-2 text-xs font-semibold text-[var(--yellow)]">💡 Division Method</h4>
          <div className="font-mono text-xs leading-[1.9] text-foreground">
            {hintSteps.map((s, i) => (
              <div key={i}>
                {s.n} ÷ 2 = {s.q}{" "}
                <span className="font-semibold text-[var(--yellow)]">remainder {s.r}</span>
              </div>
            ))}
          </div>
          <div className="mt-1.5 font-mono text-xs font-semibold text-green">
            ↑ Read remainders bottom to top: {correctBin}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-sm:grid-cols-2">
        <button
          type="button"
          onClick={showHintFn}
          disabled={answered || hintUsed}
          className="rounded-md border-[1.5px] border-line px-2 py-2.5 text-xs font-semibold text-[var(--yellow)] transition-all hover:border-[var(--yellow)] hover:bg-[var(--yellow)]/10 disabled:opacity-35 disabled:cursor-default"
        >
          💡 Hint (−25)
        </button>
        <button
          type="button"
          onClick={skipRound}
          disabled={answered}
          className="rounded-md border-[1.5px] border-line px-2 py-2.5 text-xs font-semibold text-muted transition-all hover:text-foreground hover:border-foreground disabled:opacity-40"
        >
          Skip →
        </button>
        <button
          type="button"
          onClick={submitAnswer}
          disabled={answered || !typed.trim()}
          className="rounded-md border-0 bg-green px-2 py-2.5 text-xs font-bold text-ink transition-all hover:opacity-85 disabled:opacity-40 disabled:cursor-default max-sm:col-span-2"
        >
          Submit ↵
        </button>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={cn(
            "animate-[fadeUp_0.3s_ease] rounded-md border p-3.5 text-sm",
            feedback.type === "win"
              ? "border-green bg-green/5 text-green"
              : "border-coral bg-coral/5 text-coral",
          )}
          dangerouslySetInnerHTML={{ __html: feedback.html }}
        />
      )}

      {/* Next button */}
      {showNext && (
        <button
          type="button"
          onClick={nextRound}
          className="w-full rounded-md border-[1.5px] border-line bg-paper px-4 py-3 text-sm font-semibold text-foreground transition-all hover:border-green hover:text-green"
        >
          {round + 1 < TOTAL ? "Next Round →" : "See Results"}
        </button>
      )}

      {/* Inline keyframes */}
      <style>{`
        @keyframes numCorrect {
          0%  { color: var(--foreground); transform: scale(1); }
          40% { color: var(--green); transform: scale(1.12); }
          100%{ color: var(--foreground); transform: scale(1); }
        }
        @keyframes numWrong {
          0%,100% { transform: translateX(0); color: var(--foreground); }
          20%     { transform: translateX(-8px); color: var(--coral); }
          60%     { transform: translateX(8px); color: var(--coral); }
        }
        @keyframes flashIn {
          0%   { opacity: 0; }
          30%  { opacity: .5; }
          100% { opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
