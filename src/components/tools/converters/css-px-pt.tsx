import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CssPxPt() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"pxToPt" | "ptToPx">("pxToPt");
  const [output, setOutput] = useState("");

  const convert = () => {
    const val = parseFloat(input);
    if (isNaN(val)) { setOutput("Enter valid number"); return; }
    if (mode === "pxToPt") setOutput(`${val}px = ${(val * 0.75).toFixed(2)}pt`);
    else setOutput(`${val}pt = ${(val / 0.75).toFixed(2)}px`);
  };

  return (
    <ToolLayout id="css-px-pt">
      <div className="flex gap-2 mb-2">
        <button onClick={() => setMode("pxToPt")} className={`px-3 py-1.5 text-xs rounded-full border transition-all ${mode === "pxToPt" ? "bg-yellow text-white border-yellow" : "border-border text-muted-foreground"}`}>px → pt</button>
        <button onClick={() => setMode("ptToPx")} className={`px-3 py-1.5 text-xs rounded-full border transition-all ${mode === "ptToPx" ? "bg-yellow text-white border-yellow" : "border-border text-muted-foreground"}`}>pt → px</button>
      </div>
      <ToolInput value={input} onChange={setInput} placeholder="Enter value..." label="Value" rows={1} />
      <ToolButton onClick={convert}>Convert</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
