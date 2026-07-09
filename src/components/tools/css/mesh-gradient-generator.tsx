import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function MeshGradientGenerator() {
  const [base, setBase] = useState("#1a1a2e");
  const [c1, setC1] = useState("#e94560");
  const [c2, setC2] = useState("#0f3460");
  const [c3, setC3] = useState("#16213e");
  const [output, setOutput] = useState("");

  const generate = () => setOutput(`background:\n  radial-gradient(at 40% 20%, ${c1} 0px, transparent 50%),\n  radial-gradient(at 80% 0%, ${c2} 0px, transparent 50%),\n  radial-gradient(at 0% 50%, ${c3} 0px, transparent 50%),\n  radial-gradient(at 80% 50%, ${c1}80 0px, transparent 50%),\n  radial-gradient(at 0% 100%, ${c2}80 0px, transparent 50%),\n  ${base};`);

  return (
    <ToolLayout id="mesh-gradient-generator">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-[10px] text-muted-foreground">Base</label><input type="color" value={base} onChange={(e) => setBase(e.target.value)} className="w-full h-8 bg-background border border-border rounded cursor-pointer" /></div>
        <div><label className="text-[10px] text-muted-foreground">Color 1</label><input type="color" value={c1} onChange={(e) => setC1(e.target.value)} className="w-full h-8 bg-background border border-border rounded cursor-pointer" /></div>
        <div><label className="text-[10px] text-muted-foreground">Color 2</label><input type="color" value={c2} onChange={(e) => setC2(e.target.value)} className="w-full h-8 bg-background border border-border rounded cursor-pointer" /></div>
        <div><label className="text-[10px] text-muted-foreground">Color 3</label><input type="color" value={c3} onChange={(e) => setC3(e.target.value)} className="w-full h-8 bg-background border border-border rounded cursor-pointer" /></div>
      </div>
      <ToolButton onClick={generate}>Generate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
