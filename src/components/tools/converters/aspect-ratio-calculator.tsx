import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function AspectRatioCalculator() {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [output, setOutput] = useState("");

  const calculate = () => {
    const w = parseInt(width);
    const h = parseInt(height);
    if (isNaN(w) || isNaN(h)) { setOutput("Enter valid dimensions"); return; }
    const ratio = w / h;
    const common = [[16, 9], [4, 3], [3, 2], [1, 1], [21, 9], [16, 10]];
    const closest = common.reduce((prev, curr) => Math.abs(curr[0] / curr[1] - ratio) < Math.abs(prev[0] / prev[1] - ratio) ? curr : prev);
    setOutput(`Ratio: ${w}:${h} = ${ratio.toFixed(4)}\nClosest common: ${closest[0]}:${closest[1]}\n\nScaled:\n  ${closest[0]}:${closest[1]} → ${Math.round(h * closest[0] / closest[1])}×${h}\n  ${closest[0]}:${closest[1]} → ${w}×${Math.round(w * closest[1] / closest[0])}`);
  };

  return (
    <ToolLayout id="aspect-ratio-calculator">
      <div className="grid grid-cols-2 gap-4">
        <ToolInput value={width} onChange={setWidth} placeholder="1920" label="Width" rows={1} />
        <ToolInput value={height} onChange={setHeight} placeholder="1080" label="Height" rows={1} />
      </div>
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
