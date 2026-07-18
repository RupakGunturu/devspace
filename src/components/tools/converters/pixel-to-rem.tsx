import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function PixelToRem() {
  const [px, setPx] = useState("");
  const [rootSize, setRootSize] = useState("16");
  const [output, setOutput] = useState("");

  const convert = () => {
    const pxVal = parseFloat(px);
    const root = parseFloat(rootSize);
    if (isNaN(pxVal) || isNaN(root) || root === 0) { setOutput("Enter valid numbers"); return; }
    const rem = pxVal / root;
    setOutput(`${pxVal}px = ${rem.toFixed(4)}rem\n\nCalculation: ${pxVal} / ${root} = ${rem.toFixed(4)}`);
  };

  return (
    <ToolLayout id="pixel-to-rem">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ToolInput value={px} onChange={setPx} placeholder="16" label="Pixels (px)" rows={1} />
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Root Font Size (px)</label>
          <input type="number" value={rootSize} onChange={(e) => setRootSize(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
        </div>
      </div>
      <ToolButton onClick={convert}>Convert</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
