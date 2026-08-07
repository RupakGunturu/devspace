import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolInput } from "./ToolInput";
import { useToolAccent } from "@/components/ToolAccentContext";

export function ReadabilityScoreChecker() {
  const [text, setText] = useState("");
  const { color } = useToolAccent();

  const result = useMemo(() => {
    if (!text.trim()) return null;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    const syllables = words.reduce((count, word) => count + countSyllables(word), 0);
    const wordCount = words.length;
    const sentenceCount = sentences.length || 1;
    const avgWordsPerSentence = wordCount / sentenceCount;

    const fleschKincaid = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * (syllables / wordCount);
    const gradeLevel = 0.39 * avgWordsPerSentence + 11.8 * (syllables / wordCount) - 15.59;

    const fkGrade = Math.max(0, Math.round(gradeLevel * 10) / 10);
    const fkReading = Math.min(100, Math.max(0, Math.round(fleschKincaid * 10) / 10));

    const readingLevel = fkReading >= 80 ? "Easy" : fkReading >= 60 ? "Standard" : fkReading >= 40 ? "Difficult" : "Very Difficult";

    return { wordCount, sentenceCount, avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10, fkGrade, fkReading, readingLevel, syllables };
  }, [text]);

  function countSyllables(word: string): number {
    const w = word.toLowerCase().replace(/[^a-z]/g, "");
    if (w.length <= 3) return 1;
    let count = 0;
    const vowels = "aeiouy";
    let prevVowel = false;
    for (const ch of w) {
      const isVowel = vowels.includes(ch);
      if (isVowel && !prevVowel) count++;
      prevVowel = isVowel;
    }
    if (w.endsWith("e") && count > 1) count--;
    return Math.max(1, count);
  }

  const scoreColor = (val: number, max: number = 100) => {
    const pct = val / max;
    if (pct >= 0.7) return "#22c55e";
    if (pct >= 0.4) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <ToolLayout id="readability-score-checker">
      <ToolInput
        value={text}
        onChange={setText}
        label="Paste your text"
        placeholder="Paste text to analyze readability..."
        rows={8}
      />

      {result && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-md border-2 border-line bg-input-bg px-4 py-3 text-center">
              <p className="font-mono text-2xl font-bold" style={{ color }}>{result.wordCount}</p>
              <p className="font-mono text-[10px] uppercase text-muted">Words</p>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg px-4 py-3 text-center">
              <p className="font-mono text-2xl font-bold" style={{ color }}>{result.sentenceCount}</p>
              <p className="font-mono text-[10px] uppercase text-muted">Sentences</p>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg px-4 py-3 text-center">
              <p className="font-mono text-2xl font-bold" style={{ color }}>{result.syllables}</p>
              <p className="font-mono text-[10px] uppercase text-muted">Syllables</p>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg px-4 py-3 text-center">
              <p className="font-mono text-2xl font-bold" style={{ color }}>{result.avgWordsPerSentence}</p>
              <p className="font-mono text-[10px] uppercase text-muted">Avg Words/Sentence</p>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg px-4 py-3 text-center">
              <p className="font-mono text-2xl font-bold" style={{ color: scoreColor(100 - result.fkGrade, 100) }}>{result.fkGrade}</p>
              <p className="font-mono text-[10px] uppercase text-muted">Flesch-Kincaid Grade</p>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg px-4 py-3 text-center">
              <p className="font-mono text-2xl font-bold" style={{ color: scoreColor(result.fkReading) }}>{result.fkReading}</p>
              <p className="font-mono text-[10px] uppercase text-muted">Reading Ease</p>
            </div>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-4">
            <p className="mb-1 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Interpretation
            </p>
            <p className="font-mono text-sm text-foreground">
              This text has a Flesch Reading Ease score of <strong style={{ color }}>{result.fkReading}</strong>, which is
              considered <strong style={{ color }}>{result.readingLevel}</strong>.
              A {result.fkGrade > 8 ? "college" : result.fkGrade > 6 ? "high school" : "middle school"} level education
              would be needed to understand this text ({result.fkGrade}th grade).
            </p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
