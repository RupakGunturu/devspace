import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { CopyButton } from "./CopyButton";
import { useToolAccent } from "@/components/ToolAccentContext";

const SEO_KEYWORDS: Record<string, string[]> = {
  viral: [
    "best",
    "ultimate",
    "insane",
    "incredible",
    "secret",
    "hack",
    "trick",
    "proven",
    "shocking",
    "unbelievable",
  ],
  engagement: [
    "how to",
    "why",
    "what",
    "guide",
    "tutorial",
    "tips",
    "tricks",
    "explained",
    "step by step",
    "beginner",
  ],
  urgency: [
    "now",
    "today",
    "2026",
    "new",
    "don't miss",
    "fast",
    "quick",
    "easy",
    "simple",
    "instant",
  ],
  emotional: [
    "amazing",
    "crazy",
    "epic",
    "mind-blowing",
    "game changer",
    "must watch",
    "never before",
    "exclusive",
    "free",
    "secret",
  ],
  numbers: ["10", "7", "5", "3", "100", "1000", "top", "best", "worst", "first"],
};

const THUMBNAIL_WIDTH = 640;
const THUMBNAIL_HEIGHT = 360;

interface SeoScore {
  keywordScore: number;
  lengthScore: number;
  capsScore: number;
  total: number;
  breakdown: { label: string; score: number; max: number }[];
}

function calculateSeoScore(title: string): SeoScore {
  if (!title.trim()) {
    return { keywordScore: 0, lengthScore: 0, capsScore: 0, total: 0, breakdown: [] };
  }

  const lower = title.toLowerCase();
  let keywordHits = 0;
  for (const words of Object.values(SEO_KEYWORDS)) {
    for (const w of words) {
      if (lower.includes(w)) keywordHits++;
    }
  }
  const keywordScore = Math.min(40, keywordHits * 8);

  const len = title.length;
  let lengthScore = 0;
  if (len >= 20 && len <= 60) lengthScore = 30;
  else if (len >= 10 && len <= 80) lengthScore = 20;
  else if (len > 0) lengthScore = 10;

  const capsWords = title
    .split(/\s+/)
    .filter((w) => w === w.toUpperCase() && w.length > 1 && /[A-Z]/.test(w)).length;
  const totalWords = title.split(/\s+/).length;
  const capsRatio = totalWords > 0 ? capsWords / totalWords : 0;
  let capsScore = 0;
  if (capsRatio > 0 && capsRatio <= 0.4) capsScore = 30;
  else if (capsRatio > 0.4 && capsRatio <= 0.7) capsScore = 15;

  const total = keywordScore + lengthScore + capsScore;

  return {
    keywordScore,
    lengthScore,
    capsScore,
    total,
    breakdown: [
      { label: "Keywords", score: keywordScore, max: 40 },
      { label: "Length", score: lengthScore, max: 30 },
      { label: "Caps Usage", score: capsScore, max: 30 },
    ],
  };
}

