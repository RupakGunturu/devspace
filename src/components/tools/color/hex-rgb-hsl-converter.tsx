import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function HexRgbHslConverter() {
  const [hex, setHex] = useState("#3b82f6");
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });

  const hexToRgb = (h: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
    if (result) {
      const r = parseInt(result[1], 16), g = parseInt(result[2], 16), b = parseInt(result[3], 16);
      setRgb({ r, g, b });
      const rn = r / 255, gn = g / 255, bn = b / 255;
      const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
      let h = 0, s = 0, l = (max + min) / 2;
      if (max !== min) { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; else if (max === gn) h = ((bn - rn) / d + 2) / 6; else h = ((rn - gn) / d + 4) / 6; }
      setHsl({ h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) });
    }
  };

  const fromRgb = () => {
    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    setHex(`#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`);
  };

  return (
    <ToolLayout id="hex-rgb-hsl-converter">
      <div className="space-y-3">
        <div className="space-y-2">
          <span className="text-xs font-mono text-muted-foreground">HEX</span>
          <div className="flex items-center gap-2">
            <input value={hex} onChange={(e) => { setHex(e.target.value); hexToRgb(e.target.value); }} className="flex-1 p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" placeholder="#000000" />
            <div className="w-9 h-9 rounded border border-border shrink-0" style={{ backgroundColor: hex }} />
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono text-muted-foreground">RGB</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input type="number" value={rgb.r} onChange={(e) => setRgb({ ...rgb, r: Number(e.target.value) })} placeholder="R" className="p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" />
            <input type="number" value={rgb.g} onChange={(e) => setRgb({ ...rgb, g: Number(e.target.value) })} placeholder="G" className="p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" />
            <input type="number" value={rgb.b} onChange={(e) => setRgb({ ...rgb, b: Number(e.target.value) })} placeholder="B" className="p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" />
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono text-muted-foreground">HSL</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input type="number" value={hsl.h} onChange={(e) => setHsl({ ...hsl, h: Number(e.target.value) })} placeholder="H" className="p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" />
            <input type="number" value={hsl.s} onChange={(e) => setHsl({ ...hsl, s: Number(e.target.value) })} placeholder="S" className="p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" />
            <input type="number" value={hsl.l} onChange={(e) => setHsl({ ...hsl, l: Number(e.target.value) })} placeholder="L" className="p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" />
          </div>
        </div>
      </div>
      <ToolButton onClick={fromRgb}>Update from RGB</ToolButton>
    </ToolLayout>
  );
}
