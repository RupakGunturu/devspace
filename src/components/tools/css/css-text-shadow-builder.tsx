import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CssTextShadowBuilder() {
  const [shadows, setShadows] = useState([{ x: 2, y: 2, blur: 4, color: "#000000" }]);
  const [output, setOutput] = useState("");

  const add = () => setShadows([...shadows, { x: 0, y: 1, blur: 2, color: "#000000" }]);
  const remove = (i: number) => setShadows(shadows.filter((_, idx) => idx !== i));
  const update = (i: number, field: string, val: string | number) => setShadows(shadows.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const generate = () => setOutput(`text-shadow: ${shadows.map((s) => `${s.x}px ${s.y}px ${s.blur}px ${s.color}`).join(", ")};`);

  return (
    <ToolLayout id="css-text-shadow-builder">
      <div className="space-y-3">
        {shadows.map((s, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex gap-2">
              <input type="number" value={s.x} onChange={(e) => update(i, "x", Number(e.target.value))} className="flex-1 sm:w-14 p-2 bg-paper-dim/50 border border-border rounded text-xs font-mono text-foreground" placeholder="X" />
              <input type="number" value={s.y} onChange={(e) => update(i, "y", Number(e.target.value))} className="flex-1 sm:w-14 p-2 bg-paper-dim/50 border border-border rounded text-xs font-mono text-foreground" placeholder="Y" />
              <input type="number" value={s.blur} onChange={(e) => update(i, "blur", Number(e.target.value))} className="flex-1 sm:w-14 p-2 bg-paper-dim/50 border border-border rounded text-xs font-mono text-foreground" placeholder="Blur" />
            </div>
            <div className="flex items-center gap-2">
              <input type="color" value={s.color} onChange={(e) => update(i, "color", e.target.value)} className="w-9 h-9 rounded border border-border cursor-pointer" />
              <button onClick={() => remove(i)} className="text-sm text-coral">✕</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2"><ToolButton onClick={add} variant="secondary">Add Shadow</ToolButton><ToolButton onClick={generate}>Generate</ToolButton></div>
      <div className="p-4 bg-paper-dim/50 border border-border rounded-sm"><p className="text-2xl font-bold" style={{ textShadow: shadows.map((s) => `${s.x}px ${s.y}px ${s.blur}px ${s.color}`).join(", ") }}>Hello World</p></div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
