import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function FlexboxPlayground() {
  const [direction, setDirection] = useState("row");
  const [justify, setJustify] = useState("flex-start");
  const [align, setAlign] = useState("stretch");
  const [wrap, setWrap] = useState("nowrap");
  const [gap, setGap] = useState(8);
  const [output, setOutput] = useState("");

  const generate = () => setOutput(`display: flex;\nflex-direction: ${direction};\njustify-content: ${justify};\nalign-items: ${align};\nflex-wrap: ${wrap};\ngap: ${gap}px;`);

  return (
    <ToolLayout id="flexbox-playground">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className="text-[10px] text-muted-foreground">Direction</label><select value={direction} onChange={(e) => setDirection(e.target.value)} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-xs text-foreground"><option>row</option><option>row-reverse</option><option>column</option><option>column-reverse</option></select></div>
        <div><label className="text-[10px] text-muted-foreground">Justify</label><select value={justify} onChange={(e) => setJustify(e.target.value)} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-xs text-foreground"><option>flex-start</option><option>flex-end</option><option>center</option><option>space-between</option><option>space-around</option><option>space-evenly</option></select></div>
        <div><label className="text-[10px] text-muted-foreground">Align</label><select value={align} onChange={(e) => setAlign(e.target.value)} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-xs text-foreground"><option>stretch</option><option>flex-start</option><option>flex-end</option><option>center</option></select></div>
        <div><label className="text-[10px] text-muted-foreground">Wrap</label><select value={wrap} onChange={(e) => setWrap(e.target.value)} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-xs text-foreground"><option>nowrap</option><option>wrap</option><option>wrap-reverse</option></select></div>
      </div>
      <div><label className="text-[10px] text-muted-foreground">Gap: {gap}px</label><input type="range" min="0" max="32" value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-full accent-yellow" /></div>
      <div className="p-4 bg-paper-dim/50 border border-border rounded-sm" style={{ display: "flex", flexDirection: direction as any, justifyContent: justify as any, alignItems: align as any, flexWrap: wrap as any, gap: `${gap}px` }}>
        {[40, 60, 48, 56, 44, 52].map((h, i) => <div key={i} className="w-12 rounded bg-yellow" style={{ height: `${h}px` }} />)}
      </div>
      <ToolButton onClick={generate}>Generate CSS</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
