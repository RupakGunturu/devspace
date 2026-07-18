import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function TransitionVisualizer() {
  const [property, setProperty] = useState("all");
  const [duration, setDuration] = useState(0.3);
  const [delay, setDelay] = useState(0);
  const [timing, setTiming] = useState("ease");
  const [output, setOutput] = useState("");

  const easings = ["ease", "linear", "ease-in", "ease-out", "ease-in-out"];
  const generate = () => setOutput(`transition-property: ${property};\ntransition-duration: ${duration}s;\ntransition-delay: ${delay}s;\ntransition-timing-function: ${timing};`);

  return (
    <ToolLayout id="transition-visualizer">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className="text-[10px] text-muted-foreground">Property</label><select value={property} onChange={(e) => setProperty(e.target.value)} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-xs text-foreground"><option>all</option><option>opacity</option><option>transform</option><option>background-color</option><option>width</option></select></div>
        <div><label className="text-[10px] text-muted-foreground">Timing</label><select value={timing} onChange={(e) => setTiming(e.target.value)} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-xs text-foreground">{easings.map((e) => <option key={e}>{e}</option>)}</select></div>
      </div>
      <div><label className="text-[10px] text-muted-foreground">Duration: {duration}s</label><input type="range" min="0.1" max="2" step="0.1" value={duration} onChange={(e) => setDuration(parseFloat(e.target.value))} className="w-full accent-yellow" /></div>
      <div><label className="text-[10px] text-muted-foreground">Delay: {delay}s</label><input type="range" min="0" max="1" step="0.1" value={delay} onChange={(e) => setDelay(parseFloat(e.target.value))} className="w-full accent-yellow" /></div>
      <ToolButton onClick={generate}>Generate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
