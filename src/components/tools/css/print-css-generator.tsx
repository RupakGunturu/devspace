import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function PrintCssGenerator() {
  const [hide, setHide] = useState("nav, .sidebar, .footer, .print-hide");
  const [show, setShow] = useState("main, .content, .article");
  const [output, setOutput] = useState("");

  const generate = () => {
    const rules = [];
    if (hide) rules.push(`  ${hide.split(",").map((s) => s.trim()).join(",\n  ")} {\n    display: none !important;\n  }`);
    if (show) rules.push(`  ${show.split(",").map((s) => s.trim()).join(",\n  ")} {\n    display: block !important;\n  }`);
    rules.push(`  body {\n    font-size: 12pt;\n    color: #000;\n    background: #fff;\n  }`);
    setOutput(`@media print {\n${rules.join("\n\n")}\n}`);
  };

  return (
    <ToolLayout id="print-css-generator">
      <div><label className="text-[10px] text-muted-foreground">Elements to Hide</label><input value={hide} onChange={(e) => setHide(e.target.value)} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" /></div>
      <div><label className="text-[10px] text-muted-foreground">Elements to Show</label><input value={show} onChange={(e) => setShow(e.target.value)} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" /></div>
      <ToolButton onClick={generate}>Generate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
