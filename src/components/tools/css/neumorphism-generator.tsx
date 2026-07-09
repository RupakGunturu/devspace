import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function NeumorphismGenerator() {
  const [bg, setBg] = useState("#e0e0e0");
  const [distance, setDistance] = useState(5);
  const [blur, setBlur] = useState(10);
  const [intensity, setIntensity] = useState(100);
  const [output, setOutput] = useState("");

  const generate = () => {
    const r = parseInt(bg.slice(1, 3), 16);
    const g = parseInt(bg.slice(3, 5), 16);
    const b = parseInt(bg.slice(5, 7), 16);
    const light = `rgb(${Math.min(255, r + intensity)}, ${Math.min(255, g + intensity)}, ${Math.min(255, b + intensity)})`;
    const dark = `rgb(${Math.max(0, r - intensity)}, ${Math.max(0, g - intensity)}, ${Math.max(0, b - intensity)})`;
    setOutput(`background: ${bg};\nbox-shadow: ${distance}px ${distance}px ${blur}px ${dark}, -${distance}px -${distance}px ${blur}px ${light};\nborder-radius: 16px;`);
  };

  return (
    <ToolLayout id="neumorphism-generator">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-[10px] text-muted-foreground">Background</label><input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-full h-8 bg-background border border-border rounded cursor-pointer" /></div>
        <div><label className="text-[10px] text-muted-foreground">Distance: {distance}px</label><input type="range" min="1" max="20" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full accent-yellow" /></div>
        <div><label className="text-[10px] text-muted-foreground">Blur: {blur}px</label><input type="range" min="1" max="30" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-yellow" /></div>
        <div><label className="text-[10px] text-muted-foreground">Intensity: {intensity}</label><input type="range" min="10" max="200" value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="w-full accent-yellow" /></div>
      </div>
      <ToolButton onClick={generate}>Generate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
