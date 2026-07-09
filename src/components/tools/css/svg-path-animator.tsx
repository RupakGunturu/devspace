import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function SvgPathAnimator() {
  const [path, setPath] = useState("M10 80 Q 95 10 180 80");
  const [duration, setDuration] = useState(2);
  const [output, setOutput] = useState("");

  const generate = () => {
    setOutput(`path {\n  stroke-dasharray: 1000;\n  stroke-dashoffset: 1000;\n  animation: draw ${duration}s ease forwards;\n}\n\n@keyframes draw {\n  to { stroke-dashoffset: 0; }\n}\n\n<svg>\n  <path d="${path}" stroke="#3b82f6" fill="none" stroke-width="2" />\n</svg>`);
  };

  return (
    <ToolLayout id="svg-path-animator">
      <ToolInput value={path} onChange={setPath} placeholder="M10 80 Q 95 10 180 80" label="SVG Path d" rows={2} />
      <div><label className="text-[10px] text-muted-foreground">Duration: {duration}s</label><input type="range" min="0.5" max="5" step="0.5" value={duration} onChange={(e) => setDuration(parseFloat(e.target.value))} className="w-full accent-yellow" /></div>
      <ToolButton onClick={generate}>Generate Animation</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
