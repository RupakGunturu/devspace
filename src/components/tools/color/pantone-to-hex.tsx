import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";

export default function PantoneToHex() {
  const [selected, setSelected] = useState("PMS 186 C");

  const pantone: Record<string, string> = {
    "PMS 186 C": "#C8102E", "PMS 286 C": "#0032A0", "PMS 349 C": "#046A38",
    "PMS 116 C": "#FFCD00", "PMS 021 C": "#FE5000", "PMS 293 C": "#003DA5",
    "PMS 361 C": "#43B02A", "PMS Process Blue C": "#0085CA", "PMS Yellow C": "#FEDD00",
    "PMS 185 C": "#E4002B", "PMS 302 C": "#00843D", "PMS 281 C": "#00205B",
    "PMS 7455 C": "#5B5EA6", "PMS 7473 C": "#009A44", "PMS 7406 C": "#F0AB00",
    "PMS 7421 C": "#6F263D", "PMS 282 C": "#0C2340", "PMS 356 C": "#007A33",
    "PMS 7462 C": "#1B365D", "PMS 7487 C": "#97D700",
  };

  return (
    <ToolLayout id="pantone-to-hex">
      <div className="grid grid-cols-5 gap-1.5">
        {Object.entries(pantone).map(([name, hex]) => (
          <button key={name} onClick={() => setSelected(name)} className={`p-2 rounded border text-center transition-all ${selected === name ? "border-yellow" : "border-border"}`} style={{ backgroundColor: hex }}>
            <span className="text-[8px] text-white font-mono">{name}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4 p-3 bg-paper-dim/50 border border-border rounded-sm"><div className="w-12 h-12 rounded" style={{ backgroundColor: pantone[selected] }} /><div><span className="text-sm font-medium text-foreground">{selected}</span><span className="font-mono text-xs text-muted-foreground ml-2">{pantone[selected]}</span></div></div>
    </ToolLayout>
  );
}
