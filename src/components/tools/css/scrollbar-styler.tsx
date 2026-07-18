import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ScrollbarStyler() {
  const [width, setWidth] = useState(8);
  const [thumbColor, setThumbColor] = useState("#888888");
  const [trackColor, setTrackColor] = useState("#f1f1f1");
  const [radius, setRadius] = useState(4);
  const [output, setOutput] = useState("");

  const generate = () => {
    setOutput(`::-webkit-scrollbar {\n  width: ${width}px;\n}\n::-webkit-scrollbar-track {\n  background: ${trackColor};\n}\n::-webkit-scrollbar-thumb {\n  background: ${thumbColor};\n  border-radius: ${radius}px;\n}\n::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}`);
  };

  return (
    <ToolLayout id="scrollbar-styler">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-[10px] text-muted-foreground">Width: {width}px</label><input type="range" min="4" max="20" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full accent-yellow" /></div>
        <div><label className="text-[10px] text-muted-foreground">Radius: {radius}px</label><input type="range" min="0" max="10" value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full accent-yellow" /></div>
        <div><label className="text-[10px] text-muted-foreground">Thumb Color</label><input type="color" value={thumbColor} onChange={(e) => setThumbColor(e.target.value)} className="w-full h-8 bg-background border border-border rounded cursor-pointer" /></div>
        <div><label className="text-[10px] text-muted-foreground">Track Color</label><input type="color" value={trackColor} onChange={(e) => setTrackColor(e.target.value)} className="w-full h-8 bg-background border border-border rounded cursor-pointer" /></div>
      </div>
      <ToolButton onClick={generate}>Generate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
