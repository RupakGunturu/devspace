import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CssGradientBuilder() {
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState([{ color: "#3b82f6", position: 0 }, { color: "#8b5cf6", position: 100 }]);
  const [output, setOutput] = useState("");

  const addStop = () => setStops([...stops, { color: "#ec4899", position: 50 }]);
  const removeStop = (i: number) => setStops(stops.filter((_, idx) => idx !== i));
  const update = (i: number, field: string, val: string | number) => setStops(stops.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const generate = () => {
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    const gradientStops = sorted.map((s) => `${s.color} ${s.position}%`).join(", ");
    setOutput(type === "linear" ? `background: linear-gradient(${angle}deg, ${gradientStops});` : `background: radial-gradient(circle, ${gradientStops});`);
  };

  return (
    <ToolLayout id="css-gradient-builder">
      <div className="flex gap-2 mb-2">
        <button onClick={() => setType("linear")} className={`px-3 py-1.5 text-xs rounded-full border ${type === "linear" ? "bg-yellow text-white border-yellow" : "border-border text-muted-foreground"}`}>Linear</button>
        <button onClick={() => setType("radial")} className={`px-3 py-1.5 text-xs rounded-full border ${type === "radial" ? "bg-yellow text-white border-yellow" : "border-border text-muted-foreground"}`}>Radial</button>
      </div>
      {type === "linear" && <div><label className="text-[10px] text-muted-foreground">Angle: {angle}°</label><input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-yellow" /></div>}
      <div className="space-y-2">
        {stops.map((s, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input type="color" value={s.color} onChange={(e) => update(i, "color", e.target.value)} className="w-10 h-8 rounded border border-border cursor-pointer" />
            <input type="range" min="0" max="100" value={s.position} onChange={(e) => update(i, "position", Number(e.target.value))} className="flex-1 accent-yellow" />
            <span className="text-xs font-mono w-10">{s.position}%</span>
            <button onClick={() => removeStop(i)} className="text-xs text-coral">✕</button>
          </div>
        ))}
      </div>
      <div className="flex gap-2"><ToolButton onClick={addStop} variant="secondary">Add Stop</ToolButton><ToolButton onClick={generate}>Generate</ToolButton></div>
      <div className="h-16 rounded-sm" style={{ background: type === "linear" ? `linear-gradient(${angle}deg, ${[...stops].sort((a, b) => a.position - b.position).map((s) => `${s.color} ${s.position}%`).join(", ")})` : `radial-gradient(circle, ${[...stops].sort((a, b) => a.position - b.position).map((s) => `${s.color} ${s.position}%`).join(", ")})` }} />
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
