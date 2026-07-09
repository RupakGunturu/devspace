import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function PatternGenerator() {
  const [type, setType] = useState<"dots" | "stripes" | "checker" | "grid">("dots");
  const [size, setSize] = useState(20);
  const [color, setColor] = useState("#3b82f6");
  const [output, setOutput] = useState("");

  const generate = () => {
    let svg = "";
    if (type === "dots") svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${size/2}" cy="${size/2}" r="${size/4}" fill="${color}"/></svg>`;
    else if (type === "stripes") svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="${size/2}" x2="${size}" y2="${size/2}" stroke="${color}" stroke-width="2"/></svg>`;
    else if (type === "checker") svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size/2}" height="${size/2}" fill="${color}"/><rect x="${size/2}" y="${size/2}" width="${size/2}" height="${size/2}" fill="${color}"/></svg>`;
    else svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="1"/></svg>`;
    const b64 = btoa(svg);
    setOutput(`background-image: url("data:image/svg+xml;base64,${b64}");\nbackground-repeat: repeat;`);
  };

  return (
    <ToolLayout id="pattern-generator">
      <div className="flex gap-2 mb-2">
        {(["dots", "stripes", "checker", "grid"] as const).map((t) => <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 text-xs rounded-full border transition-all ${type === t ? "bg-yellow text-white border-yellow" : "border-border text-muted-foreground"}`}>{t}</button>)}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Size: {size}px</label><input type="range" min="10" max="50" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-yellow" /></div>
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Color</label><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 bg-paper-dim/50 border border-border rounded-sm cursor-pointer" /></div>
      </div>
      <ToolButton onClick={generate}>Generate Pattern</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
