import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function LineHeightCalculator() {
  const [fontSize, setFontSize] = useState("16");
  const [output, setOutput] = useState("");

  const calculate = () => {
    const fs = parseFloat(fontSize);
    if (isNaN(fs)) { setOutput("Enter valid font size"); return; }
    const ratios = [1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 2.0];
    setOutput(ratios.map((r) => `Line-height: ${r} → ${(fs * r).toFixed(1)}px (${(r * 100).toFixed(0)}%)`).join("\n"));
  };

  return (
    <ToolLayout id="line-height-calculator">
      <ToolInput value={fontSize} onChange={setFontSize} placeholder="16" label="Font Size (px)" rows={1} />
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
