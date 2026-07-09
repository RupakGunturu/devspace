import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ClipPathEditor() {
  const [shape, setShape] = useState<"circle" | "ellipse" | "polygon" | "inset">("circle");
  const [values, setValues] = useState("50%");
  const [output, setOutput] = useState("");

  const presets: Record<string, string[]> = {
    circle: ["50%", "40%", "30%"],
    ellipse: ["50% 50%", "50% 30%", "40% 60%"],
    polygon: ["50% 0%, 100% 50%, 50% 100%, 0% 50%", "0% 0%, 100% 0%, 100% 100%, 0% 100%", "50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%"],
    inset: ["10% 10% 10% 10%", "5% 5% 5% 5%", "0% 0% 0% 0% round 20px"],
  };

  const generate = () => setOutput(`clip-path: ${shape}(${values});`);

  return (
    <ToolLayout id="clip-path-editor">
      <div className="flex gap-2 mb-2">
        {(["circle", "ellipse", "polygon", "inset"] as const).map((s) => <button key={s} onClick={() => { setShape(s); setValues(presets[s][0]); }} className={`px-3 py-1.5 text-xs rounded-full border ${shape === s ? "bg-yellow text-white border-yellow" : "border-border text-muted-foreground"}`}>{s}</button>)}
      </div>
      <div className="flex gap-2 flex-wrap">
        {presets[shape].map((p) => <button key={p} onClick={() => setValues(p)} className="px-2 py-1 text-[10px] font-mono bg-paper-dim border border-border rounded hover:bg-paper-dim/80">{p}</button>)}
      </div>
      <div><label className="text-[10px] text-muted-foreground">Values</label><input value={values} onChange={(e) => setValues(e.target.value)} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" /></div>
      <ToolButton onClick={generate}>Generate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
