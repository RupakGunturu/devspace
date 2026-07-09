import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CssGridBuilder() {
  const [columns, setColumns] = useState("1fr 1fr 1fr");
  const [rows, setRows] = useState("auto");
  const [gap, setGap] = useState(16);
  const [output, setOutput] = useState("");

  const generate = () => setOutput(`display: grid;\ngrid-template-columns: ${columns};\ngrid-template-rows: ${rows};\ngap: ${gap}px;`);

  return (
    <ToolLayout id="css-grid-builder">
      <div><label className="text-[10px] text-muted-foreground">Columns</label><input value={columns} onChange={(e) => setColumns(e.target.value)} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" placeholder="1fr 1fr 1fr" /></div>
      <div><label className="text-[10px] text-muted-foreground">Rows</label><input value={rows} onChange={(e) => setRows(e.target.value)} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" placeholder="auto" /></div>
      <div><label className="text-[10px] text-muted-foreground">Gap: {gap}px</label><input type="range" min="0" max="32" value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-full accent-yellow" /></div>
      <div className="p-4 bg-paper-dim/50 border border-border rounded-sm" style={{ display: "grid", gridTemplateColumns: columns, gridTemplateRows: rows, gap: `${gap}px` }}>
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 bg-yellow rounded" />)}
      </div>
      <ToolButton onClick={generate}>Generate CSS</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
