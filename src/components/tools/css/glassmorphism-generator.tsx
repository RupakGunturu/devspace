import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function GlassmorphismGenerator() {
  const [bgColor, setBgColor] = useState("#ffffff");
  const [blur, setBlur] = useState(10);
  const [opacity, setOpacity] = useState(0.2);
  const [borderColor, setBorderColor] = useState("#ffffff");
  const [output, setOutput] = useState("");

  const generate = () => {
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    setOutput(`background: rgba(${r}, ${g}, ${b}, ${opacity});\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: 1px solid ${borderColor}40;\nborder-radius: 16px;`);
  };

  return (
    <ToolLayout id="glassmorphism-generator">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-[10px] text-muted-foreground">Background Color</label><input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-8 bg-background border border-border rounded cursor-pointer" /></div>
        <div><label className="text-[10px] text-muted-foreground">Border Color</label><input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="w-full h-8 bg-background border border-border rounded cursor-pointer" /></div>
        <div><label className="text-[10px] text-muted-foreground">Blur: {blur}px</label><input type="range" min="0" max="20" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-yellow" /></div>
        <div><label className="text-[10px] text-muted-foreground">Opacity: {opacity}</label><input type="range" min="0" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-full accent-yellow" /></div>
      </div>
      <ToolButton onClick={generate}>Generate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
