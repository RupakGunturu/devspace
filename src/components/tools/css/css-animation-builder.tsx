import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CssAnimationBuilder() {
  const [name, setName] = useState("myAnimation");
  const [duration, setDuration] = useState("1s");
  const [timing, setTiming] = useState("ease");
  const [iterations, setIterations] = useState("infinite");
  const [output, setOutput] = useState("");

  const keyframes = [
    { name: "fade-in", from: "opacity: 0;", to: "opacity: 1;" },
    { name: "slide-up", from: "transform: translateY(20px); opacity: 0;", to: "transform: translateY(0); opacity: 1;" },
    { name: "slide-right", from: "transform: translateX(-20px); opacity: 0;", to: "transform: translateX(0); opacity: 1;" },
    { name: "scale-in", from: "transform: scale(0.8); opacity: 0;", to: "transform: scale(1); opacity: 1;" },
    { name: "rotate-in", from: "transform: rotate(-10deg); opacity: 0;", to: "transform: rotate(0); opacity: 1;" },
    { name: "bounce", from: "transform: translateY(0);", "50%": "transform: translateY(-10px);", to: "transform: translateY(0);" },
    { name: "pulse", from: "transform: scale(1);", "50%": "transform: scale(1.05);", to: "transform: scale(1);" },
    { name: "shake", from: "transform: translateX(0);", "25%": "transform: translateX(-5px);", "75%": "transform: translateX(5px);", to: "transform: translateX(0);" },
  ];

  const generate = () => {
    const kf = keyframes.find((k) => k.name === name) || keyframes[0];
    let css = `@keyframes ${kf.name} {\n  from { ${kf.from} }`;
    if ("50%" in kf) css += `\n  50% { ${(kf as any)["50%"]} }`;
    css += `\n  to { ${kf.to} }\n}\n\n`;
    css += `.animated {\n  animation: ${kf.name} ${duration} ${timing} ${iterations};\n}`;
    setOutput(css);
  };

  return (
    <ToolLayout id="css-animation-builder">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className="text-[10px] text-muted-foreground">Animation</label>
          <select value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 bg-background border border-border rounded text-xs font-mono">
            {keyframes.map((k) => <option key={k.name} value={k.name}>{k.name}</option>)}
          </select>
        </div>
        <div><label className="text-[10px] text-muted-foreground">Duration</label><input value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full p-2 bg-background border border-border rounded text-xs font-mono" /></div>
        <div><label className="text-[10px] text-muted-foreground">Timing</label>
          <select value={timing} onChange={(e) => setTiming(e.target.value)} className="w-full p-2 bg-background border border-border rounded text-xs font-mono">
            {["ease", "linear", "ease-in", "ease-out", "ease-in-out", "cubic-bezier(0.4, 0, 0.2, 1)"].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div><label className="text-[10px] text-muted-foreground">Iterations</label>
          <select value={iterations} onChange={(e) => setIterations(e.target.value)} className="w-full p-2 bg-background border border-border rounded text-xs font-mono">
            {["1", "2", "3", "infinite"].map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>
      <ToolButton onClick={generate}>Generate CSS</ToolButton>
      <ToolOutput value={output} label="CSS Output" />
    </ToolLayout>
  );
}
