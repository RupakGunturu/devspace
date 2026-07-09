import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CubicBezierEditor() {
  const [p1x, setP1x] = useState(0.25);
  const [p1y, setP1y] = useState(0.1);
  const [p2x, setP2x] = useState(0.25);
  const [p2y, setP2y] = useState(1);
  const [output, setOutput] = useState("");

  const generate = () => setOutput(`transition-timing-function: cubic-bezier(${p1x}, ${p1y}, ${p2x}, ${p2y});`);

  return (
    <ToolLayout id="cubic-bezier-editor">
      <div className="grid grid-cols-2 gap-4">
        {[{ l: "P1 X", v: p1x, s: setP1x }, { l: "P1 Y", v: p1y, s: setP1y }, { l: "P2 X", v: p2x, s: setP2x }, { l: "P2 Y", v: p2y, s: setP2y }].map((f) => (
          <div key={f.l}><label className="text-[10px] text-muted-foreground">{f.l}: {f.v}</label><input type="range" min="0" max="1" step="0.01" value={f.v} onChange={(e) => f.s(parseFloat(e.target.value))} className="w-full accent-yellow" /></div>
        ))}
      </div>
      <div className="flex justify-center py-4"><div className="w-32 h-32 bg-paper-dim rounded-sm relative overflow-hidden"><div className="absolute bottom-0 left-0 w-full h-0 bg-yellow transition-all duration-700" style={{ height: `${p2y * 100}%` }} /></div></div>
      <ToolButton onClick={generate}>Generate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
