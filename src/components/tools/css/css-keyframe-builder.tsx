import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CssKeyframeBuilder() {
  const [name, setName] = useState("fadeIn");
  const [stops, setStops] = useState([{ percent: 0, props: "opacity: 0;" }, { percent: 100, props: "opacity: 1;" }]);
  const [output, setOutput] = useState("");

  const addStop = () => setStops([...stops, { percent: 50, props: "" }]);
  const removeStop = (i: number) => setStops(stops.filter((_, idx) => idx !== i));
  const update = (i: number, field: string, val: string | number) => setStops(stops.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const generate = () => {
    const keyframes = stops.map((s) => `  ${s.percent}% {\n    ${s.props}\n  }`).join("\n");
    setOutput(`@keyframes ${name} {\n${keyframes}\n}`);
  };

  return (
    <ToolLayout id="css-keyframe-builder">
      <div><label className="text-[10px] text-muted-foreground">Animation Name</label><input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" /></div>
      <div className="space-y-2">
        {stops.map((s, i) => (
          <div key={i} className="flex gap-2 items-start">
            <input type="number" value={s.percent} onChange={(e) => update(i, "percent", Number(e.target.value))} className="w-16 p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" />
            <input value={s.props} onChange={(e) => update(i, "props", e.target.value)} placeholder="opacity: 1;" className="flex-1 p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" />
            <button onClick={() => removeStop(i)} className="text-xs text-coral mt-2">✕</button>
          </div>
        ))}
      </div>
      <div className="flex gap-2"><ToolButton onClick={addStop} variant="secondary">Add Stop</ToolButton><ToolButton onClick={generate}>Generate</ToolButton></div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
