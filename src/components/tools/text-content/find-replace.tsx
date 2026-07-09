import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function FindReplace() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  const [output, setOutput] = useState("");

  const process = () => {
    try {
      if (useRegex) {
        const regex = new RegExp(find, "g");
        setOutput(text.replace(regex, replace));
      } else {
        setOutput(text.split(find).join(replace));
      }
    } catch { setOutput("Invalid regex pattern"); }
  };

  return (
    <ToolLayout id="find-replace">
      <ToolInput value={text} onChange={setText} placeholder="Enter text..." label="Text" rows={6} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Find</label>
          <input value={find} onChange={(e) => setFind(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Replace</label>
          <input value={replace} onChange={(e) => setReplace(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
          <input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} className="accent-yellow" /> Regex
        </label>
        <ToolButton onClick={process}>Find & Replace</ToolButton>
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
