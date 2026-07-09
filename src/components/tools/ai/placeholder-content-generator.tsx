import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function PlaceholderContentGenerator() {
  const [type, setType] = useState("name");
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState("");

  const data: Record<string, string[]> = {
    name: ["Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince", "Eve Wilson", "Frank Miller", "Grace Lee", "Hank Davis", "Ivy Chen", "Jack Taylor"],
    email: ["alice@example.com", "bob@test.com", "charlie@mail.org", "diana@demo.net", "eve@sample.io", "frank@dev.co", "grace@work.com", "hank@lab.io", "ivy@studio.app", "jack@cloud.dev"],
    phone: ["+1-555-0101", "+1-555-0102", "+1-555-0103", "+1-555-0104", "+1-555-0105", "+1-555-0106", "+1-555-0107", "+1-555-0108", "+1-555-0109", "+1-555-0110"],
    address: ["123 Main St, NYC", "456 Oak Ave, LA", "789 Pine Rd, Chicago", "321 Elm Blvd, Houston", "654 Maple Dr, Phoenix", "987 Cedar Ln, Seattle", "147 Birch Way, Denver", "258 Walnut Ct, Boston", "369 Spruce Pl, Austin", "741 Ash Ter, Portland"],
    company: ["TechCorp", "InnovateCo", "DataFlow Inc", "CloudBase", "CodeLab", "DevStudio", "PixelWorks", "ByteShift", "StackLogic", "NetForge"],
  };

  const generate = () => setOutput((data[type] || data.name).slice(0, count).join("\n"));

  return (
    <ToolLayout id="placeholder-content-generator">
      <div className="flex gap-2 mb-2">
        {Object.keys(data).map((t) => <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 text-xs rounded-full border transition-all ${type === t ? "bg-yellow text-white border-yellow" : "border-border text-muted-foreground"}`}>{t}</button>)}
      </div>
      <div className="flex items-center gap-4">
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Count</label><input type="number" value={count} onChange={(e) => setCount(Math.min(10, Math.max(1, Number(e.target.value))))} className="w-20 p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" /></div>
        <ToolButton onClick={generate}>Generate</ToolButton>
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
