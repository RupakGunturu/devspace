import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function WcagContrastChecker() {
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [output, setOutput] = useState("");

  const luminance = (r: number, g: number, b: number) => { const [rs, gs, bs] = [r, g, b].map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }); return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs; };
  const hexToRgb = (h: string) => { const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h); return r ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)] : [0, 0, 0]; };

  const check = () => {
    const [r1, g1, b1] = hexToRgb(fg);
    const [r2, g2, b2] = hexToRgb(bg);
    const l1 = luminance(r1, g1, b1);
    const l2 = luminance(r2, g2, b2);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const aa = ratio >= 4.5;
    const aaa = ratio >= 7;
    const aaLarge = ratio >= 3;
    setOutput(`Contrast Ratio: ${ratio.toFixed(2)}:1\n\nAA Normal Text: ${aa ? "PASS ✓" : "FAIL ✗"}\nAA Large Text: ${aaLarge ? "PASS ✓" : "FAIL ✗"}\nAAA Normal Text: ${aaa ? "PASS ✓" : "FAIL ✗"}`);
  };

  return (
    <ToolLayout id="wcag-contrast-checker">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-[10px] text-muted-foreground">Foreground</label><div className="flex gap-2 items-center"><input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-10 h-8 bg-background border border-border rounded cursor-pointer" /><span className="font-mono text-xs">{fg}</span></div></div>
        <div><label className="text-[10px] text-muted-foreground">Background</label><div className="flex gap-2 items-center"><input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-10 h-8 bg-background border border-border rounded cursor-pointer" /><span className="font-mono text-xs">{bg}</span></div></div>
      </div>
      <div className="p-4 rounded-sm text-center" style={{ backgroundColor: bg, color: fg }}><span className="font-bold text-lg">Sample Text</span></div>
      <ToolButton onClick={check}>Check Contrast</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
