import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function TextSorter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"alpha" | "reverse" | "numeric">("alpha");

  const sort = () => {
    const lines = input.split("\n");
    if (mode === "alpha") setOutput(lines.sort().join("\n"));
    else if (mode === "reverse") setOutput(lines.sort().reverse().join("\n"));
    else setOutput(lines.sort((a, b) => parseFloat(a) - parseFloat(b)).join("\n"));
  };

  return (
    <ToolLayout id="text-sorter">
      <ToolInput value={input} onChange={setInput} placeholder="Enter one item per line..." label="Input" rows={10} />
      <div className="flex gap-2">
        {(["alpha", "reverse", "numeric"] as const).map((m) => <button key={m} onClick={() => setMode(m)} className={`px-3 py-1.5 text-xs rounded-full border transition-all ${mode === m ? "bg-yellow text-white border-yellow" : "border-border text-muted-foreground"}`}>{m}</button>)}
        <ToolButton onClick={sort}>Sort</ToolButton>
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
