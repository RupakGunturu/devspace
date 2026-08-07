import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { CopyButton } from "./CopyButton";
import { ToolToggleGroup } from "./ToolToggleGroup";
import { useToolAccent } from "@/components/ToolAccentContext";

const CONTENT_TYPES = [
  { value: "blog", label: "Blog Post" },
  { value: "video", label: "Video Script" },
  { value: "social", label: "Social Media" },
];

const BLOG_OUTLINES: Record<string, { h2: string; h3s: string[] }[]> = {
  default: [
    { h2: "What Is {topic}?", h3s: ["Definition and overview", "Why it matters", "Common misconceptions"] },
    { h2: "Benefits of {topic}", h3s: ["Key advantage 1", "Key advantage 2", "Key advantage 3"] },
    { h2: "How to Get Started with {topic}", h3s: ["Step-by-step guide", "Tools and resources", "Best practices"] },
    { h2: "Common Mistakes to Avoid", h3s: ["Mistake 1", "Mistake 2", "Mistake 3"] },
    { h2: "Frequently Asked Questions", h3s: [] },
    { h2: "Conclusion", h3s: ["Key takeaways", "Call to action"] },
  ],
};

const VIDEO_OUTLINES: Record<string, { h2: string; h3s: string[] }[]> = {
  default: [
    { h2: "Introduction & Hook", h3s: ["State the problem", "Tease the solution"] },
    { h2: "What Is {topic}?", h3s: ["Quick explanation", "Why viewers should care"] },
    { h2: "Step-by-Step Walkthrough", h3s: ["Step 1", "Step 2", "Step 3"] },
    { h2: "Pro Tips & Insights", h3s: [] },
    { h2: "Wrap Up & CTA", h3s: ["Recap", "Subscribe prompt"] },
  ],
};

const SOCIAL_OUTLINES: Record<string, { h2: string; h3s: string[] }[]> = {
  default: [
    { h2: "Hook / Attention Grabber", h3s: [] },
    { h2: "Key Message About {topic}", h3s: ["Supporting point 1", "Supporting point 2"] },
    { h2: "Call to Action", h3s: [] },
  ],
};

const QUESTIONS_BLOG = [
  "What is {topic} and why does it matter?",
  "How do you get started with {topic}?",
  "What are the best practices for {topic}?",
  "What tools or resources are needed for {topic}?",
  "What common mistakes should you avoid with {topic}?",
  "How long does it take to master {topic}?",
  "What are the real-world applications of {topic}?",
  "How does {topic} compare to alternatives?",
];

const QUESTIONS_VIDEO = [
  "What problem does {topic} solve?",
  "Can you show a quick demo of {topic}?",
  "What are the top 3 things to know about {topic}?",
  "Where can viewers learn more about {topic}?",
];

const QUESTIONS_SOCIAL = [
  "What's the #1 thing to know about {topic}?",
  "Why is {topic} trending right now?",
  "What's a hot take on {topic}?",
];

