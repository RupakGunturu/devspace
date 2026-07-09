import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ColorMixer() {
  const [c1, setC1] = useState("#ff0000");
  const [c2, setC2] = useState("#0000ff");
  const [output, setOutput] = useState("");

  const hexToRgb = (h: string) => { const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h); return r ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)] : [0, 0, 0]; };
  const rgbToHex = (r: number, g: number, b: number) => `#${[r, g, b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("")}`;

  const mix = () => {
    const [r1, g1, b1] = hexToRgb(c1);
    const [r2, g2, b2] = hexToRgb(c2);
    const mixed = rgbToHex((r1 + r2) / 2, (g1 + g2) / 2, (b1 + b2) / 2);
    setOutput(`Color 1: ${c1}\nColor 2: ${c2}\nMixed (50/50): ${mixed}`);
  };

  return (
    <ToolLayout id="color-mixer">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-[10px] text-muted-foreground">Color 1</label><input type="color" value={c1} onChange={(e) => setC1(e.target.value)} className="w-full h-10 bg-background border border-border rounded cursor-pointer" /></div>
        <div><label className="text-[10px] text-muted-foreground">Color 2</label><input type="color" value={c2} onChange={(e) => setC2(e.target.value)} className="w-full h-10 bg-background border border-border rounded cursor-pointer" /></div>
      </div>
      <ToolButton onClick={mix}>Mix Colors</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
