import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function TextDiff() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [result, setResult] = useState<{ type: "same" | "added" | "removed"; text: string }[]>([]);

  const diff = () => {
    const linesA = textA.split("\n");
    const linesB = textB.split("\n");
    const maxLen = Math.max(linesA.length, linesB.length);
    const r: { type: "same" | "added" | "removed"; text: string }[] = [];
    for (let i = 0; i < maxLen; i++) {
      if (i >= linesA.length) r.push({ type: "added", text: linesB[i] });
      else if (i >= linesB.length) r.push({ type: "removed", text: linesA[i] });
      else if (linesA[i] === linesB[i]) r.push({ type: "same", text: linesA[i] });
      else { r.push({ type: "removed", text: linesA[i] }); r.push({ type: "added", text: linesB[i] }); }
    }
    setResult(r);
  };

  return (
    <ToolLayout id="text-diff">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ToolInput value={textA} onChange={setTextA} placeholder="Original text..." label="Text A" rows={8} />
        <ToolInput value={textB} onChange={setTextB} placeholder="Modified text..." label="Text B" rows={8} />
      </div>
      <ToolButton onClick={diff}>Compare</ToolButton>
      {result.length > 0 && (
        <div className="w-full font-mono text-sm border border-border rounded-sm overflow-hidden">
          {result.map((r, i) => (
            <div key={i} className={`px-4 py-0.5 border-b border-border ${r.type === "added" ? "bg-coral/10 text-green-600" : r.type === "removed" ? "bg-coral/10 text-red-600 line-through" : "text-foreground"}`}>
              <span className="text-muted-foreground select-none mr-2">{r.type === "added" ? "+" : r.type === "removed" ? "-" : " "}</span>
              {r.text}
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
