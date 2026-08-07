import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";

interface StudyCard {
  id: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  interval: number;
  easeFactor: number;
  dueDate: Date;
  lastReviewed: Date | null;
  reviewCount: number;
}

interface SessionEntry {
  date: string;
  cardsReviewed: number;
  duration: number;
}

const INITIAL_CARDS: StudyCard[] = [
  { id: "1", topic: "Binary Search", difficulty: "medium", interval: 1, easeFactor: 2.5, dueDate: new Date(), lastReviewed: null, reviewCount: 0 },
  { id: "2", topic: "Graph BFS/DFS", difficulty: "hard", interval: 1, easeFactor: 2.5, dueDate: new Date(), lastReviewed: null, reviewCount: 0 },
  { id: "3", topic: "Array Sliding Window", difficulty: "easy", interval: 1, easeFactor: 2.5, dueDate: new Date(), lastReviewed: null, reviewCount: 0 },
  { id: "4", topic: "Dynamic Programming", difficulty: "hard", interval: 1, easeFactor: 2.5, dueDate: new Date(), lastReviewed: null, reviewCount: 0 },
  { id: "5", topic: "Tree Traversal", difficulty: "medium", interval: 1, easeFactor: 2.5, dueDate: new Date(), lastReviewed: null, reviewCount: 0 },
];

function createId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function updateCard(card: StudyCard, quality: number): StudyCard {
  let { easeFactor, interval, reviewCount } = card;
  if (quality >= 3) {
    if (reviewCount === 0) interval = 1;
    else if (reviewCount === 1) interval = 3;
    else interval = Math.round(interval * easeFactor);
    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  } else {
    interval = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  }
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);
  return {
    ...card,
    interval,
    easeFactor: Math.round(easeFactor * 100) / 100,
    dueDate,
    lastReviewed: new Date(),
    reviewCount: reviewCount + 1,
  };
}

