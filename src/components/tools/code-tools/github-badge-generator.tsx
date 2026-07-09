import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function GithubBadgeGenerator() {
  const [label, setLabel] = useState("build");
  const [message, setMessage] = useState("passing");
  const [color, setColor] = useState("brightgreen");
  const [output, setOutput] = useState("");

  const colors = ["brightgreen", "green", "yellowgreen", "yellow", "orange", "red", "blue", "lightgrey", "ff69b4"];
  const generate = () => setOutput(`![${label}](https://img.shields.io/badge/${label}-${message}-${color})`);

  return (
    <ToolLayout id="github-badge-generator">
      <div className="grid grid-cols-3 gap-4">
        <ToolInput value={label} onChange={setLabel} placeholder="build" label="Label" rows={1} />
        <ToolInput value={message} onChange={setMessage} placeholder="passing" label="Message" rows={1} />
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Color</label><select value={color} onChange={(e) => setColor(e.target.value)} className="w-full p-3 bg-paper-dim/50 border border-border rounded-sm text-sm text-foreground">{colors.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
      </div>
      <ToolButton onClick={generate}>Generate</ToolButton>
      {output && <div className="flex flex-col items-center gap-4"><img src={output.replace(/!\[.*?\]\((.*?)\)/, "$1")} alt="Badge" /><ToolOutput value={output} /></div>}
    </ToolLayout>
  );
}
