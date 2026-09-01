import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

const SPAM_TRIGGERS = [
  "free",
  "winner",
  "winner!!!",
  "congratulations",
  "act now",
  "urgent",
  "limited time",
  "exclusive deal",
  "no cost",
  "risk free",
  "no risk",
  "buy now",
  "order now",
  "click here",
  "subscribe now",
  "100% free",
  "amazing offer",
  "best price",
  "cash bonus",
  "credit",
  "discount",
  "do it today",
  "don't delete",
  "don't hesitate",
  "fantastic deal",
  "for free",
  "guarantee",
  "hurry",
  "immediate",
  "info you requested",
  "insurance",
  "lowest price",
  "million dollars",
  "money back",
  "no catch",
  "no obligation",
  "no strings attached",
  "obligation",
  "offer expires",
  "once in a lifetime",
  "pennies",
  "promise",
  "pure profit",
  "satisfaction",
  "special promotion",
  "take action",
  "this isn't spam",
  "trial",
  "unlimited",
  "what are you waiting for",
  "while supplies last",
  "you have been selected",
  "you're a winner",
];

const URGENCY_WORDS = [
  "now",
  "today",
  "hurry",
  "limited",
  "expires",
  "deadline",
  "last chance",
  "final",
  "ending soon",
  "only today",
  "don't miss",
  "before it's gone",
  "running out",
  "almost gone",
  "countdown",
  "last call",
];

const PERSONALIZATION_PATTERNS = [
  "%name%",
  "%first_name%",
  "%last_name%",
  "%email%",
  "%company%",
  "{{name}}",
  "{{first_name}}",
  "{{last_name}}",
  "{{email}}",
  "{name}",
  "{first_name}",
  "{last_name}",
  "@name@",
  "{{NAME}}",
  "[name]",
];

