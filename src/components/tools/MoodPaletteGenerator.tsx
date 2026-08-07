import { useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { CopyButton } from "./CopyButton";
import { useToolAccent } from "@/components/ToolAccentContext";

const MOODS: Record<string, string[]> = {
  sunset: ["#FF6B35", "#F7C59F", "#EFEFD0", "#004E89", "#1A659E"],
  cyberpunk: ["#FF00FF", "#00FFFF", "#FF0080", "#8000FF", "#FFD700"],
  forest: ["#2D5016", "#4A7C59", "#8FBC8F", "#D4E7C5", "#F5F5DC"],
  ocean: ["#006994", "#40E0D0", "#00CED1", "#20B2AA", "#5F9EA0"],
  midnight: ["#191970", "#000080", "#483D8B", "#6A5ACD", "#9370DB"],
  candy: ["#FF69B4", "#FF1493", "#C71585", "#DB7093", "#FFB6C1"],
  earth: ["#8B4513", "#A0522D", "#CD853F", "#DEB887", "#D2B48C"],
  arctic: ["#E0FFFF", "#B0E0E6", "#ADD8E6", "#87CEEB", "#4682B4"],
  lavender: ["#E6E6FA", "#D8BFD8", "#DDA0DD", "#EE82EE", "#BA55D3"],
  "sunset-glow": ["#FF4500", "#FF6347", "#FF7F50", "#FF8C00", "#FFA500"],
  tropical: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
  autumn: ["#8B0000", "#CD3700", "#EE5C42", "#FF6347", "#FF7F50"],
  neon: ["#39FF14", "#FF073A", "#00F0FF", "#FF61FF", "#FFFF00"],
  pastel: ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF"],
  royal: ["#7851A9", "#4B0082", "#191970", "#002366", "#120A8F"],
};

function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

export function MoodPaletteGenerator() {
  const [mood, setMood] = useState("");
  const { color } = useToolAccent();
  const moods = Object.keys(MOODS);

  const filtered = mood.trim()
    ? moods.filter((m) => m.includes(mood.toLowerCase()))
    : moods;

  return (
    <ToolLayout id="mood-palette-generator">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Search Mood
        </label>
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="e.g. sunset, neon, forest..."
          className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          onFocus={(e) => { e.currentTarget.style.borderColor = color; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = ""; }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filtered.map((m) => (
          <button
            key={m}
            onClick={() => setMood(m)}
            className="rounded-full border-2 border-line px-3 py-1.5 font-mono text-xs capitalize transition-all hover:border-current"
            style={{
              borderColor: mood === m ? color : undefined,
              backgroundColor: mood === m ? color : undefined,
              color: mood === m ? "#fff" : undefined,
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((m) => {
          const colors = MOODS[m];
          const allColors = colors.join(", ");
          return (
            <div key={m}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                  {m}
                </span>
                <CopyButton text={allColors} />
              </div>
              <div className="flex gap-2">
                {colors.map((c) => (
                  <div key={c} className="group flex flex-col items-center gap-1">
                    <div
                      className="h-14 w-14 rounded-md border-2 border-line transition-transform hover:scale-110"
                      style={{ backgroundColor: c }}
                    />
                    <span className="font-mono text-[10px] text-muted">{c}</span>
                    <CopyButton text={c} className="border-0 px-1 py-0 opacity-0 group-hover:opacity-100" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </ToolLayout>
  );
}
