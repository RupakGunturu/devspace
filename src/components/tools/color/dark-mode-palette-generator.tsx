import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function DarkModePaletteGenerator() {
  const [lightColors, setLightColors] = useState("#3b82f6\n#22c55e\n#ef4444\n#f59e0b\n#8b5cf6");
  const [output, setOutput] = useState("");

  const hexToRgb = (h: string) => { const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h); return r ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)] : [0, 0, 0]; };
  const rgbToHex = (r: number, g: number, b: number) => `#${[r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0")).join("")}`;

  const generate = () => {
    const lines = lightColors.split("\n").filter(Boolean);
    setOutput(lines.map((hex) => {
      const [r, g, b] = hexToRgb(hex);
      const dark = rgbToHex(255 - r, 255 - g, 255 - b);
      return `Light: ${hex}\nDark:  ${dark}`;
    }).join("\n\n"));
  };

  return (
    <ToolLayout id="dark-mode-palette-generator">
      <div><label className="text-[10px] text-muted-foreground">Light Palette (one hex per line)</label><textarea value={lightColors} onChange={(e) => setLightColors(e.target.value)} rows={5} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" /></div>
      <ToolButton onClick={generate}>Generate Dark Variants</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