export function EmailSubjectTester() {
  const [subject, setSubject] = useState("");
  const { color } = useToolAccent();

  const analysis = useMemo(() => {
    const s = subject.trim();
    if (!s) return null;

    const lower = s.toLowerCase();
    const len = s.length;

    const foundSpam = SPAM_TRIGGERS.filter((t) => lower.includes(t));
    const foundUrgency = URGENCY_WORDS.filter((w) => lower.includes(w));
    const foundPersonalization = PERSONALIZATION_PATTERNS.filter((p) => s.includes(p));

    const emojis = s.match(/[\p{Emoji}]/gu) || [];
    const emojiCount = emojis.length;

    const wordCount = s.split(/\s+/).filter(Boolean).length;

    let score = 60;

    if (len >= 20 && len <= 50) score += 15;
    else if (len >= 10 && len <= 60) score += 8;
    else if (len < 10) score -= 15;
    else if (len > 60) score -= 10;

    score -= foundSpam.length * 8;

    if (foundPersonalization.length > 0) score += 10;

    if (foundUrgency.length > 0 && foundSpam.length === 0) score += 5;
    if (foundUrgency.length > 2) score -= 5;

    if (emojiCount === 1) score += 3;
    else if (emojiCount > 2) score -= 5;

    if (/^[A-Z]/.test(s) && !/^[A-Z\s!]+$/.test(s)) score += 3;
    if (/\?$/.test(s)) score += 5;
    if (/\d/.test(s)) score += 2;
    if (s.includes("|") || s.includes("—") || s.includes("•")) score += 2;

    if (wordCount < 3) score -= 10;
    if (wordCount > 15) score -= 5;

    score = Math.max(0, Math.min(100, score));

    return {
      len,
      wordCount,
      foundSpam,
      foundUrgency,
      foundPersonalization,
      emojiCount,
      score,
    };
  }, [subject]);

  const scoreColor = (s: number) => {
    if (s >= 75) return "#22c55e";
    if (s >= 50) return "#f59e0b";
    return "#ef4444";
  };

  const scoreLabel = (s: number) => {
    if (s >= 85) return "Excellent";
    if (s >= 75) return "Good";
    if (s >= 50) return "Average";
    return "Needs Work";
  };

  const inputCls =
    "w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted";

  const checks = analysis
    ? [
        {
          label: "Length",
          value: `${analysis.len} chars`,
          ok: analysis.len >= 20 && analysis.len <= 60,
          detail: "Optimal: 20-60 chars",
        },
        {
          label: "Words",
          value: `${analysis.wordCount}`,
          ok: analysis.wordCount >= 3 && analysis.wordCount <= 15,
          detail: "Optimal: 3-15 words",
        },
        {
          label: "Spam Words",
          value: `${analysis.foundSpam.length} found`,
          ok: analysis.foundSpam.length === 0,
          detail: analysis.foundSpam.length > 0 ? analysis.foundSpam.join(", ") : "None detected",
        },
        {
          label: "Personalization",
          value: `${analysis.foundPersonalization.length > 0 ? "Yes" : "No"}`,
          ok: analysis.foundPersonalization.length > 0,
          detail:
            analysis.foundPersonalization.length > 0
              ? analysis.foundPersonalization.join(", ")
              : "Add %name% or {{first_name}}",
        },
        {
          label: "Urgency Words",
          value: `${analysis.foundUrgency.length}`,
          ok: analysis.foundUrgency.length >= 1 && analysis.foundUrgency.length <= 2,
          detail:
            analysis.foundUrgency.length > 0
              ? analysis.foundUrgency.join(", ")
              : "Add urgency sparingly",
        },
        {
          label: "Emoji Count",
          value: `${analysis.emojiCount}`,
          ok: analysis.emojiCount >= 0 && analysis.emojiCount <= 1,
          detail: "0-1 emoji recommended",
        },
        {
          label: "Question Mark",
          value: subject.trim().endsWith("?") ? "Yes" : "No",
          ok: subject.trim().endsWith("?"),
          detail: "Questions boost opens",
        },
      ]
    : [];

  return (
    <ToolLayout id="email-subject-tester">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Subject Line
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter your email subject line..."
          maxLength={150}
          className={inputCls}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = color;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "";
          }}
        />
        {subject.trim() && (
          <div className="mt-1 flex justify-between font-mono text-[10px] text-muted">
            <span>{subject.length}/150 chars</span>
            <span>{subject.trim().split(/\s+/).filter(Boolean).length} words</span>
          </div>
        )}
      </div>

      {analysis && (
        <div className="rounded-md border-2 border-line bg-input-bg p-6 text-center">
          <div
            className="inline-flex h-24 w-24 items-center justify-center rounded-full border-4"
            style={{ borderColor: scoreColor(analysis.score) }}
          >
            <span
              className="font-mono text-3xl font-bold"
              style={{ color: scoreColor(analysis.score) }}
            >
              {analysis.score}
            </span>
          </div>
          <div
            className="mt-3 font-mono text-sm font-medium"
            style={{ color: scoreColor(analysis.score) }}
          >
            {scoreLabel(analysis.score)}
          </div>
          <div className="mt-1 font-mono text-xs text-muted">Overall Score / 100</div>
        </div>
      )}

      {analysis && (
        <div className="space-y-2">
          <span className="block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Checklist
          </span>
          {checks.map((c) => (
            <div
              key={c.label}
              className="flex items-center gap-3 rounded-md border-2 border-line bg-input-bg p-3"
            >
              <span
                className="inline-block h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: c.ok ? "#22c55e" : "#ef4444" }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium text-foreground">{c.label}</span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: c.ok ? "#22c55e" : "#ef4444" }}
                  >
                    {c.value}
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-[10px] text-muted truncate">{c.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {analysis && analysis.foundSpam.length > 0 && (
        <div className="rounded-md border-2 border-[#ef4444] bg-[#ef444410] p-4">
          <span className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-[#ef4444]">
            Spam Trigger Words Detected
          </span>
          <div className="flex flex-wrap gap-1.5">
            {analysis.foundSpam.map((w) => (
              <span
                key={w}
                className="rounded-full border border-[#ef4444] bg-[#ef444420] px-2 py-0.5 font-mono text-xs text-[#ef4444]"
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      )}

      {analysis && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Email Client Preview
          </span>
          <div className="border-b border-line pb-3">
            <div className="font-mono text-sm font-medium text-foreground">
              {subject || "(no subject)"}
            </div>
            <div className="mt-1 font-mono text-xs text-muted">
              Your Brand — This is a preview of how your subject line will appear in email
              inboxes...
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
