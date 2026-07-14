import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";

type Difficulty = "mixed" | "easy" | "hard";

interface Question {
  cat: string;
  diff: string;
  q: string;
  opts: string[];
  correct: number;
  explain: string;
}

const CAT_COLORS: Record<string, string> = {
  History: "#ffa657",
  Languages: "#79c0ff",
  Web: "#00ff88",
  "CS Basics": "#d2a8ff",
  Tools: "#ffd166",
  Companies: "#ff4d6d",
};

const QUESTIONS: Question[] = [
  { cat:"History", diff:"Easy", q:"In what year was JavaScript created?", opts:["1995","1991","2000","1989"], correct:0, explain:"Brendan Eich created JavaScript at Netscape in just 10 days in May 1995. It was originally called Mocha, then LiveScript, before being renamed JavaScript." },
  { cat:"History", diff:"Easy", q:"Who is the original creator of Linux?", opts:["Bill Gates","Linus Torvalds","Dennis Ritchie","Guido van Rossum"], correct:1, explain:"Linus Torvalds started Linux in 1991 as a personal project while a student at the University of Helsinki." },
  { cat:"History", diff:"Hard", q:"What was the first ever computer \"bug\" — literally?", opts:["A software crash at NASA","A moth stuck in a Harvard Mark II relay","A virus in ARPANET","A misplaced semicolon"], correct:1, explain:"In 1947, engineers at Harvard found an actual moth stuck in a relay of the Mark II computer, causing a malfunction. They taped it into the logbook." },
  { cat:"History", diff:"Hard", q:"What was the name of the first web browser, created by Tim Berners-Lee?", opts:["Mosaic","Netscape","WorldWideWeb","Lynx"], correct:2, explain:"Tim Berners-Lee built the first browser in 1990 and simply called it \"WorldWideWeb\" — later renamed Nexus to avoid confusion with the web itself." },
  { cat:"Languages", diff:"Easy", q:"Which language is Django built with?", opts:["Ruby","Python","PHP","Java"], correct:1, explain:"Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design." },
  { cat:"Languages", diff:"Easy", q:"What does CSS stand for?", opts:["Computer Style Sheets","Cascading Style Sheets","Creative Style System","Colorful Style Sheets"], correct:1, explain:"CSS — Cascading Style Sheets — controls the visual presentation of HTML. \"Cascading\" refers to how styles apply in order of specificity and source." },
  { cat:"Languages", diff:"Hard", q:"What does \"Rust\" use instead of garbage collection to manage memory?", opts:["Reference counting only","Manual malloc/free","Ownership and borrowing system","Generational GC"], correct:2, explain:"Rust uses an ownership system with borrowing rules, checked at compile time. This gives memory safety without a runtime garbage collector." },
  { cat:"Languages", diff:"Hard", q:"In Python, what does the GIL (Global Interpreter Lock) actually prevent?", opts:["Importing modules twice","Multiple threads executing Python bytecode simultaneously","Memory leaks","Syntax errors at runtime"], correct:1, explain:"The GIL ensures only one thread executes Python bytecode at a time, even on multi-core systems." },
  { cat:"Web", diff:"Easy", q:"What does API stand for?", opts:["Application Programming Interface","Automated Program Integration","Advanced Programming Index","Application Process Interaction"], correct:0, explain:"An API (Application Programming Interface) defines how different software components communicate." },
  { cat:"Web", diff:"Easy", q:"Which HTTP method is typically used to update an existing resource?", opts:["GET","POST","PUT","PATCH"], correct:3, explain:"PATCH is used to partially update an existing resource. PUT replaces the entire resource." },
  { cat:"Web", diff:"Hard", q:"What does the \"same-origin policy\" in browsers actually restrict?", opts:["Downloading files","Scripts from one origin accessing data from another origin","Loading images from CDNs","Opening new browser tabs"], correct:1, explain:"The same-origin policy prevents a script loaded from one origin from accessing data on a page from a different origin." },
  { cat:"Web", diff:"Hard", q:"What is the main difference between localStorage and sessionStorage?", opts:["localStorage is faster","sessionStorage persists across browser restarts","localStorage persists with no expiration, sessionStorage clears when tab closes","They store different data types"], correct:2, explain:"localStorage data persists indefinitely until explicitly cleared. sessionStorage only lasts for the duration of the page session." },
  { cat:"CS Basics", diff:"Easy", q:"What is the time complexity of binary search?", opts:["O(n)","O(n²)","O(log n)","O(1)"], correct:2, explain:"Binary search halves the search space with each comparison, giving it O(log n) time complexity." },
  { cat:"CS Basics", diff:"Easy", q:"Which data structure uses LIFO (Last In, First Out) ordering?", opts:["Queue","Stack","Array","Linked List"], correct:1, explain:"A stack follows LIFO — the last element added is the first one removed." },
  { cat:"CS Basics", diff:"Hard", q:"What is the worst-case time complexity of QuickSort?", opts:["O(n log n)","O(n)","O(n²)","O(log n)"], correct:2, explain:"QuickSort averages O(n log n) but degrades to O(n²) in the worst case — typically when the pivot selection consistently picks the smallest or largest element." },
  { cat:"CS Basics", diff:"Hard", q:"What problem does the CAP theorem describe in distributed systems?", opts:["You can only have 2 of: Consistency, Availability, Partition tolerance","Cache invalidation strategies","API rate limiting","Concurrent access patterns"], correct:0, explain:"CAP theorem states a distributed system can only guarantee two of three properties: Consistency, Availability, and Partition tolerance." },
  { cat:"Tools", diff:"Easy", q:"What command stages all changes in Git for the next commit?", opts:["git push","git add .","git commit -a","git stage"], correct:1, explain:"`git add .` stages all modified and new files in the current directory." },
  { cat:"Tools", diff:"Easy", q:"What does npm stand for?", opts:["New Package Manager","Node Package Manager","Network Programming Module","Node Programming Method"], correct:1, explain:"npm — Node Package Manager — is the default package manager for Node.js." },
  { cat:"Tools", diff:"Hard", q:"In Docker, what is the difference between an image and a container?", opts:["No difference, same thing","Image is a running instance, container is the template","Image is a read-only template, container is a running instance of it","Containers are for Linux only"], correct:2, explain:"A Docker image is a static, read-only template. A container is a running instance of that image." },
  { cat:"Tools", diff:"Hard", q:"What does \"git rebase\" do differently from \"git merge\"?", opts:["Rebase deletes the branch","Rebase rewrites commit history onto a new base, merge preserves it with a merge commit","They are identical commands","Rebase only works on remote branches"], correct:1, explain:"Merge combines two branches by creating a new merge commit. Rebase rewrites your branch's commits to apply on top of another branch." },
  { cat:"Companies", diff:"Easy", q:"Which company originally created and open-sourced React?", opts:["Google","Meta (Facebook)","Microsoft","Amazon"], correct:1, explain:"React was created by Jordan Walke at Facebook (now Meta) and open-sourced in 2013." },
  { cat:"Companies", diff:"Easy", q:"Which company created and maintains TypeScript?", opts:["Google","Meta","Microsoft","Oracle"], correct:2, explain:"TypeScript was developed by Microsoft, led by Anders Hejlsberg." },
  { cat:"Companies", diff:"Hard", q:"Apache Kafka was originally built internally at which company before being open-sourced?", opts:["Google","LinkedIn","Twitter","Amazon"], correct:1, explain:"Kafka was built at LinkedIn around 2010 to handle their massive activity stream and operational data processing needs." },
  { cat:"Companies", diff:"Hard", q:"Which company developed the Go programming language?", opts:["Microsoft","Google","Mozilla","Apple"], correct:1, explain:"Go (Golang) was designed at Google in 2007 by Robert Griesemer, Rob Pike, and Ken Thompson." },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getMult(s: number) {
  return s >= 3 ? 2.5 : s >= 2 ? 2.0 : s >= 1 ? 1.5 : 1.0;
}

const SEC = 18;
const TOTAL = 10;

export function DevTrivia() {
  const [phase, setPhase] = useState<"intro" | "game" | "end">("intro");
  const [selectedDiff, setSelectedDiff] = useState<Difficulty>("mixed");
  const [order, setOrder] = useState<Question[]>([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SEC);
  const [answered, setAnswered] = useState(false);
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);
  const [catTracker, setCatTracker] = useState<Record<string, { correct: number; total: number }>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const q = order[round];
  const done = round >= TOTAL;

  const shuffledOpts = useMemo(() => {
    if (!q) return [];
    return shuffle(q.opts.map((o, i) => ({ text: o, isCorrect: i === q.correct })));
  }, [q]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const startGame = useCallback(() => {
    let pool: Question[];
    if (selectedDiff === "mixed") pool = shuffle([...QUESTIONS]);
    else pool = shuffle(QUESTIONS.filter((qw) => qw.diff.toLowerCase() === selectedDiff));
    if (pool.length < TOTAL) pool = shuffle([...QUESTIONS]);
    setOrder(pool.slice(0, TOTAL));
    setRound(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectCount(0);
    setTotalAnswered(0);
    setCatTracker({});
    setPhase("game");
  }, [selectedDiff]);

  useEffect(() => {
    if (phase !== "game" || done) return;
    setTimeLeft(SEC);
    setAnswered(false);
    setPickedIdx(null);
    clearTimer();

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    timerRef.current = interval;
    return () => clearInterval(interval);
  }, [phase, round, done, clearTimer]);

  useEffect(() => {
    if (phase === "game" && timeLeft === 0 && !answered && q) {
      handleTimeUp();
    }
  }, [timeLeft, phase, answered, q]);

  const handleTimeUp = useCallback(() => {
    setAnswered(true);
    clearTimer();
    setTotalAnswered((p) => p + 1);
    setStreak(0);
    setCatTracker((prev) => ({
      ...prev,
      [q!.cat]: { correct: prev[q!.cat]?.correct ?? 0, total: (prev[q!.cat]?.total ?? 0) + 1 },
    }));
  }, [clearTimer, q]);

  const selectOption = useCallback((idx: number, isCorrect: boolean) => {
    if (answered) return;
    setAnswered(true);
    setPickedIdx(idx);
    clearTimer();
    setTotalAnswered((p) => p + 1);

    const currentQ = order[round];
    setCatTracker((prev) => ({
      ...prev,
      [currentQ.cat]: {
        correct: (prev[currentQ.cat]?.correct ?? 0) + (isCorrect ? 1 : 0),
        total: (prev[currentQ.cat]?.total ?? 0) + 1,
      },
    }));

    if (isCorrect) {
      setCorrectCount((p) => p + 1);
      setStreak((s) => {
        const newStreak = s + 1;
        setBestStreak((b) => Math.max(b, newStreak));
        const mult = getMult(s);
        const gained = Math.round((100 + timeLeft * 4) * mult);
        setScore((sc) => sc + gained);
        return newStreak;
      });
    } else {
      setStreak(0);
    }
  }, [answered, clearTimer, order, round, timeLeft]);

  const nextRound = useCallback(() => {
    if (round + 1 >= TOTAL) {
      setPhase("end");
    } else {
      setRound((r) => r + 1);
    }
  }, [round]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const mult = getMult(streak > 0 ? streak - 1 : 0);
  const isCorrect = pickedIdx !== null && q && pickedIdx === q.correct;

  if (phase === "intro") {
    return (
      <div className="mx-auto flex max-w-[600px] flex-col items-center gap-5 rounded-md border-2 border-line bg-paper p-8 text-center">
        <h2 className="font-display text-xl font-bold">How much do you actually know?</h2>
        <p className="max-w-[380px] text-sm leading-relaxed text-muted">
          Questions span programming history, language trivia, web fundamentals, and computer science basics. Pick your difficulty.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {["History", "Languages", "Web", "CS Basics", "Tools", "Companies"].map((c) => (
            <span key={c} className="rounded-full border border-line px-3 py-1 font-mono text-xs font-semibold text-muted">{c}</span>
          ))}
        </div>
        <div className="grid w-full max-w-[380px] grid-cols-3 gap-2">
          {(["mixed", "easy", "hard"] as Difficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDiff(d)}
              className={cn(
                "rounded-sm border-2 border-line bg-paper-dim p-3 text-center transition-all",
                selectedDiff === d && "border-yellow bg-yellow/10",
              )}
            >
              <div className="text-sm font-bold text-foreground">{d === "mixed" ? "Mixed" : d === "easy" ? "Easy" : "Hard"}</div>
              <div className="mt-0.5 text-[11px] text-muted">{d === "mixed" ? "All levels" : d === "easy" ? "Beginner" : "Expert"}</div>
            </button>
          ))}
        </div>
        <ul className="w-full max-w-[380px] space-y-2 rounded-sm border-2 border-line bg-paper-dim p-4">
          {[
            ["🎯", "10 questions — 4 options each"],
            ["⏱", "18 seconds per question"],
            ["⚡", "Correct = 100 pts + speed bonus (time × 4)"],
            ["🔥", "Streak multiplier up to ×2.5"],
          ].map(([icon, text]) => (
            <li key={text} className="flex gap-3 text-sm text-muted">
              <span className="min-w-[22px] font-bold text-coral">{icon}</span>
              {text}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={startGame}
          className="rounded-sm border-2 border-yellow bg-yellow px-11 py-3 font-mono text-sm font-bold text-ink transition hover:opacity-85"
          style={{ boxShadow: "4px 4px 0 var(--coral)" }}
        >
          Start Trivia →
        </button>
      </div>
    );
  }

  if (phase === "end") {
    const acc = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    const max = TOTAL * (100 + SEC * 4) * 2.5;
    const pct = score / max;
    let rank: string;
    let msg: string;
    if (pct >= 0.82) { rank = "🏆 Tech Encyclopedia"; msg = "You know this stuff cold — history, languages, systems, all of it."; }
    else if (pct >= 0.60) { rank = "🥈 Senior Dev Brain"; msg = "Strong knowledge base. The deep-cut history questions got you."; }
    else if (pct >= 0.38) { rank = "🥉 Growing Dev"; msg = "Solid fundamentals. Time to dig into the \"why\" behind the tools you use daily."; }
    else { rank = "🐛 Curious Beginner"; msg = "Everyone starts here! Re-read the explanations — that's where the real learning happened."; }

    return (
      <div className="mx-auto flex max-w-[660px] flex-col items-center gap-4 rounded-md border-2 border-line bg-paper p-10 text-center">
        <div className="text-4xl">🏆</div>
        <h2 className="font-display text-2xl font-bold">Trivia Complete!</h2>
        <div className="font-mono text-5xl font-bold text-coral">{score}</div>
        <div className="rounded-sm border-2 border-coral bg-coral/10 px-6 py-2 text-sm font-semibold text-coral">{rank}</div>
        <div className="grid w-full max-w-[340px] grid-cols-3 gap-3">
          {[
            ["Correct", `${correctCount}/${TOTAL}`],
            ["Best Streak", `${bestStreak}`],
            ["Accuracy", `${acc}%`],
          ].map(([l, v]) => (
            <div key={l} className="rounded-sm border-2 border-line bg-paper p-3 text-center">
              <div className="text-[11px] uppercase tracking-wider text-muted">{l}</div>
              <div className="mt-1 font-mono text-lg font-bold text-foreground">{v}</div>
            </div>
          ))}
        </div>
        <p className="max-w-[320px] text-sm leading-relaxed text-muted">{msg}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {Object.entries(catTracker).map(([cat, d]) => (
            <span
              key={cat}
              className={cn(
                "rounded-sm border border-line px-2.5 py-1 font-mono text-xs text-muted",
                d.correct === d.total && "border-coral text-coral",
              )}
            >
              {cat}: {d.correct}/{d.total}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={restartGame}
          className="mt-2 rounded-sm border-2 border-yellow bg-yellow px-11 py-3 font-mono text-sm font-bold text-ink transition hover:opacity-85"
          style={{ boxShadow: "4px 4px 0 var(--coral)" }}
        >
          Play Again
        </button>
      </div>
    );
  }

  const letters = ["A", "B", "C", "D"];

  return (
    <div className="mx-auto flex w-full max-w-[660px] flex-col gap-3.5">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-2.5 max-sm:grid-cols-2">
        {[
          { lbl: "Score", val: String(score), cls: "" },
          { lbl: "🔥 Streak", val: `×${getMult(streak).toFixed(1)}`, cls: "" },
          { lbl: "Question", val: `${round + 1}/${TOTAL}`, cls: "" },
          { lbl: "Time", val: String(timeLeft), cls: timeLeft <= 6 ? "text-coral" : "" },
        ].map((s) => (
          <div key={s.lbl} className="rounded-sm border-2 border-line bg-paper p-2.5 text-center">
            <div className="text-[11px] uppercase tracking-wider text-muted">{s.lbl}</div>
            <div className={cn("mt-0.5 font-mono text-xl font-bold text-foreground", s.cls)}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Timer bar */}
      <div className="h-1 overflow-hidden rounded-full bg-line">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            timeLeft <= 6 ? "bg-coral" : "bg-yellow",
          )}
          style={{ width: `${(timeLeft / SEC) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <div className="flex flex-col items-center gap-3.5 rounded-sm border-2 border-line bg-paper p-6">
        <div className="flex w-full items-center justify-between">
          <span
            className="rounded-full border px-3 py-1 font-mono text-xs font-bold"
            style={{
              color: CAT_COLORS[q?.cat] ?? "#7d8590",
              borderColor: CAT_COLORS[q?.cat] ?? "#7d8590",
              backgroundColor: `${CAT_COLORS[q?.cat] ?? "#7d8590"}18`,
            }}
          >
            {q?.cat}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">{q?.diff}</span>
        </div>
        <div className="max-w-[480px] text-center font-display text-lg font-bold leading-relaxed text-foreground">{q?.q}</div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
        {shuffledOpts.map((opt, i) => {
          const wasPicked = pickedIdx !== null && i === pickedIdx;
          const isCorrectOpt = answered && opt.isCorrect;
          const isWrong = wasPicked && !opt.isCorrect;
          const dim = answered && !isCorrectOpt && !isWrong;

          return (
            <button
              key={i}
              type="button"
              onClick={() => selectOption(i, opt.isCorrect)}
              disabled={answered}
              className={cn(
                "flex items-center gap-3 rounded-sm border-2 border-line bg-paper p-3.5 text-left font-mono text-sm transition-all",
                "hover:not-disabled:border-yellow hover:not-disabled:-translate-y-0.5",
                "disabled:cursor-default",
                isCorrectOpt && "!border-green-500 !bg-green-500/10",
                isWrong && "!border-red-500 !bg-red-500/10",
                dim && "opacity-30",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-paper-dim font-mono text-xs font-bold text-muted",
                  isCorrectOpt && "!border-green-500 !bg-green-500/10 !text-green-500",
                  isWrong && "!border-red-500 !bg-red-500/10 !text-red-500",
                )}
              >
                {letters[i]}
              </span>
              <span className="flex-1 text-foreground">{opt.text}</span>
              {isWrong && <span>❌</span>}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div
          className={cn(
            "animate-[fadeUp_0.3s_ease] rounded-sm border-2 p-4 text-sm",
            isCorrect
              ? "border-green-500 bg-green-500/10 text-green-500"
              : pickedIdx === null
                ? "border-coral bg-coral/10 text-coral"
                : "border-red-500 bg-red-500/10 text-red-500",
          )}
        >
          <strong className="mb-1 block font-display text-base">
            {isCorrect
              ? `✅ Correct! +${Math.round((100 + timeLeft * 4) * mult)} pts${timeLeft >= 13 ? " ⚡ Quick!" : ""}`
              : pickedIdx === null
                ? "⏰ Time's up!"
                : "❌ Not quite."}
          </strong>
          {isCorrect && (
            <div className="text-xs text-muted">
              Speed: +{timeLeft * 4} · Streak ×{mult.toFixed(1)} → 🔥{streak}
            </div>
          )}
          <div className="mt-2 border-t border-line pt-2 text-foreground">{q?.explain}</div>
        </div>
      )}

      {/* Next button */}
      {answered && (
        <button
          type="button"
          onClick={nextRound}
          className="w-full rounded-sm border-2 border-line bg-paper py-3 font-mono text-sm font-semibold text-foreground transition hover:border-yellow hover:text-yellow"
        >
          {round + 1 < TOTAL ? "Next Question →" : "See Results"}
        </button>
      )}
    </div>
  );
}