export function ContentBriefGenerator() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [contentType, setContentType] = useState("blog");
  const { color } = useToolAccent();

  const brief = useMemo(() => {
    if (!topic.trim() || !audience.trim()) return null;

    const t = topic.trim();
    const a = audience.trim();

    const wordCount =
      contentType === "blog" ? "1,500 - 2,500" : contentType === "video" ? "800 - 1,200 (script)" : "280 - 500 (thread)";

    const title =
      contentType === "blog"
        ? `The Ultimate Guide to ${t} for ${a}`
        : contentType === "video"
          ? `Everything ${a} Need to Know About ${t}`
          : `${t}: What ${a} Should Know`;

    const metaDesc = `Learn everything about ${t} with this comprehensive guide for ${a}. Covers key concepts, best practices, and actionable tips.`;

    const outlines =
      contentType === "blog"
        ? BLOG_OUTLINES.default
        : contentType === "video"
          ? VIDEO_OUTLINES.default
          : SOCIAL_OUTLINES.default;

    const outline = outlines.map((o) => ({
      h2: o.h2.replace(/\{topic\}/g, t),
      h3s: o.h3s.map((h) => h.replace(/\{topic\}/g, t)),
    }));

    const questions =
      contentType === "blog"
        ? QUESTIONS_BLOG
        : contentType === "video"
          ? QUESTIONS_VIDEO
          : QUESTIONS_SOCIAL;

    const mappedQuestions = questions.map((q) => q.replace(/\{topic\}/g, t));

    return { title, metaDesc, wordCount, outline, questions: mappedQuestions };
  }, [topic, audience, contentType]);

  const copyAll = () => {
    if (!brief) return;
    let text = `CONTENT BRIEF\n${"=".repeat(40)}\n\n`;
    text += `Topic: ${topic}\nAudience: ${audience}\nType: ${contentType}\n\n`;
    text += `TITLE: ${brief.title}\n\n`;
    text += `META DESCRIPTION:\n${brief.metaDesc}\n\n`;
    text += `TARGET WORD COUNT: ${brief.wordCount}\n\n`;
    text += `OUTLINE:\n`;
    brief.outline.forEach((o) => {
      text += `\n## ${o.h2}\n`;
      o.h3s.forEach((h) => { text += `### ${h}\n`; });
    });
    text += `\nKEY QUESTIONS TO ANSWER:\n`;
    brief.questions.forEach((q) => { text += `- ${q}\n`; });
    navigator.clipboard.writeText(text);
  };

  const inputCls =
    "w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted";

  return (
    <ToolLayout id="content-brief-generator">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Target Topic
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. React Server Components"
          className={inputCls}
          onFocus={(e) => { e.currentTarget.style.borderColor = color; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = ""; }}
        />
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Target Audience
        </label>
        <input
          type="text"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="e.g. frontend developers"
          className={inputCls}
          onFocus={(e) => { e.currentTarget.style.borderColor = color; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = ""; }}
        />
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Content Type
        </label>
        <ToolToggleGroup options={CONTENT_TYPES} value={contentType} onChange={setContentType} />
      </div>

      {brief && (
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Content Brief Ready
          </span>
          <ToolButton onClick={copyAll} variant="secondary">
            Copy Entire Brief
          </ToolButton>
        </div>
      )}

      {brief && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Suggested Title
          </span>
          <p className="font-mono text-sm font-medium text-foreground">{brief.title}</p>
        </div>
      )}

      {brief && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Meta Description Suggestion
            </span>
            <CopyButton text={brief.metaDesc} />
          </div>
          <p className="font-mono text-sm text-foreground">{brief.metaDesc}</p>
          <div className="mt-1 font-mono text-[10px] text-muted">
            {brief.metaDesc.length} characters
          </div>
        </div>
      )}

      {brief && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Target Word Count
          </span>
          <p className="font-mono text-sm font-medium" style={{ color }}>{brief.wordCount}</p>
        </div>
      )}

      {brief && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <span className="mb-3 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Suggested Outline
          </span>
          <div className="space-y-4">
            {brief.outline.map((o, i) => (
              <div key={i}>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-mono text-sm font-medium text-foreground">{o.h2}</span>
                </div>
                {o.h3s.length > 0 && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-line pl-4">
                    {o.h3s.map((h, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted">→</span>
                        <span className="font-mono text-xs text-foreground">{h}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {brief && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <span className="mb-3 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Key Questions to Answer
          </span>
          <div className="space-y-2">
            {brief.questions.map((q, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="inline-block mt-0.5 font-mono text-xs font-bold" style={{ color }}>Q{i + 1}</span>
                <span className="font-mono text-sm text-foreground">{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!topic.trim() || !audience.trim() ? (
        <div className="rounded-md border-2 border-dashed border-line p-6 text-center">
          <p className="font-mono text-sm text-muted">
            Fill in the topic and audience to generate a content brief
          </p>
        </div>
      ) : null}
    </ToolLayout>
  );
}
