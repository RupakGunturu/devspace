import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function EmojiFinder() {
  const [search, setSearch] = useState("");
  const emojis: Record<string, string> = {
    "smile": "😊", "laugh": "😂", "heart": "❤️", "fire": "🔥", "star": "⭐", "check": "✅", "cross": "❌", "rocket": "🚀", "clap": "👏", "thumbs up": "👍", "wave": "👋", "thinking": "🤔", "cool": "😎", "party": "🎉", "gift": "🎁", "lightning": "⚡", "crown": "👑", "muscle": "💪", "pray": "🙏", "eyes": "👀",
    "code": "💻", "bug": "🐛", "coffee": "☕", "pizza": "🍕", "dog": "🐕", "cat": "🐱", "sun": "☀️", "moon": "🌙", "rain": "🌧️", "snow": "❄️", "rainbow": "🌈", "flower": "🌸", "tree": "🌳", "earth": "🌍", "airplane": "✈️", "car": "🚗", "music": "🎵", "book": "📚", "pen": "🖊️", "paint": "🎨",
  };

  const filtered = Object.entries(emojis).filter(([name]) => name.includes(search.toLowerCase()));

  return (
    <ToolLayout id="emoji-finder">
      <ToolInput value={search} onChange={setSearch} placeholder="Search emojis (e.g. heart, fire, code)..." label="Search" rows={1} />
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
        {filtered.map(([name, emoji]) => (
          <button key={name} onClick={() => navigator.clipboard.writeText(emoji)} className="p-2 text-2xl hover:bg-paper-dim rounded-sm transition-colors" title={name}>{emoji}</button>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No emojis found</p>}
    </ToolLayout>
  );
}
