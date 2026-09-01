import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { CopyButton } from "./CopyButton";

export function LinkedinPostFormatter() {
  const [text, setText] = useState(
    "Hey everyone!\n\nI just launched my new portfolio website built with React and Tailwind CSS.\n\nKey features:\n- Dark mode support\n- Responsive design\n- Fast performance\n\nCheck it out and let me know what you think!\n\n#webdev #react #portfolio",
  );
  const formatted = useMemo(() => {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n\n");
  }, [text]);
  const charCount = formatted.length;
  const lineBreaks = text.split("\n").filter((l) => l.trim() === "").length;

  return (
    <ToolLayout id="linkedin-post-formatter">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Your Post
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none focus:border-accent"
        />
      </div>
      <div className="flex gap-4 text-xs font-mono text-muted">
        <span>{charCount} characters</span>
        <span>{lineBreaks} blank lines</span>
        {charCount > 3000 && <span className="text-red-500">Over 3000 char limit!</span>}
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Formatted Output
          </label>
          <CopyButton text={formatted} />
        </div>
        <pre className="min-h-[120px] max-h-[400px] whitespace-pre-wrap rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text">
          {formatted}
        </pre>
      </div>
    </ToolLayout>
  );
}
