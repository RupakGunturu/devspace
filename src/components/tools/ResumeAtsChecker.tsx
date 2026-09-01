import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { ToolInput } from "./ToolInput";
import { useToolAccent } from "@/components/ToolAccentContext";

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "is",
    "was",
    "are",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "shall",
    "can",
    "this",
    "that",
    "these",
    "those",
    "i",
    "we",
    "you",
    "he",
    "she",
    "it",
    "they",
    "me",
    "him",
    "her",
    "us",
    "them",
    "my",
    "your",
    "his",
    "its",
    "our",
    "their",
    "what",
    "which",
    "who",
    "whom",
    "where",
    "when",
    "why",
    "how",
    "not",
    "no",
    "nor",
    "as",
    "if",
    "then",
    "than",
    "too",
    "very",
  ]);
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-.]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
  return [...new Set(words)];
}

export function ResumeAtsChecker() {
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const { color } = useToolAccent();

  const result = useMemo(() => {
    if (!resume.trim() || !jobDesc.trim()) return null;
    const jobKeywords = extractKeywords(jobDesc);
    const resumeWords = resume.toLowerCase();
    const found = jobKeywords.filter((k) => resumeWords.includes(k));
    const missing = jobKeywords.filter((k) => !resumeWords.includes(k));
    const pct = jobKeywords.length > 0 ? Math.round((found.length / jobKeywords.length) * 100) : 0;
    return { jobKeywords, found, missing, pct };
  }, [resume, jobDesc]);

  const scoreColor = (pct: number) => {
    if (pct >= 80) return "#22c55e";
    if (pct >= 50) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <ToolLayout id="resume-ats-checker">
      <ToolInput
        value={resume}
        onChange={setResume}
        label="Resume Text"
        placeholder="Paste your resume text here..."
        rows={6}
      />
      <ToolInput
        value={jobDesc}
        onChange={setJobDesc}
        label="Job Description"
        placeholder="Paste the job description..."
        rows={6}
      />
      <ToolButton onClick={() => {}} disabled={!resume.trim() || !jobDesc.trim()}>
        Check ATS Score
      </ToolButton>

      {result && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-6">
            <div className="rounded-md border-2 border-line bg-input-bg px-6 py-4 text-center">
              <p className="font-mono text-4xl font-bold" style={{ color: scoreColor(result.pct) }}>
                {result.pct}%
              </p>
              <p className="font-mono text-[10px] uppercase text-muted">ATS Score</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-mono text-sm">
                <span className="text-muted">Keywords found: </span>
                <span className="font-bold text-green-500">{result.found.length}</span>
              </div>
              <div className="font-mono text-sm">
                <span className="text-muted">Keywords missing: </span>
                <span className="font-bold text-red-500">{result.missing.length}</span>
              </div>
              <div className="font-mono text-sm">
                <span className="text-muted">Total job keywords: </span>
                <span className="font-bold" style={{ color }}>
                  {result.jobKeywords.length}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border-2 border-green-500/20 bg-input-bg p-3">
              <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-green-500">
                Found Keywords
              </p>
              <div className="flex flex-wrap gap-1.5">
                {result.found.map((k) => (
                  <span
                    key={k}
                    className="rounded-full bg-green-500/10 px-2 py-0.5 font-mono text-xs text-green-500"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-md border-2 border-red-500/20 bg-input-bg p-3">
              <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-red-500">
                Missing Keywords
              </p>
              <div className="flex flex-wrap gap-1.5">
                {result.missing.map((k) => (
                  <span
                    key={k}
                    className="rounded-full bg-red-500/10 px-2 py-0.5 font-mono text-xs text-red-500"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
