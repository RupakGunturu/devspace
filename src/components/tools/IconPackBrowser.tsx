import { useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { CopyButton } from "./CopyButton";
import { useToolAccent } from "@/components/ToolAccentContext";

const ICON_CATEGORIES: Record<string, { char: string; name: string }[]> = {
  Arrows: [
    { char: "→", name: "Right Arrow" },
    { char: "←", name: "Left Arrow" },
    { char: "↑", name: "Up Arrow" },
    { char: "↓", name: "Down Arrow" },
    { char: "↔", name: "Left-Right" },
    { char: "↕", name: "Up-Down" },
    { char: "↪", name: "Right Hook" },
    { char: "↩", name: "Left Hook" },
    { char: "↻", name: "Clockwise" },
    { char: "↺", name: "Counter-Clockwise" },
    { char: "⇒", name: "Double Right" },
    { char: "⇐", name: "Double Left" },
    { char: "⬆", name: "Heavy Up" },
    { char: "⬇", name: "Heavy Down" },
    { char: "⏩", name: "Fast Forward" },
    { char: "⏪", name: "Rewind" },
  ],
  Math: [
    { char: "±", name: "Plus-Minus" },
    { char: "×", name: "Multiply" },
    { char: "÷", name: "Divide" },
    { char: "≠", name: "Not Equal" },
    { char: "≈", name: "Almost Equal" },
    { char: "≤", name: "Less or Equal" },
    { char: "≥", name: "Greater or Equal" },
    { char: "∞", name: "Infinity" },
    { char: "∑", name: "Sum" },
    { char: "√", name: "Square Root" },
    { char: "π", name: "Pi" },
    { char: "∆", name: "Delta" },
    { char: "∫", name: "Integral" },
    { char: "∂", name: "Partial" },
    { char: "∈", name: "Element Of" },
    { char: "∀", name: "For All" },
  ],
  Shapes: [
    { char: "●", name: "Circle Filled" },
    { char: "○", name: "Circle Open" },
    { char: "■", name: "Square Filled" },
    { char: "□", name: "Square Open" },
    { char: "▲", name: "Triangle Up" },
    { char: "△", name: "Triangle Open" },
    { char: "◆", name: "Diamond Filled" },
    { char: "◇", name: "Diamond Open" },
    { char: "★", name: "Star Filled" },
    { char: "☆", name: "Star Open" },
    { char: "⬡", name: "Hexagon" },
    { char: "⬢", name: "Hexagon Filled" },
    { char: "⬠", name: "Pentagon" },
    { char: "✦", name: "Four Pointed Star" },
    { char: "✧", name: "Star Open" },
    { char: "⬟", name: "Rabbit" },
  ],
  Objects: [
    { char: "⚡", name: "Lightning" },
    { char: "🔥", name: "Fire" },
    { char: "💧", name: "Water" },
    { char: "☀", name: "Sun" },
    { char: "🌙", name: "Moon" },
    { char: "⭐", name: "Star" },
    { char: "🎵", name: "Music Note" },
    { char: "📷", name: "Camera" },
    { char: "🔑", name: "Key" },
    { char: "💡", name: "Bulb" },
    { char: "📌", name: "Pin" },
    { char: "📎", name: "Paperclip" },
    { char: "🎯", name: "Target" },
    { char: "🏆", name: "Trophy" },
    { char: "⚙", name: "Gear" },
    { char: "🔧", name: "Wrench" },
  ],
  Symbols: [
    { char: "✓", name: "Check" },
    { char: "✗", name: "Cross" },
    { char: "✦", name: "Diamond" },
    { char: "♠", name: "Spade" },
    { char: "♣", name: "Club" },
    { char: "♥", name: "Heart" },
    { char: "♦", name: "Diamond" },
    { char: "⊕", name: "Circled Plus" },
    { char: "⊖", name: "Circled Minus" },
    { char: "⊘", name: "Circled Slash" },
    { char: "⊙", name: "Circled Dot" },
    { char: "⊙", name: "Dot Circle" },
    { char: "⚠", name: "Warning" },
    { char: "♻", name: "Recycle" },
    { char: "⚑", name: "Flag" },
    { char: "⚡", name: "Zap" },
  ],
};

export function IconPackBrowser() {
  const [search, setSearch] = useState("");
  const [copiedChar, setCopiedChar] = useState<string | null>(null);
  const { color } = useToolAccent();

  const lowerSearch = search.toLowerCase();

  const handleCopy = (char: string) => {
    navigator.clipboard.writeText(char);
    setCopiedChar(char);
    setTimeout(() => setCopiedChar(null), 1500);
  };

  return (
    <ToolLayout id="icon-pack-browser">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Search Icons
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
          onFocus={(e) => {
            e.currentTarget.style.borderColor = color;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "";
          }}
        />
      </div>

      {Object.entries(ICON_CATEGORIES).map(([cat, icons]) => {
        const filtered = icons.filter(
          (ic) => !lowerSearch || ic.name.toLowerCase().includes(lowerSearch),
        );
        if (filtered.length === 0) return null;
        return (
          <div key={cat}>
            <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-muted">
              {cat} ({filtered.length})
            </p>
            <div className="grid grid-cols-8 gap-2 sm:grid-cols-12 md:grid-cols-16">
              {filtered.map((ic) => (
                <button
                  key={ic.name}
                  onClick={() => handleCopy(ic.char)}
                  title={`${ic.name} — click to copy`}
                  className="group relative flex h-10 w-10 items-center justify-center rounded-md border-2 border-line text-lg transition-all hover:border-current hover:scale-110"
                  style={{
                    borderColor: copiedChar === ic.char ? color : undefined,
                    color: copiedChar === ic.char ? color : undefined,
                  }}
                >
                  {ic.char}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {copiedChar && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded-md px-4 py-2 font-mono text-sm font-medium shadow-lg"
          style={{ backgroundColor: color, color: "#fff" }}
        >
          Copied: {copiedChar}
        </div>
      )}
    </ToolLayout>
  );
}