export function SpacedRepetitionTimer() {
  const { color } = useToolAccent();
  const [cards, setCards] = useState<StudyCard[]>(INITIAL_CARDS);
  const [newTopic, setNewTopic] = useState("");
  const [newDifficulty, setNewDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [sessions, setSessions] = useState<SessionEntry[]>([]);

  const [timerRunning, setTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [sessionCardsReviewed, setSessionCardsReviewed] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const WORK_DURATION = 25 * 60;
  const BREAK_DURATION = 5 * 60;

  const dueCards = useMemo(() => {
    const now = new Date();
    return cards.filter((c) => c.dueDate <= now);
  }, [cards]);

  const upcomingCards = useMemo(() => {
    const now = new Date();
    return [...cards]
      .filter((c) => c.dueDate > now)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }, [cards]);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            setTimerRunning(false);
            if (!isBreak) {
              const entry: SessionEntry = {
                date: new Date().toLocaleDateString(),
                cardsReviewed: sessionCardsReviewed,
                duration: WORK_DURATION,
              };
              setSessions((s) => [entry, ...s].slice(0, 20));
              setIsBreak(true);
              return BREAK_DURATION;
            } else {
              setIsBreak(false);
              return WORK_DURATION;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, isBreak, sessionCardsReviewed, WORK_DURATION, BREAK_DURATION]);

  const toggleTimer = useCallback(() => {
    setTimerRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setTimerRunning(false);
    setIsBreak(false);
    setTimeLeft(WORK_DURATION);
  }, [WORK_DURATION]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const addCard = useCallback(() => {
    if (!newTopic.trim()) return;
    const card: StudyCard = {
      id: createId(),
      topic: newTopic.trim(),
      difficulty: newDifficulty,
      interval: 1,
      easeFactor: 2.5,
      dueDate: new Date(),
      lastReviewed: null,
      reviewCount: 0,
    };
    setCards((prev) => [card, ...prev]);
    setNewTopic("");
  }, [newTopic, newDifficulty]);

  const reviewCard = useCallback(
    (cardId: string, quality: number) => {
      setCards((prev) => prev.map((c) => (c.id === cardId ? updateCard(c, quality) : c)));
      setSessionCardsReviewed((prev) => prev + 1);
      setCurrentCardIndex(null);
      setShowAnswer(false);
    },
    []
  );

  const removeCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    setCurrentCardIndex(null);
  }, []);

  const selectNextDueCard = useCallback(() => {
    if (dueCards.length > 0) {
      const idx = cards.findIndex((c) => c.id === dueCards[0].id);
      setCurrentCardIndex(idx);
      setShowAnswer(false);
    }
  }, [dueCards, cards]);

  const diffColors: Record<string, string> = { easy: "#4ade80", medium: "#facc15", hard: "#f87171" };

  return (
    <ToolLayout id="spaced-repetition-timer">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-line bg-input-bg p-6">
          <span className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">
            {isBreak ? "Break Time" : "Focus Session"}
          </span>
          <span
            className="mb-4 font-mono text-5xl font-bold tabular-nums"
            style={{ color }}
          >
            {formatTime(timeLeft)}
          </span>
          <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-paper-dim/50">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${((isBreak ? BREAK_DURATION - timeLeft : WORK_DURATION - timeLeft) / (isBreak ? BREAK_DURATION : WORK_DURATION)) * 100}%`,
                backgroundColor: isBreak ? "#4ade80" : color,
              }}
            />
          </div>
          <div className="flex gap-2">
            <ToolButton onClick={toggleTimer}>
              {timerRunning ? "Pause" : "Start"}
            </ToolButton>
            <ToolButton variant="secondary" onClick={resetTimer}>
              Reset
            </ToolButton>
          </div>
        </div>

        <div className="rounded-lg border-2 border-line bg-input-bg p-4">
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Add study card
          </span>
          <input
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCard()}
            placeholder="e.g. Red-Black Trees"
            className="mb-2 w-full rounded-md border-2 border-line bg-input-bg p-2 font-mono text-sm text-input-text outline-none placeholder:text-muted"
            onFocus={(e) => { e.currentTarget.style.borderColor = color; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = ""; }}
          />
          <div className="mb-3 flex gap-1.5">
            {(["easy", "medium", "hard"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setNewDifficulty(d)}
                className="rounded-md border-2 px-3 py-1 font-mono text-xs capitalize transition-all"
                style={{
                  borderColor: newDifficulty === d ? diffColors[d] : "var(--border)",
                  backgroundColor: newDifficulty === d ? diffColors[d] : "transparent",
                  color: newDifficulty === d ? "#000" : "var(--muted)",
                }}
              >
                {d}
              </button>
            ))}
          </div>
          <ToolButton onClick={addCard} disabled={!newTopic.trim()}>Add Card</ToolButton>
        </div>
      </div>

      {dueCards.length > 0 && (
        <div className="rounded-lg border-2 bg-input-bg p-4" style={{ borderColor: color }}>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              {dueCards.length} card{dueCards.length !== 1 ? "s" : ""} due
            </span>
            {currentCardIndex === null && (
              <ToolButton onClick={selectNextDueCard}>Review Now</ToolButton>
            )}
          </div>

          {currentCardIndex !== null && cards[currentCardIndex] && (
            <div className="mt-3">
              <div className="rounded-md border border-line bg-paper-dim/20 p-4 text-center">
                <div className="mb-1 flex items-center justify-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: diffColors[cards[currentCardIndex].difficulty] }}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                    {cards[currentCardIndex].difficulty}
                  </span>
                </div>
                <p className="mb-3 text-base font-bold text-foreground">
                  {cards[currentCardIndex].topic}
                </p>
                {showAnswer ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted">
                      Interval: {cards[currentCardIndex].interval}d · Ease: {cards[currentCardIndex].easeFactor}
                    </p>
                    <div className="flex justify-center gap-1.5">
                      {[
                        { label: "Again", quality: 1 },
                        { label: "Hard", quality: 3 },
                        { label: "Good", quality: 4 },
                        { label: "Easy", quality: 5 },
                      ].map(({ label, quality }) => (
                        <ToolButton
                          key={label}
                          variant="secondary"
                          onClick={() => reviewCard(cards[currentCardIndex].id, quality)}
                        >
                          {label}
                        </ToolButton>
                      ))}
                    </div>
                  </div>
                ) : (
                  <ToolButton onClick={() => setShowAnswer(true)}>Show Answer</ToolButton>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="rounded-lg border-2 border-line bg-input-bg p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
            All cards ({cards.length})
          </span>
        </div>
        {cards.length === 0 && <p className="text-sm text-muted">No cards yet. Add one above.</p>}
        <div className="space-y-1.5">
          {cards.map((card) => {
            const isDue = card.dueDate <= new Date();
            return (
              <div
                key={card.id}
                className="flex items-center justify-between rounded-md border border-line bg-paper-dim/10 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: diffColors[card.difficulty] }}
                  />
                  <span className="font-mono text-sm text-foreground">{card.topic}</span>
                  {isDue && (
                    <span className="rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold" style={{ backgroundColor: color, color: "#fff" }}>
                      DUE
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted">
                    {card.reviewCount}x · {card.interval}d
                  </span>
                  <button
                    onClick={() => removeCard(card.id)}
                    className="text-coral/60 hover:text-coral text-xs"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {sessions.length > 0 && (
        <div className="rounded-lg border-2 border-line bg-input-bg p-4">
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Session history
          </span>
          <div className="space-y-1">
            {sessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between rounded-md bg-paper-dim/10 px-3 py-1.5 font-mono text-xs">
                <span className="text-muted">{s.date}</span>
                <span style={{ color }}>{s.cardsReviewed} cards</span>
                <span className="text-muted">{Math.floor(s.duration / 60)}min</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
