import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CssColorVariablesGenerator() {
  const [base, setBase] = useState("#3b82f6");
  const [output, setOutput] = useState("");

  const hexToRgb = (h: string) => { const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h); return r ? `${parseInt(r[1], 16)}, ${parseInt(r[2], 16)}, ${parseInt(r[3], 16)}` : "0, 0, 0"; };

  const generate = () => {
    const rgb = hexToRgb(base);
    setOutput(`:root {\n  --color-primary: ${base};\n  --color-primary-rgb: ${rgb};\n  --color-primary-light: ${base}33;\n  --color-primary-dark: ${base}cc;\n  --color-bg: #ffffff;\n  --color-bg-paper-dim: #f8fafc;\n  --color-text: #1e293b;\n  --color-text-muted: #64748b;\n  --color-border: #e2e8f0;\n}`);
  };

  return (
    <ToolLayout id="css-color-variables-generator">
      <div className="flex items-center gap-4"><label className="text-[10px] text-muted-foreground">Base Color</label><input type="color" value={base} onChange={(e) => setBase(e.target.value)} className="w-12 h-8 bg-background border border-border rounded cursor-pointer" /><span className="font-mono text-xs">{base}</span></div>
      <ToolButton onClick={generate}>Generate Variables</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
