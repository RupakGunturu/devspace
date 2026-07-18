import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useSaveGameScore } from "@/hooks/useSaveGameScore";

type Difficulty = "easy" | "medium" | "hard";

interface Tech {
  id: string;
  name: string;
  cat: string;
  color: string;
  svg: string;
}

interface CardData extends Tech {
  type: "logo" | "name";
  uid: string;
  paired: boolean;
  flipped: boolean;
}

const TECHS: Tech[] = [
  {
    id: "react",
    name: "React",
    cat: "UI Library",
    color: "#61dafb",
    svg: `<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse rx="38" ry="12" fill="none" stroke="#61dafb" stroke-width="4.5"/><ellipse rx="38" ry="12" fill="none" stroke="#61dafb" stroke-width="4.5" transform="rotate(60)"/><ellipse rx="38" ry="12" fill="none" stroke="#61dafb" stroke-width="4.5" transform="rotate(-60)"/><circle r="6" fill="#61dafb"/></svg>`,
  },
  {
    id: "vue",
    name: "Vue",
    cat: "Frontend Framework",
    color: "#42b883",
    svg: `<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="0,42 -44,-28 -22,-28" fill="#42b883"/><polygon points="0,42 44,-28 22,-28" fill="#42b883" opacity=".7"/><polygon points="0,10 -22,-28 22,-28" fill="none" stroke="#42b883" stroke-width="5" stroke-linejoin="round"/></svg>`,
  },
  {
    id: "docker",
    name: "Docker",
    cat: "Containerisation",
    color: "#2496ed",
    svg: `<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="-42" y="-30" width="22" height="18" rx="3" fill="#2496ed"/><rect x="-16" y="-30" width="22" height="18" rx="3" fill="#2496ed"/><rect x="10" y="-30" width="22" height="18" rx="3" fill="#2496ed"/><rect x="-42" y="-7" width="22" height="18" rx="3" fill="#2496ed" opacity=".7"/><rect x="-16" y="-7" width="22" height="18" rx="3" fill="#2496ed" opacity=".7"/><path d="M-44 18 Q-20 36 0 30 Q20 36 44 18" fill="none" stroke="#2496ed" stroke-width="4.5"/></svg>`,
  },
  {
    id: "nodejs",
    name: "Node.js",
    cat: "Runtime",
    color: "#339933",
    svg: `<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="0,-46 40,-23 40,23 0,46 -40,23 -40,-23" fill="none" stroke="#339933" stroke-width="5"/><text y="11" text-anchor="middle" fill="#339933" font-size="30" font-weight="700" font-family="JetBrains Mono,monospace">N</text></svg>`,
  },
  {
    id: "python",
    name: "Python",
    cat: "Language",
    color: "#3776ab",
    svg: `<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M-2,-44 C-24,-44 -40,-28 -40,-8 L-40,8 C-40,20 -30,28 -18,28 L-2,28 L-2,36 L18,36 C30,36 40,28 40,8 L40,-8 C40,-28 24,-44 2,-44 Z" fill="none" stroke="#3776ab" stroke-width="4.5"/><circle cx="-10" cy="-24" r="6" fill="#3776ab"/><circle cx="10" cy="24" r="6" fill="#ffd43b"/></svg>`,
  },
  {
    id: "mongodb",
    name: "MongoDB",
    cat: "Database",
    color: "#47a248",
    svg: `<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M0,-44 C18,-20 28,0 0,44 C-28,0 -18,-20 0,-44Z" fill="none" stroke="#47a248" stroke-width="5"/><line x1="0" y1="-2" x2="0" y2="44" stroke="#47a248" stroke-width="5"/></svg>`,
  },
  {
    id: "redis",
    name: "Redis",
    cat: "In-Memory DB",
    color: "#dc382d",
    svg: `<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="0,-44 14,-14 46,-14 22,6 32,36 0,20 -32,36 -22,6 -46,-14 -14,-14" fill="none" stroke="#dc382d" stroke-width="4.5" stroke-linejoin="round"/></svg>`,
  },
  {
    id: "typescript",
    name: "TypeScript",
    cat: "Language",
    color: "#3178c6",
    svg: `<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="-44" y="-44" width="88" height="88" rx="12" fill="#3178c6"/><text y="16" text-anchor="middle" fill="white" font-size="36" font-weight="700" font-family="JetBrains Mono,monospace">TS</text></svg>`,
  },
  {
    id: "javascript",
    name: "JavaScript",
    cat: "Language",
    color: "#f7df1e",
    svg: `<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="-44" y="-44" width="88" height="88" rx="12" fill="#f7df1e"/><text y="16" text-anchor="middle" fill="#0d1117" font-size="36" font-weight="700" font-family="JetBrains Mono,monospace">JS</text></svg>`,
  },
  {
    id: "graphql",
    name: "GraphQL",
    cat: "Query Language",
    color: "#e10098",
    svg: `<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="0" cy="-40" r="9" fill="#e10098"/><circle cx="35" cy="20" r="9" fill="#e10098"/><circle cx="-35" cy="20" r="9" fill="#e10098"/><line x1="0" y1="-40" x2="35" y2="20" stroke="#e10098" stroke-width="4.5"/><line x1="35" y1="20" x2="-35" y2="20" stroke="#e10098" stroke-width="4.5"/><line x1="-35" y1="20" x2="0" y2="-40" stroke="#e10098" stroke-width="4.5"/><line x1="0" y1="-40" x2="0" y2="0" stroke="#e10098" stroke-width="4.5" opacity=".5"/><line x1="35" y1="20" x2="0" y2="0" stroke="#e10098" stroke-width="4.5" opacity=".5"/><line x1="-35" y1="20" x2="0" y2="0" stroke="#e10098" stroke-width="4.5" opacity=".5"/><circle cx="0" cy="0" r="7" fill="#e10098"/></svg>`,
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    cat: "Orchestration",
    color: "#326ce5",
    svg: `<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="0" cy="0" r="42" fill="none" stroke="#326ce5" stroke-width="5"/><circle cx="0" cy="0" r="13" fill="#326ce5"/><line x1="0" y1="-13" x2="0" y2="-34" stroke="#326ce5" stroke-width="6"/><line x1="11.3" y1="6.5" x2="29.4" y2="17" stroke="#326ce5" stroke-width="6"/><line x1="-11.3" y1="6.5" x2="-29.4" y2="17" stroke="#326ce5" stroke-width="6"/><line x1="11.3" y1="-6.5" x2="29.4" y2="-17" stroke="#326ce5" stroke-width="6"/><line x1="-11.3" y1="-6.5" x2="-29.4" y2="-17" stroke="#326ce5" stroke-width="6"/><line x1="0" y1="13" x2="0" y2="34" stroke="#326ce5" stroke-width="6"/></svg>`,
  },
  {
    id: "git",
    name: "Git",
    cat: "Version Control",
    color: "#f05032",
    svg: `<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="-22" cy="-28" r="12" fill="none" stroke="#f05032" stroke-width="5"/><circle cx="-22" cy="28" r="12" fill="none" stroke="#f05032" stroke-width="5"/><circle cx="28" cy="0" r="12" fill="none" stroke="#f05032" stroke-width="5"/><line x1="-22" y1="-16" x2="-22" y2="16" stroke="#f05032" stroke-width="5"/><path d="M-22,-28 Q16,-28 28,0" fill="none" stroke="#f05032" stroke-width="5"/></svg>`,
  },
];

