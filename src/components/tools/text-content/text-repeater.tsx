import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function TextRepeater() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(5);
  const [delimiter, setDelimiter] = useState("\n");
  const [output, setOutput] = useState("");

  const repeat = () => setOutput(Array(count).fill(text).join(delimiter));

  return (
    <ToolLayout id="text-repeater">
      <ToolInput value={text} onChange={setText} placeholder="Enter text to repeat..." label="Text" rows={2} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Count</label>
          <input type="number" value={count} onChange={(e) => setCount(Math.min(1000, Math.max(1, Number(e.target.value))))} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Delimiter</label>
          <input value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" placeholder="\\n" />
        </div>
      </div>
      <ToolButton onClick={repeat}>Repeat</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
