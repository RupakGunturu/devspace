import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ColorPaletteGenerator() {
  const [base, setBase] = useState("#3b82f6");
  const [output, setOutput] = useState("");

  const hexToRgb = (h: string) => { const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h); return r ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)] : [0, 0, 0]; };
  const rgbToHex = (r: number, g: number, b: number) => `#${[r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0")).join("")}`;

  const generate = () => {
    const [r, g, b] = hexToRgb(base);
    const shades = Array.from({ length: 10 }, (_, i) => {
      const factor = i / 9;
      return rgbToHex(r * factor + 255 * (1 - factor), g * factor + 255 * (1 - factor), b * factor + 255 * (1 - factor));
    }).reverse();
    setOutput(shades.map((s) => `${s}`).join("\n"));
  };

  return (
    <ToolLayout id="color-palette-generator">
      <div className="flex items-center gap-4"><label className="text-[10px] text-muted-foreground">Base Color</label><input type="color" value={base} onChange={(e) => setBase(e.target.value)} className="w-12 h-8 bg-background border border-border rounded cursor-pointer" /><span className="font-mono text-xs">{base}</span></div>
      <ToolButton onClick={generate}>Generate Palette</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
