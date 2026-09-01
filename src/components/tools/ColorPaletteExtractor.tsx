import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { CopyButton } from "./CopyButton";
import { useToolAccent } from "@/components/ToolAccentContext";

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

interface Palette {
  name: string;
  colors: string[];
}

export function ColorPaletteExtractor() {
  const [hex, setHex] = useState("#3B82F6");
  const { color } = useToolAccent();

  const palettes = useMemo((): Palette[] => {
    if (!isValidHex(hex)) return [];
    const [h, s, l] = hexToHsl(hex);
    return [
      {
        name: "Complementary",
        colors: [hex, hslToHex((h + 180) % 360, s, l)],
      },
      {
        name: "Analogous",
        colors: [hslToHex((h - 30 + 360) % 360, s, l), hex, hslToHex((h + 30) % 360, s, l)],
      },
      {
        name: "Triadic",
        colors: [hex, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)],
      },
      {
        name: "Split-Complementary",
        colors: [hex, hslToHex((h + 150) % 360, s, l), hslToHex((h + 210) % 360, s, l)],
      },
    ];
  }, [hex]);

  return (
    <ToolLayout id="color-palette-extractor">
      <div className="flex items-end gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Base Color
          </label>
          <div className="flex items-center gap-2 rounded-md border-2 border-line bg-input-bg p-2">
            <input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="h-8 w-8 cursor-pointer border-0 bg-transparent"
            />
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="w-24 bg-transparent font-mono text-sm text-foreground outline-none"
              maxLength={7}
            />
          </div>
        </div>
        {isValidHex(hex) && (
          <div
            className="flex-1 rounded-md border-2 border-line p-4"
            style={{ backgroundColor: hex }}
          >
            <span
              className="font-mono text-sm font-bold"
              style={{ color: hexToHsl(hex)[2] > 0.5 ? "#000" : "#fff" }}
            >
              Preview
            </span>
          </div>
        )}
      </div>

      {palettes.length > 0 && (
        <div className="flex flex-col gap-4">
          {palettes.map((palette) => (
            <div key={palette.name}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                  {palette.name}
                </span>
                <CopyButton text={palette.colors.join(", ")} />
              </div>
              <div className="flex gap-2">
                {palette.colors.map((c) => (
                  <div key={c} className="group flex flex-col items-center gap-1">
                    <div
                      className="h-14 w-14 rounded-md border-2 border-line transition-transform hover:scale-110"
                      style={{ backgroundColor: c }}
                    />
                    <span className="font-mono text-[10px] text-muted">{c}</span>
                    <CopyButton
                      text={c}
                      className="border-0 px-1 py-0 opacity-0 group-hover:opacity-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
