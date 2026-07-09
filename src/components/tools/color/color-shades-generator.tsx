import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ColorShadesGenerator() {
  const [base, setBase] = useState("#3b82f6");
  const [output, setOutput] = useState("");

  const hexToRgb = (h: string) => { const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h); return r ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)] : [0, 0, 0]; };
  const rgbToHex = (r: number, g: number, b: number) => `#${[r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0")).join("")}`;

  const generate = () => {
    const [r, g, b] = hexToRgb(base);
    const tints = Array.from({ length: 5 }, (_, i) => rgbToHex(r + (255 - r) * ((i + 1) / 6), g + (255 - g) * ((i + 1) / 6), b + (255 - b) * ((i + 1) / 6))).reverse();
    const shades = Array.from({ length: 5 }, (_, i) => rgbToHex(r * (1 - (i + 1) / 6), g * (1 - (i + 1) / 6), b * (1 - (i + 1) / 6)));
    setOutput([...tints, base, ...shades].join("\n"));
  };

  return (
    <ToolLayout id="color-shades-generator">
      <div className="flex items-center gap-4"><label className="text-[10px] text-muted-foreground">Base</label><input type="color" value={base} onChange={(e) => setBase(e.target.value)} className="w-12 h-8 bg-background border border-border rounded cursor-pointer" /><span className="font-mono text-xs">{base}</span></div>
      <ToolButton onClick={generate}>Generate Shades</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
