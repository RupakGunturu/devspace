import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function PrettierConfigBuilder() {
  const [semi, setSemi] = useState(true);
  const [singleQuote, setSingleQuote] = useState(false);
  const [tabWidth, setTabWidth] = useState(2);
  const [trailing, setTrailing] = useState("es5");
  const [printWidth, setPrintWidth] = useState(80);
  const [output, setOutput] = useState("");

  const generate = () => {
    setOutput(JSON.stringify({ semi, singleQuote, tabWidth, trailingComma: trailing, printWidth }, null, 2));
  };

  return (
    <ToolLayout id="prettier-config-builder">
      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer"><input type="checkbox" checked={semi} onChange={(e) => setSemi(e.target.checked)} className="accent-yellow" /> Semicolons</label>
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer"><input type="checkbox" checked={singleQuote} onChange={(e) => setSingleQuote(e.target.checked)} className="accent-yellow" /> Single Quotes</label>
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Tab Width</label><input type="number" value={tabWidth} onChange={(e) => setTabWidth(Number(e.target.value))} className="w-full p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" /></div>
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Print Width</label><input type="number" value={printWidth} onChange={(e) => setPrintWidth(Number(e.target.value))} className="w-full p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" /></div>
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Trailing Comma</label><select value={trailing} onChange={(e) => setTrailing(e.target.value)} className="w-full p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm text-foreground"><option value="es5">es5</option><option value="all">all</option><option value="none">none</option></select></div>
      </div>
      <ToolButton onClick={generate}>Generate .prettierrc</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