const DIFF: Record<Difficulty, { pairs: number; cols: number; colsMobile: number }> = {
  easy: { pairs: 6, cols: 4, colsMobile: 3 },
  medium: { pairs: 9, cols: 6, colsMobile: 3 },
  hard: { pairs: 12, cols: 6, colsMobile: 4 },
};

function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function calcScore(pairs: number, moves: number, time: number) {
  const base = pairs * 100;
  const optimal = pairs;
  const penalty = Math.max(0, (moves - optimal) * 8);
  const bonus = Math.max(0, 300 - time) * 2;
  return Math.max(50, base - penalty + bonus);
}

function getStars(pairs: number, moves: number) {
  const extra = moves - pairs;
  if (extra <= 2) return 3;
  if (extra <= 7) return 2;
  return 1;
}

export function TechMemory() {
  const { save } = useSaveGameScore();
  const [phase, setPhase] = useState<"intro" | "game" | "win">("intro");
  const [diff, setDiff] = useState<Difficulty>("easy");
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [canFlip, setCanFlip] = useState(true);
  const [wrongPair, setWrongPair] = useState<number[] | null>(null);
  const [matchPop, setMatchPop] = useState<number | null>(null);
  const [winWidth, setWinWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalPairs = DIFF[diff].pairs;

  const diffColor = useMemo(() => {
    if (diff === "easy") return "var(--green)";
    if (diff === "medium") return "var(--yellow)";
    return "var(--coral)";
  }, [diff]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  useEffect(() => {
    const onResize = () => setWinWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const buildGame = useCallback(
    (d: Difficulty) => {
      clearTimer();
      const cfg = DIFF[d];
      const pool = shuffle(TECHS).slice(0, cfg.pairs);
      const deck = shuffle([
        ...pool.map((t) => ({
          ...t,
          type: "logo" as const,
          uid: t.id + "_logo",
          paired: false,
          flipped: false,
        })),
        ...pool.map((t) => ({
          ...t,
          type: "name" as const,
          uid: t.id + "_name",
          paired: false,
          flipped: false,
        })),
      ]);
      setCards(deck);
      setFlippedIndices([]);
      setMatchedCount(0);
      setMoves(0);
      setElapsed(0);
      setCanFlip(true);
      setWrongPair(null);
      setMatchPop(null);

      timerRef.current = setInterval(() => {
        setElapsed((p) => p + 1);
      }, 1000);
    },
    [clearTimer],
  );

  const startGame = useCallback(
    (d: Difficulty) => {
      setDiff(d);
      setPhase("game");
      buildGame(d);
    },
    [buildGame],
  );

  const flipCard = useCallback(
    (idx: number) => {
      if (!canFlip) return;
      const card = cards[idx];
      if (card.paired || card.flipped) return;
      if (flippedIndices.length >= 2) return;

      const newCards = cards.map((c, i) => (i === idx ? { ...c, flipped: true } : c));
      setCards(newCards);
      const newFlipped = [...flippedIndices, idx];
      setFlippedIndices(newFlipped);

      if (newFlipped.length === 2) {
        setCanFlip(false);
        setMoves((p) => p + 1);
        const [a, b] = newFlipped;
        const cardA = newCards[a];
        const cardB = newCards[b];

        if (cardA.id === cardB.id && cardA.type !== cardB.type) {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c, i) => (i === a || i === b ? { ...c, paired: true } : c)),
            );
            setMatchPop(a);
            setTimeout(() => setMatchPop(null), 350);
            setMatchedCount((p) => {
              const next = p + 1;
              if (next === totalPairs) {
                setTimeout(() => {
                  clearTimer();
                  setPhase("win");
                }, 400);
              }
              return next;
            });
            setFlippedIndices([]);
            setCanFlip(true);
          }, 300);
        } else {
          setWrongPair([a, b]);
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c)),
            );
            setWrongPair(null);
            setFlippedIndices([]);
            setCanFlip(true);
          }, 700);
        }
      }
    },
    [canFlip, cards, flippedIndices, totalPairs, clearTimer],
  );

  const timeStr = useMemo(() => {
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, [elapsed]);

  const score = useMemo(() => calcScore(totalPairs, moves, elapsed), [totalPairs, moves, elapsed]);
  const stars = useMemo(() => getStars(totalPairs, moves), [totalPairs, moves]);

  useEffect(() => {
    if (phase === "win") save("tech-memory", score, 0);
  }, [phase, score, save]);

  const winMessages = useMemo(() => {
    const msgs = {
      3: [
        "Perfect memory!",
        "Flawless run. You barely needed to think.",
        "Incredible — near optimal!",
      ],
      2: ["Solid performance", "Good memory with a few backtracks.", "Well played overall."],
      1: [
        "Keep practising",
        "Memory takes time to train.",
        "You cleared the board — that's what counts.",
      ],
    };
    return msgs[stars as 1 | 2 | 3][Math.floor(Math.random() * 3)];
  }, [stars]);

  if (phase === "intro") {
    return (
      <div className="mx-auto flex max-w-[560px] flex-col items-center gap-5 rounded-md border-2 border-line bg-paper p-8 text-center">
        <h2 className="font-display text-xl font-bold">Match the logo to the name</h2>
        <p className="max-w-[380px] text-sm leading-relaxed text-muted">
          Flip cards to find matching pairs — each tech logo has a name card. Remember positions,
          make fewer moves, finish faster.
        </p>
        <div className="flex items-center gap-3 max-sm:scale-90">
          <div className="flex h-[100px] w-[80px] flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-line bg-paper-dim max-sm:h-[80px] max-sm:w-[64px]">
            <svg viewBox="-50 -50 100 100" className="h-9 w-9" xmlns="http://www.w3.org/2000/svg">
              <ellipse rx="38" ry="12" fill="none" stroke="#61dafb" strokeWidth="4.5" />
              <ellipse
                rx="38"
                ry="12"
                fill="none"
                stroke="#61dafb"
                strokeWidth="4.5"
                transform="rotate(60)"
              />
              <ellipse
                rx="38"
                ry="12"
                fill="none"
                stroke="#61dafb"
                strokeWidth="4.5"
                transform="rotate(-60)"
              />
              <circle r="6" fill="#61dafb" />
            </svg>
            <span className="font-mono text-[10px] font-bold" style={{ color: "#61dafb" }}>
              Logo
            </span>
          </div>
          <span className="text-lg text-green">↔</span>
          <div className="flex h-[100px] w-[80px] flex-col items-center justify-center gap-1 rounded-lg border-2 border-line bg-paper max-sm:h-[80px] max-sm:w-[64px]">
            <span className="font-mono text-sm font-bold" style={{ color: "#61dafb" }}>
              React
            </span>
            <span className="text-[10px] text-muted">UI Library</span>
          </div>
        </div>
        <div className="grid w-full max-w-[380px] grid-cols-3 gap-2.5 max-sm:grid-cols-1">
          {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => startGame(d)}
              className="rounded-md border-2 border-line bg-paper-dim p-3.5 text-center transition-all hover:border-yellow hover:bg-yellow/5"
            >
              <div className="text-sm font-bold text-foreground">
                {d === "easy" ? "Easy" : d === "medium" ? "Medium" : "Hard"}
              </div>
              <div className="mt-0.5 text-[11px] text-muted">
                {DIFF[d].pairs} pairs · {DIFF[d].pairs * 2} cards
              </div>
              <div className="mt-0.5 font-mono text-[10px] text-green">{DIFF[d].cols} cols</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const cfg = DIFF[diff];
  const isMobile = winWidth < 480;
  const cols = isMobile ? cfg.colsMobile : cfg.cols;

  return (
    <div className="mx-auto flex w-full max-w-[700px] flex-col items-center gap-3.5">
      {/* Stats bar */}
      <div className="flex w-full flex-wrap items-center justify-between gap-2.5">
        <div className="flex gap-2">
          {[
            { lbl: "Moves", val: String(moves) },
            { lbl: "Pairs", val: `${matchedCount}/${totalPairs}` },
            { lbl: "Time", val: timeStr },
          ].map((s) => (
            <div
              key={s.lbl}
              className="rounded-md border border-line bg-paper px-3.5 py-2 text-center"
            >
              <div className="font-mono text-sm font-bold text-green">{s.val}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted">{s.lbl}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span
            className="rounded-full border px-3 py-1 font-mono text-[11px] font-semibold"
            style={{ color: diffColor, borderColor: diffColor, background: `${diffColor}18` }}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </span>
          <button
            type="button"
            onClick={() => {
              clearTimer();
              setPhase("intro");
            }}
            className="rounded-md border border-line px-3 py-1.5 text-[11px] text-muted transition-all hover:border-foreground hover:text-foreground"
          >
            ↺ Restart
          </button>
        </div>
      </div>

      {/* Card grid */}
      <div className="flex w-full justify-center">
        <div
          className="grid w-full max-w-[600px] gap-[clamp(6px,1.5vw,10px)]"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {cards.map((card, i) => {
            const isFlipped = card.flipped || card.paired;
            const isMatched = card.paired;
            const isWrong = wrongPair?.includes(i) ?? false;
            const isPop = matchPop === i;

            return (
              <button
                key={card.uid}
                type="button"
                onClick={() => flipCard(i)}
                disabled={card.paired || card.flipped || !canFlip}
                className={cn(
                  "relative aspect-[4/5] w-full cursor-pointer rounded-[10px] border-2 border-line transition-all",
                  "disabled:cursor-default",
                  isMatched && "border-green bg-green/5",
                  isFlipped && !isMatched && "border-yellow",
                )}
                style={{ perspective: "600px" }}
              >
                <div
                  className={cn(
                    "absolute inset-0 rounded-[10px] border-2 border-line transition-transform duration-[450ms]",
                    "[transform-style:preserve-3d]",
                    (isFlipped || isMatched) && "[transform:rotateY(180deg)]",
                    isPop && "animate-[matchPop_0.35s_ease]",
                    isWrong && "animate-[wrongShake_0.4s_ease]",
                  )}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 rounded-[10px] border-2 border-line"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      background: "var(--paper)",
                      backgroundImage: "radial-gradient(circle, var(--line) 1px, transparent 1px)",
                      backgroundSize: "14px 14px",
                    }}
                  />
                  {/* Back */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-[10px] border-2 border-line",
                      isMatched && "!border-green !bg-green/5",
                      card.type === "logo" ? "bg-paper-dim" : "bg-paper",
                    )}
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div className="flex h-full flex-col items-center justify-center gap-1.5 px-1">
                      {card.type === "logo" ? (
                        <svg
                          viewBox="-50 -50 100 100"
                          className="h-[clamp(32px,7vw,44px)] w-[clamp(32px,7vw,44px)]"
                          xmlns="http://www.w3.org/2000/svg"
                          dangerouslySetInnerHTML={{
                            __html: card.svg.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, ""),
                          }}
                        />
                      ) : (
                        <>
                          <span
                            className="text-center font-mono text-[clamp(.7rem,2.2vw,.9rem)] font-bold leading-tight"
                            style={{ color: card.color }}
                          >
                            {card.name}
                          </span>
                          <span className="text-center text-[clamp(.5rem,1.4vw,.6rem)] text-muted">
                            {card.cat}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Win overlay */}
      {phase === "win" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-5">
          <div className="flex max-w-[400px] w-full flex-col items-center gap-4 rounded-xl border border-line bg-paper p-8 text-center animate-[slideUp_0.4s_cubic-bezier(.34,1.56,.64,1)]">
            <div className="text-4xl">🏆</div>
            <h2 className="font-display text-2xl font-bold">Board Cleared!</h2>
            <div className="font-mono text-5xl font-bold text-green">{score}</div>
            <div className="text-2xl tracking-wider">
              {"⭐".repeat(stars)}
              {"☆".repeat(3 - stars)}
            </div>
            <div className="grid w-full grid-cols-3 max-sm:grid-cols-2 gap-2.5">
              {[
                { val: String(moves), lbl: "Moves" },
                { val: timeStr, lbl: "Time" },
                { val: String(totalPairs), lbl: "Pairs" },
              ].map((s) => (
                <div key={s.lbl} className="rounded-lg border border-line bg-paper-dim p-2.5">
                  <div className="font-mono text-sm font-bold text-foreground">{s.val}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted">{s.lbl}</div>
                </div>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-muted">{winMessages}</p>
            <div className="grid w-full grid-cols-2 gap-2.5 max-sm:grid-cols-1">
              <button
                type="button"
                onClick={() => {
                  clearTimer();
                  setPhase("intro");
                }}
                className="rounded-md border-2 border-line px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-yellow hover:text-yellow"
              >
                Change Difficulty
              </button>
              <button
                type="button"
                onClick={() => buildGame(diff)}
                className="rounded-md border-0 bg-yellow px-4 py-2.5 text-sm font-bold text-ink transition hover:opacity-85"
                style={{ boxShadow: "3px 3px 0 var(--coral)" }}
              >
                Play Again →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline keyframes */}
      <style>{`
        @keyframes wrongShake {
          0%,100%{ transform:rotateY(180deg) translateX(0); }
          25%{ transform:rotateY(180deg) translateX(-6px); }
          75%{ transform:rotateY(180deg) translateX(6px); }
        }
        @keyframes matchPop {
          0%,100%{ transform:rotateY(180deg) scale(1); }
          50%{ transform:rotateY(180deg) scale(1.08); }
        }
        @keyframes slideUp {
          from{ transform:translateY(30px); opacity:0; }
          to{ transform:translateY(0); opacity:1; }
        }
      `}</style>
    </div>
  );
}
