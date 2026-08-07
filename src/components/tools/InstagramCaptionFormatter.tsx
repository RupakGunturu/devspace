import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { CopyButton } from "./CopyButton";
import { useToolAccent } from "@/components/ToolAccentContext";

const EMOJI_CATEGORIES: Record<string, string[]> = {
  "Love & Hearts": ["❤️", "😍", "🥰", "💕", "💖", "💗", "💘", "💝", "♥️", "🫶", "💑", "💏", "🤩", "😍", "😘", "💞"],
  Nature: ["🌿", "🌸", "🌺", "🌻", "🌼", "🍀", "🍃", "🌱", "🌈", "⭐", "🌙", "☀️", "🌊", "🔥", "❄️", "💎"],
  Food: ["🍕", "🍔", "🍟", "🌮", "🍣", "🍩", "🧁", "🍰", "☕", "🍷", "🥤", "🍳", "🥑", "🍓", "🫐", "🧇"],
  Travel: ["✈️", "🌍", "🗺️", "🏖️", "⛰️", "🏕️", "🎒", "📸", "🏛️", "🗼", "🌅", "🌄", "🚂", "🚗", "🛳️", "🏝️"],
  "Celebration": ["🎉", "🎊", "🥳", "🎈", "🎁", "🏆", "🥇", "🎯", "✨", "💫", "🎵", "🎶", "🪩", "🎆", "🎇", "🥂"],
  Gestures: ["👍", "👏", "🙌", "💪", "✌️", "🤙", "👊", "🤝", "🙏", "👀", "💡", "🔔", "📌", "🏷️", "✅", "🚀"],
};

function formatCaption(text: string): string {
  let lines = text.split("\n");
  lines = lines.map((line) => line.trimEnd());
  lines = lines.filter((line, i) => !(line === "" && i > 0 && lines[i - 1] === ""));
  return lines.join("\n");
}

export function InstagramCaptionFormatter() {
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState(Object.keys(EMOJI_CATEGORIES)[0]);
  const { color } = useToolAccent();

  const formatted = useMemo(() => {
    const parts: string[] = [];
    const emojiStr = selectedEmojis.length > 0 ? selectedEmojis.join(" ") + "\n" : "";
    const formattedCaption = formatCaption(caption);
    const hashtagStr = hashtags.trim()
      ? "\n\n" + hashtags.trim().split(/\s+/).join(" ")
      : "";
    parts.push(emojiStr + formattedCaption + hashtagStr);
    return parts.join("");
  }, [caption, hashtags, selectedEmojis]);

  const charCount = formatted.length;
  const lineBreakCount = (caption.match(/\n/g) || []).length;

  const toggleEmoji = (emoji: string) => {
    setSelectedEmojis((prev) =>
      prev.includes(emoji) ? prev.filter((e) => e !== emoji) : [...prev, emoji]
    );
  };

  const previewLines = formatted.split("\n");

  return (
    <ToolLayout id="instagram-caption-formatter">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Caption Text
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your Instagram caption here. Use blank lines for paragraph breaks."
              rows={8}
              spellCheck={false}
              className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-4 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
              onFocus={(e) => { e.currentTarget.style.borderColor = color; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = ""; }}
            />
            <div className="mt-1 flex items-center justify-between">
              <span className="font-mono text-xs text-muted">
                {caption.length} chars · {lineBreakCount} line break{lineBreakCount !== 1 ? "s" : ""}
              </span>
              <span
                className="font-mono text-xs"
                style={{ color: charCount > 2200 ? "#ef4444" : charCount > 2000 ? "#f59e0b" : undefined }}
              >
                {charCount}/2,200
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Hashtags (space-separated)
            </label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#photography #travel #nature"
              className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
              onFocus={(e) => { e.currentTarget.style.borderColor = color; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = ""; }}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Emoji Picker
              </span>
              {selectedEmojis.length > 0 && (
                <button
                  onClick={() => setSelectedEmojis([])}
                  className="font-mono text-xs text-coral underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="mb-2 flex flex-wrap gap-1">
              {Object.keys(EMOJI_CATEGORIES).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="rounded-md border-2 px-2 py-1 font-mono text-[10px] font-medium transition-all"
                  style={{
                    borderColor: activeCategory === cat ? color : undefined,
                    backgroundColor: activeCategory === cat ? color : undefined,
                    color: activeCategory === cat ? "#1a1a2e" : undefined,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {EMOJI_CATEGORIES[activeCategory].map((emoji, i) => (
                <button
                  key={`${emoji}-${i}`}
                  onClick={() => toggleEmoji(emoji)}
                  className="flex h-8 w-8 items-center justify-center rounded-md border-2 text-base transition-all hover:scale-110"
                  style={{
                    borderColor: selectedEmojis.includes(emoji) ? color : undefined,
                    backgroundColor: selectedEmojis.includes(emoji) ? `${color}22` : undefined,
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
            {selectedEmojis.length > 0 && (
              <p className="mt-2 font-mono text-xs text-muted">
                Selected: {selectedEmojis.join(" ")}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Instagram Preview
            </span>
            <CopyButton text={formatted} />
          </div>
          <div className="rounded-xl border-2 border-line bg-black p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-orange-400" />
              <div>
                <p className="font-sans text-sm font-semibold text-white">your_username</p>
                <p className="font-sans text-xs text-gray-400">Just now</p>
              </div>
            </div>
            <div className="min-h-[200px] rounded-lg bg-gray-900 p-3">
              {previewLines.map((line, i) => (
                <p key={i} className="whitespace-pre-wrap font-sans text-sm text-white">
                  {line || "\u00A0"}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-md border-2 border-line bg-input-bg p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Formatted Output
              </span>
              <CopyButton text={formatted} />
            </div>
            <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-all font-mono text-xs text-input-text">
              {formatted || "Preview will appear here..."}
            </pre>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
