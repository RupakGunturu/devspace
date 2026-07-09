import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function BorderRadiusGenerator() {
  const [corners, setCorners] = useState({ tlx: 10, tly: 10, trx: 10, try_: 10, brx: 10, bry: 10, blx: 10, bly: 10 });
  const [output, setOutput] = useState("");

  const update = (field: string, val: number) => setCorners({ ...corners, [field]: val });

  const generate = () => setOutput(`border-radius: ${corners.tlx}px ${corners.trx}px ${corners.brx}px ${corners.blx}px / ${corners.tly}px ${corners.try_}px ${corners.bry}px ${corners.bly}px;`);

  return (
    <ToolLayout id="border-radius-generator">
      <div className="grid grid-cols-4 gap-3">
        {[{ l: "TL-X", f: "tlx" }, { l: "TL-Y", f: "tly" }, { l: "TR-X", f: "trx" }, { l: "TR-Y", f: "try_" }, { l: "BR-X", f: "brx" }, { l: "BR-Y", f: "bry" }, { l: "BL-X", f: "blx" }, { l: "BL-Y", f: "bly" }].map((c) => (
          <div key={c.f}><label className="text-[10px] text-muted-foreground">{c.l}</label><input type="number" value={corners[c.f as keyof typeof corners]} onChange={(e) => update(c.f, Number(e.target.value))} className="w-full p-1.5 bg-paper-dim/50 border border-border rounded text-xs font-mono text-foreground" /></div>
        ))}
      </div>
      <div className="flex justify-center py-4"><div className="w-24 h-24 bg-yellow" style={{ borderRadius: `${corners.tlx}px ${corners.trx}px ${corners.brx}px ${corners.blx}px / ${corners.tly}px ${corners.try_}px ${corners.bry}px ${corners.bly}px` }} /></div>
      <ToolButton onClick={generate}>Generate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
