import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function RandomColorGenerator() {
  const [locked, setLocked] = useState({ hue: false, sat: false, light: false });
  const [hue, setHue] = useState(Math.floor(Math.random() * 360));
  const [sat, setSat] = useState(70);
  const [light, setLight] = useState(50);
  const [output, setOutput] = useState("");

  const generate = () => {
    if (!locked.hue) setHue(Math.floor(Math.random() * 360));
    if (!locked.sat) setSat(50 + Math.floor(Math.random() * 40));
    if (!locked.light) setLight(40 + Math.floor(Math.random() * 30));
  };

  const hex = () => {
    const h = hue / 360, s = sat / 100, l = light / 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => { const k = (n + h * 12) % 12; return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); };
    return `#${[f(0), f(8), f(4)].map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join("")}`;
  };

  return (
    <ToolLayout id="random-color-generator">
      <div className="space-y-2">
        {[{ label: "Hue", val: hue, set: setHue, max: 360, key: "hue" as const }, { label: "Saturation", val: sat, set: setSat, max: 100, key: "sat" as const }, { label: "Lightness", val: light, set: setLight, max: 100, key: "light" as const }].map((f) => (
          <div key={f.key} className="flex items-center gap-2">
            <span className="text-xs w-16">{f.label}</span>
            <input type="range" min="0" max={f.max} value={f.val} onChange={(e) => f.set(Number(e.target.value))} className="flex-1 accent-yellow" />
            <button onClick={() => setLocked({ ...locked, [f.key]: !locked[f.key] })} className={`text-xs px-2 py-0.5 rounded ${locked[f.key] ? "bg-yellow text-white" : "bg-paper-dim text-muted-foreground"}`}>{locked[f.key] ? "🔒" : "🔓"}</button>
          </div>
        ))}
      </div>
      <div className="h-16 rounded-sm" style={{ backgroundColor: `hsl(${hue}, ${sat}%, ${light}%)` }} />
      <div className="flex gap-2"><ToolButton onClick={generate}>Randomize</ToolButton><span className="font-mono text-sm self-center">{hex()}</span></div>
    </ToolLayout>
  );
}
