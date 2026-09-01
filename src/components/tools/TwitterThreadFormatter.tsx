import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { CopyButton } from "./CopyButton";
import { useToolAccent } from "@/components/ToolAccentContext";

const MAX_CHARS = 280;

function splitIntoTweets(text: string): string[] {
  if (!text.trim()) return [];
  const words = text.split(/\s+/);
  const tweets: string[] = [];
  let current = "";

  for (const word of words) {
    if (current.length + word.length + (current ? 1 : 0) > MAX_CHARS) {
      if (current) tweets.push(current);
      current = word;
      while (current.length > MAX_CHARS) {
        tweets.push(current.slice(0, MAX_CHARS));
        current = current.slice(MAX_CHARS);
      }
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) tweets.push(current);
  return tweets;
}

export function TwitterThreadFormatter() {
  const [input, setInput] = useState("");
  const { color } = useToolAccent();
  const tweets = useMemo(() => splitIntoTweets(input), [input]);
  const total = tweets.length;

  const allFormatted = useMemo(
    () => tweets.map((t, i) => `${i + 1}/${total} ${t}`).join("\n\n"),
    [tweets, total],
  );

  return (
    <ToolLayout id="twitter-thread-formatter">
      <div className="w-full">
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Your Long Text
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type your long text here..."
          rows={8}
          spellCheck={false}
          className="w-full resize-y rounded-md border-2 bg-input-bg p-4 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          style={{ borderColor: input ? undefined : undefined }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = color;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "";
          }}
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="font-mono text-xs text-muted">{input.length} characters</span>
          {total > 0 && (
            <span className="font-mono text-xs font-medium" style={{ color }}>
              {total} tweet{total !== 1 ? "s" : ""} needed
            </span>
          )}
        </div>
      </div>

      {tweets.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Thread Preview
            </span>
            <ToolButton
              onClick={() => navigator.clipboard.writeText(allFormatted)}
              variant="secondary"
            >
              Copy All
            </ToolButton>
          </div>
          <div className="grid gap-3">
            {tweets.map((tweet, i) => (
              <div key={i} className="rounded-lg border-2 border-line bg-input-bg p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className="rounded-md px-2 py-0.5 font-mono text-xs font-bold"
                    style={{ backgroundColor: color, color: "#1a1a2e" }}
                  >
                    {i + 1}/{total}
                  </span>
                  <span
                    className="font-mono text-xs"
                    style={{
                      color:
                        tweet.length > MAX_CHARS - 20
                          ? tweet.length > MAX_CHARS
                            ? "#ef4444"
                            : "#f59e0b"
                          : undefined,
                    }}
                  >
                    {tweet.length}/{MAX_CHARS}
                  </span>
                </div>
                <p className="whitespace-pre-wrap font-sans text-sm text-foreground">{tweet}</p>
                <div className="mt-3 flex justify-end">
                  <CopyButton text={`${i + 1}/${total} ${tweet}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
