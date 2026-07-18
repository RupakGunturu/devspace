import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function BoxShadowGenerator() {
  const [shadows, setShadows] = useState([{ x: 0, y: 4, blur: 6, spread: 0, color: "#000000", opacity: 0.3 }]);
  const [output, setOutput] = useState("");

  const addShadow = () => setShadows([...shadows, { x: 0, y: 2, blur: 4, spread: 0, color: "#000000", opacity: 0.2 }]);
  const removeShadow = (i: number) => setShadows(shadows.filter((_, idx) => idx !== i));
  const update = (i: number, field: string, val: string | number) => setShadows(shadows.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const generate = () => {
    const css = shadows.map((s) => `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}${Math.round(s.opacity * 255).toString(16).padStart(2, "0")}`).join(",\n  ");
    setOutput(`box-shadow:\n  ${css};`);
  };

  return (
    <ToolLayout id="box-shadow-generator">
      <div className="space-y-3">
        {shadows.map((s, i) => (
          <div key={i} className="p-3 bg-paper-dim/50 border border-border rounded-sm space-y-2">
            <div className="flex justify-between items-center"><span className="text-xs text-muted-foreground">Shadow {i + 1}</span><button onClick={() => removeShadow(i)} className="text-xs text-coral hover:text-coral">Remove</button></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div><label className="text-[10px] text-muted-foreground">X</label><input type="number" value={s.x} onChange={(e) => update(i, "x", Number(e.target.value))} className="w-full p-1.5 bg-background border border-border rounded text-xs font-mono" /></div>
              <div><label className="text-[10px] text-muted-foreground">Y</label><input type="number" value={s.y} onChange={(e) => update(i, "y", Number(e.target.value))} className="w-full p-1.5 bg-background border border-border rounded text-xs font-mono" /></div>
              <div><label className="text-[10px] text-muted-foreground">Blur</label><input type="number" value={s.blur} onChange={(e) => update(i, "blur", Number(e.target.value))} className="w-full p-1.5 bg-background border border-border rounded text-xs font-mono" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div><label className="text-[10px] text-muted-foreground">Spread</label><input type="number" value={s.spread} onChange={(e) => update(i, "spread", Number(e.target.value))} className="w-full p-1.5 bg-background border border-border rounded text-xs font-mono" /></div>
              <div><label className="text-[10px] text-muted-foreground">Color</label><input type="color" value={s.color} onChange={(e) => update(i, "color", e.target.value)} className="w-full h-7 bg-background border border-border rounded cursor-pointer" /></div>
              <div><label className="text-[10px] text-muted-foreground">Opacity</label><input type="range" min="0" max="1" step="0.1" value={s.opacity} onChange={(e) => update(i, "opacity", parseFloat(e.target.value))} className="w-full accent-yellow" /></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-2"><ToolButton onClick={addShadow} variant="secondary">Add Shadow</ToolButton><ToolButton onClick={generate}>Generate CSS</ToolButton></div>
      <div className="w-full h-32 bg-paper-dim rounded-sm" style={{ boxShadow: shadows.map((s) => `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}${Math.round(s.opacity * 255).toString(16).padStart(2, "0")}`).join(", ") }} />
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
