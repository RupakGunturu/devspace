import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { ToolInput } from "./ToolInput";
import { CopyButton } from "./CopyButton";

const ACTION_VERBS = [
  "Spearheaded",
  "Engineered",
  "Optimized",
  "Architected",
  "Implemented",
  "Streamlined",
  "Accelerated",
  "Launched",
  "Transformed",
  "Revolutionized",
  "Spearheaded",
  "Delivered",
  "Drove",
  "Pioneered",
  "Orchestrated",
];

const METRICS = [
  "resulting in a 30% improvement in efficiency",
  "reducing costs by 25% and saving 10 hours per week",
  "increasing user engagement by 40%",
  "achieving a 99.9% uptime across all services",
  "processing 2x more data with 50% less latency",
  "improving conversion rates by 20%",
  "cutting deployment time from 2 hours to 15 minutes",
  "growing monthly active users by 150%",
  "reducing bug count by 60% within the first quarter",
  "increasing code coverage from 45% to 92%",
];

function generateRewrite(original: string): string {
  const verb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];
  const metric = METRICS[Math.floor(Math.random() * METRICS.length)];
  const cleaned = original
    .replace(/^(worked on|helped with|did|was responsible for|assisted with)\s*/i, "")
    .replace(/^[a-z]/, (c) => c.toUpperCase())
    .trim();
  const base = cleaned.length > 20 ? cleaned.slice(0, 60) : cleaned;
  return `${verb} ${base.toLowerCase()}, ${metric}`;
}

export function ResumeBulletRewriter() {
  const [input, setInput] = useState("");

  const rewrites = useMemo(() => {
    if (!input.trim()) return [];
    return Array.from({ length: 3 }, () => generateRewrite(input.trim()));
  }, [input]);

  return (
    <ToolLayout id="resume-bullet-rewriter">
      <ToolInput
        value={input}
        onChange={setInput}
        label="Weak Bullet Point"
        placeholder="e.g. Worked on the frontend and fixed bugs"
        rows={3}
      />
      <ToolButton onClick={() => {}} disabled={!input.trim()}>
        Rewrite
      </ToolButton>

      {rewrites.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
            STAR Method Rewrites
          </span>
          {rewrites.map((r, i) => (
            <div
              key={i}
              className="group flex items-start justify-between rounded-md border-2 border-line bg-input-bg p-4"
            >
              <div>
                <span className="mb-1 inline-block rounded-full bg-blue-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-500">
                  #{i + 1}
                </span>
                <p className="mt-1 font-mono text-sm text-foreground">{r}</p>
              </div>
              <CopyButton text={r} className="mt-1 shrink-0 opacity-0 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
