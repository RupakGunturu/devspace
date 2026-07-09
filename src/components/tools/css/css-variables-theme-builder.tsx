import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CssVariablesThemeBuilder() {
  const [baseColor, setBaseColor] = useState("#3b82f6");
  const [output, setOutput] = useState("");

  const generate = () => {
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    const lighten = (amt: number) => `rgb(${Math.min(255, r + amt)}, ${Math.min(255, g + amt)}, ${Math.min(255, b + amt)})`;
    const darken = (amt: number) => `rgb(${Math.max(0, r - amt)}, ${Math.max(0, g - amt)}, ${Math.max(0, b - amt)})`;
    setOutput(`:root {\n  --primary: ${baseColor};\n  --primary-light: ${lighten(60)};\n  --primary-dark: ${darken(40)};\n  --primary-bg: ${lighten(80)};\n  --bg: #ffffff;\n  --bg-paper-dim: #f8fafc;\n  --text: #1e293b;\n  --text-muted: #64748b;\n  --border: #e2e8f0;\n  --success: #22c55e;\n  --warning: #f59e0b;\n  --error: #ef4444;\n}`);
  };

  return (
    <ToolLayout id="css-variables-theme-builder">
      <div className="flex items-center gap-4"><label className="text-[10px] text-muted-foreground">Base Color</label><input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="w-12 h-8 bg-background border border-border rounded cursor-pointer" /><span className="font-mono text-xs">{baseColor}</span></div>
      <ToolButton onClick={generate}>Generate Theme</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
