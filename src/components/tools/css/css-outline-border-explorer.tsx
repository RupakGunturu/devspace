import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CssOutlineBorderExplorer() {
  const [width, setWidth] = useState(2);
  const [color, setColor] = useState("#3b82f6");
  const [style, setStyle] = useState("solid");
  const [offset, setOffset] = useState(0);
  const [output, setOutput] = useState("");

  const styles = ["solid", "dashed", "dotted", "double", "groove", "ridge"];
  const generate = () => setOutput(`/* Border */\nborder: ${width}px ${style} ${color};\n\n/* Outline */\noutline: ${width}px ${style} ${color};\noutline-offset: ${offset}px;`);

  return (
    <ToolLayout id="css-outline-border-explorer">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-[10px] text-muted-foreground">Width: {width}px</label><input type="range" min="1" max="10" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full accent-yellow" /></div>
        <div><label className="text-[10px] text-muted-foreground">Offset: {offset}px</label><input type="range" min="-10" max="10" value={offset} onChange={(e) => setOffset(Number(e.target.value))} className="w-full accent-yellow" /></div>
        <div><label className="text-[10px] text-muted-foreground">Color</label><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-8 bg-background border border-border rounded cursor-pointer" /></div>
        <div><label className="text-[10px] text-muted-foreground">Style</label><select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-xs text-foreground">{styles.map((s) => <option key={s}>{s}</option>)}</select></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-paper-dim/50 border border-border rounded-sm text-center"><span className="text-xs text-muted-foreground mb-2 block">Border</span><div className="w-20 h-20 mx-auto bg-yellow/10" style={{ border: `${width}px ${style} ${color}` }} /></div>
        <div className="p-4 bg-paper-dim/50 border border-border rounded-sm text-center"><span className="text-xs text-muted-foreground mb-2 block">Outline</span><div className="w-20 h-20 mx-auto bg-yellow/10" style={{ outline: `${width}px ${style} ${color}`, outlineOffset: `${offset}px` }} /></div>
      </div>
      <ToolButton onClick={generate}>Generate CSS</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
