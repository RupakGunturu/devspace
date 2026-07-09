import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ColorHarmonyExplorer() {
  const [hex, setHex] = useState("#3b82f6");
  const [output, setOutput] = useState("");

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6; else if (max === g) h = ((b - r) / d + 2) / 6; else h = ((r - g) / d + 4) / 6; }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  const hslToHex = (h: number, s: number, l: number) => {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => { const k = (n + h / 30) % 12; return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); };
    return `#${[f(0), f(8), f(4)].map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join("")}`;
  };

  const generate = () => {
    const [h, s, l] = hexToHsl(hex);
    const complementary = hslToHex((h + 180) % 360, s, l);
    const triadic1 = hslToHex((h + 120) % 360, s, l);
    const triadic2 = hslToHex((h + 240) % 360, s, l);
    const analogous1 = hslToHex((h + 30) % 360, s, l);
    const analogous2 = hslToHex((h - 30 + 360) % 360, s, l);
    setOutput(`Base: ${hex}\nComplementary: ${complementary}\nTriadic: ${triadic1}, ${triadic2}\nAnalogous: ${analogous1}, ${analogous2}`);
  };

  return (
    <ToolLayout id="color-harmony-explorer">
      <div className="flex items-center gap-4"><label className="text-[10px] text-muted-foreground">Base</label><input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="w-12 h-8 bg-background border border-border rounded cursor-pointer" /><span className="font-mono text-xs">{hex}</span></div>
      <ToolButton onClick={generate}>Explore Harmonies</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