function ThumbnailPreview({ text, bgColor }: { text: string; bgColor: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-lg border-2 border-line"
      style={{ width: "100%", aspectRatio: `${THUMBNAIL_WIDTH}/${THUMBNAIL_HEIGHT}` }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center p-6"
        style={{ backgroundColor: bgColor }}
      >
        <p
          className="text-center font-sans text-2xl font-black uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          style={{ textShadow: "3px 3px 6px rgba(0,0,0,0.8)" }}
        >
          {text || "THUMBNAIL TEXT"}
        </p>
      </div>
      <div className="absolute bottom-1 right-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[8px] text-white/60">
        1280×720
      </div>
    </div>
  );
}

function ScoreBar({
  label,
  score,
  max,
  color,
}: {
  label: string;
  score: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 font-mono text-xs text-muted">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-700">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-12 text-right font-mono text-xs text-muted">
        {score}/{max}
      </span>
    </div>
  );
}

export function YoutubeAbTextTester() {
  const [titleA, setTitleA] = useState("");
  const [titleB, setTitleB] = useState("");
  const [bgA, setBgA] = useState("#dc2626");
  const [bgB, setBgB] = useState("#2563eb");
  const { color } = useToolAccent();

  const scoreA = useMemo(() => calculateSeoScore(titleA), [titleA]);
  const scoreB = useMemo(() => calculateSeoScore(titleB), [titleB]);

  const scoreColor = (s: number) => {
    if (s >= 70) return "#22c55e";
    if (s >= 40) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <ToolLayout id="youtube-ab-text-tester">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Variant A
          </span>
          <div>
            <label className="mb-1 block font-mono text-xs text-muted">Title</label>
            <input
              type="text"
              value={titleA}
              onChange={(e) => setTitleA(e.target.value)}
              placeholder="Enter title variant A..."
              maxLength={100}
              className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = color;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "";
              }}
            />
            <p className="mt-1 font-mono text-xs text-muted">{titleA.length}/100</p>
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-muted">Thumbnail Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgA}
                onChange={(e) => setBgA(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border-0"
              />
              <span className="font-mono text-xs text-muted">{bgA}</span>
            </div>
          </div>
          <ThumbnailPreview text={titleA} bgColor={bgA} />
          <div className="rounded-md border-2 border-line bg-input-bg p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                SEO Score
              </span>
              <span
                className="font-mono text-lg font-bold"
                style={{ color: scoreColor(scoreA.total) }}
              >
                {scoreA.total}/100
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {scoreA.breakdown.map((b) => (
                <ScoreBar
                  key={b.label}
                  label={b.label}
                  score={b.score}
                  max={b.max}
                  color={scoreColor((b.score / b.max) * 100)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Variant B
          </span>
          <div>
            <label className="mb-1 block font-mono text-xs text-muted">Title</label>
            <input
              type="text"
              value={titleB}
              onChange={(e) => setTitleB(e.target.value)}
              placeholder="Enter title variant B..."
              maxLength={100}
              className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = color;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "";
              }}
            />
            <p className="mt-1 font-mono text-xs text-muted">{titleB.length}/100</p>
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-muted">Thumbnail Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgB}
                onChange={(e) => setBgB(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border-0"
              />
              <span className="font-mono text-xs text-muted">{bgB}</span>
            </div>
          </div>
          <ThumbnailPreview text={titleB} bgColor={bgB} />
          <div className="rounded-md border-2 border-line bg-input-bg p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                SEO Score
              </span>
              <span
                className="font-mono text-lg font-bold"
                style={{ color: scoreColor(scoreB.total) }}
              >
                {scoreB.total}/100
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {scoreB.breakdown.map((b) => (
                <ScoreBar
                  key={b.label}
                  label={b.label}
                  score={b.score}
                  max={b.max}
                  color={scoreColor((b.score / b.max) * 100)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {(titleA || titleB) && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Comparison Summary
            </span>
            <CopyButton
              text={`Variant A: "${titleA}" — SEO: ${scoreA.total}/100\nVariant B: "${titleB}" — SEO: ${scoreB.total}/100`}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <p className="mb-1 font-mono text-xs text-muted">A Keywords</p>
              <p
                className="font-mono text-lg font-bold"
                style={{ color: scoreColor((scoreA.keywordScore / 40) * 100) }}
              >
                {scoreA.keywordScore}
              </p>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <p className="mb-1 font-mono text-xs text-muted">vs</p>
              <p className="font-mono text-lg font-bold text-muted">—</p>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <p className="mb-1 font-mono text-xs text-muted">B Keywords</p>
              <p
                className="font-mono text-lg font-bold"
                style={{ color: scoreColor((scoreB.keywordScore / 40) * 100) }}
              >
                {scoreB.keywordScore}
              </p>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <p className="mb-1 font-mono text-xs text-muted">A Length</p>
              <p
                className="font-mono text-lg font-bold"
                style={{ color: scoreColor((scoreA.lengthScore / 30) * 100) }}
              >
                {titleA.length}
              </p>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <p className="mb-1 font-mono text-xs text-muted">vs</p>
              <p className="font-mono text-lg font-bold text-muted">—</p>
            </div>
            <div className="rounded-md border-2 border-line bg-input-bg p-3 text-center">
              <p className="mb-1 font-mono text-xs text-muted">B Length</p>
              <p
                className="font-mono text-lg font-bold"
                style={{ color: scoreColor((scoreB.lengthScore / 30) * 100) }}
              >
                {titleB.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
