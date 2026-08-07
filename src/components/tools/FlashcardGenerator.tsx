import { useCallback, useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";

interface Flashcard {
  question: string;
  answer: string;
}

function parseCards(raw: string): Flashcard[] {
  const lines = raw.split("\n").filter((l) => l.trim());
  const cards: Flashcard[] = [];
  for (const line of lines) {
    const qaMatch = line.match(/^Q:\s*(.+?)\s*\|\s*A:\s*(.+)$/i);
    if (qaMatch) {
      cards.push({ question: qaMatch[1].trim(), answer: qaMatch[2].trim() });
      continue;
    }
    const altMatch = line.match(/^Q:\s*(.+?)\s*\|\s*(.+)$/i);
    if (altMatch) {
      cards.push({ question: altMatch[1].trim(), answer: altMatch[2].trim() });
      continue;
    }
  }
  if (cards.length === 0) {
    const paragraphs = raw.split(/\n\s*\n/).filter((p) => p.trim());
    for (let i = 0; i < paragraphs.length; i += 2) {
      const q = paragraphs[i]?.trim();
      const a = paragraphs[i + 1]?.trim();
      if (q && a) {
        cards.push({ question: q, answer: a });
      } else if (q) {
        cards.push({ question: q, answer: "(no answer provided)" });
      }
    }
  }
  return cards;
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function FlashcardGenerator() {
  const { color } = useToolAccent();
  const [raw, setRaw] = useState(
    "Q: What is a hash map? | A: A data structure mapping keys to values with O(1) average lookup\nQ: What is Big-O notation? | A: Describes the upper bound of an algorithm's growth rate\nQ: What is a stack? | A: LIFO data structure — push adds to top, pop removes from top\nQ: What is recursion? | A: A function that calls itself with a base case to terminate"
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [order, setOrder] = useState<number[]>([]);

  const cards = useMemo(() => parseCards(raw), [raw]);

  const displayCards = useMemo(() => {
    if (order.length === cards.length && cards.length > 0) {
      return order.map((i) => cards[i]);
    }
    return cards;
  }, [cards, order]);

  const total = displayCards.length;
  const current = displayCards[currentIndex];

  const next = useCallback(() => {
    if (total === 0) return;
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    if (total === 0) return;
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const shuffle = useCallback(() => {
    if (cards.length === 0) return;
    const indices = cards.map((_, i) => i);
    setOrder(shuffleArray(indices));
    setCurrentIndex(0);
    setFlipped(false);
  }, [cards.length]);

  const reset = useCallback(() => {
    setOrder([]);
    setCurrentIndex(0);
    setFlipped(false);
  }, []);

  return (
    <ToolLayout id="flashcard-generator">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Paste your notes
        </label>
        <textarea
          value={raw}
          onChange={(e) => { setRaw(e.target.value); setCurrentIndex(0); setFlipped(false); setOrder([]); }}
          rows={6}
          placeholder={"Q: question | A: answer\n(one per line, or separate Q and A by blank lines)"}
          className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-4 font-mono text-sm text-input-text outline-none placeholder:text-muted"
          onFocus={(e) => { e.currentTarget.style.borderColor = color; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = ""; }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <ToolButton onClick={shuffle} disabled={total < 2}>Shuffle</ToolButton>
        <ToolButton variant="secondary" onClick={reset}>Reset Order</ToolButton>
        <span className="self-center font-mono text-xs text-muted">
          {total} card{total !== 1 ? "s" : ""} parsed
        </span>
      </div>

      {total > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-muted">
              Card {currentIndex + 1} of {total}
            </span>
            <span className="font-mono text-xs text-muted">
              {Math.round(((currentIndex + 1) / total) * 100)}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper-dim/50">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / total) * 100}%`, backgroundColor: color }}
            />
          </div>

          <div
            className="cursor-pointer select-none rounded-lg border-2 bg-input-bg p-6 min-h-[180px] flex flex-col items-center justify-center text-center transition-all"
            style={{ borderColor: color }}
            onClick={() => setFlipped(!flipped)}
          >
            <span className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted">
              {flipped ? "Answer" : "Question"}
            </span>
            <p className="text-base text-foreground max-w-lg">
              {flipped ? current.answer : current.question}
            </p>
            <span className="mt-3 font-mono text-[10px] text-muted">click to flip</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <ToolButton variant="secondary" onClick={prev}>Previous</ToolButton>
            <ToolButton onClick={() => setFlipped(!flipped)}>
              {flipped ? "Show Question" : "Show Answer"}
            </ToolButton>
            <ToolButton variant="secondary" onClick={next}>Next</ToolButton>
          </div>

          <div className="flex flex-wrap justify-center gap-1.5">
            {displayCards.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentIndex(i); setFlipped(false); }}
                className="h-6 w-6 rounded-md border-2 text-[10px] font-mono font-bold transition-all"
                style={{
                  borderColor: i === currentIndex ? color : "var(--border)",
                  backgroundColor: i === currentIndex ? color : "transparent",
                  color: i === currentIndex ? "#fff" : "var(--muted)",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {total === 0 && (
        <div className="rounded-lg border-2 border-dashed border-line bg-input-bg p-8 text-center">
          <p className="text-sm text-muted">
            Paste notes above using the format: <code className="font-mono text-foreground">Q: question | A: answer</code>
          </p>
        </div>
      )}
    </ToolLayout>
  );
}
