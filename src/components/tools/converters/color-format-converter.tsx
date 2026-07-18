import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ColorFormatConverter() {
  const [hex, setHex] = useState("#3b82f6");
  const [rgb, setRgb] = useState("59, 130, 246");
  const [hsl, setHsl] = useState("217, 91%, 60%");

  const hexToRgb = (h: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "";
  };

  const fromHex = () => { setRgb(hexToRgb(hex)); };

  return (
    <ToolLayout id="color-format-converter">
      <div className="space-y-3">
        <div className="space-y-2">
          <span className="text-xs font-mono text-muted-foreground">HEX</span>
          <div className="flex items-center gap-2">
            <input value={hex} onChange={(e) => setHex(e.target.value)} className="flex-1 p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" placeholder="#000000" />
            <div className="w-9 h-9 rounded border border-border shrink-0" style={{ backgroundColor: hex }} />
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono text-muted-foreground">RGB</span>
          <input value={rgb} onChange={(e) => setRgb(e.target.value)} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" placeholder="59, 130, 246" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono text-muted-foreground">HSL</span>
          <input value={hsl} onChange={(e) => setHsl(e.target.value)} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" placeholder="217, 91%, 60%" />
        </div>
      </div>
      <ToolButton onClick={fromHex}>Convert from HEX</ToolButton>
    </ToolLayout>
  );
}
