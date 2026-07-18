import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ColorGradientGenerator() {
  const [stops, setStops] = useState([{ color: "#3b82f6", position: 0 }, { color: "#8b5cf6", position: 50 }, { color: "#ec4899", position: 100 }]);
  const [output, setOutput] = useState("");

  const add = () => setStops([...stops, { color: "#22c55e", position: 75 }]);
  const remove = (i: number) => setStops(stops.filter((_, idx) => idx !== i));
  const update = (i: number, field: string, val: string | number) => setStops(stops.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const generate = () => {
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    setOutput(`background: linear-gradient(to right, ${sorted.map((s) => `${s.color} ${s.position}%`).join(", ")});`);
  };

  return (
    <ToolLayout id="color-gradient-generator">
      <div className="space-y-3">
        {stops.map((s, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <input type="color" value={s.color} onChange={(e) => update(i, "color", e.target.value)} className="w-10 h-9 rounded border border-border cursor-pointer" />
              <span className="text-xs font-mono w-10 text-muted-foreground">{s.position}%</span>
              <button onClick={() => remove(i)} className="text-sm text-coral">✕</button>
            </div>
            <input type="range" min="0" max="100" value={s.position} onChange={(e) => update(i, "position", Number(e.target.value))} className="flex-1 accent-yellow" />
          </div>
        ))}
      </div>
      <div className="h-8 rounded-sm" style={{ background: `linear-gradient(to right, ${[...stops].sort((a, b) => a.position - b.position).map((s) => `${s.color} ${s.position}%`).join(", ")})` }} />
      <div className="flex gap-2"><ToolButton onClick={add} variant="secondary">Add Stop</ToolButton><ToolButton onClick={generate}>Generate CSS</ToolButton></div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
