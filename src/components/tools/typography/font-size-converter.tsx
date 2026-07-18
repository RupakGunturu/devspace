import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";
import { ToolToggleGroup } from "../ToolToggleGroup";

export default function FontSizeConverter() {
  const [input, setInput] = useState("");
  const [unit, setUnit] = useState<"px" | "pt" | "em" | "rem" | "percent">("px");
  const [output, setOutput] = useState("");

  const convert = () => {
    const val = parseFloat(input);
    if (isNaN(val)) { setOutput("Enter valid number"); return; }
    const base = 16;
    let px: number;
    if (unit === "px") px = val;
    else if (unit === "pt") px = val * 1.333;
    else if (unit === "em" || unit === "rem") px = val * base;
    else px = (val / 100) * base;
    setOutput(`px: ${px.toFixed(2)}\npt: ${(px / 1.333).toFixed(2)}\nem: ${(px / base).toFixed(3)}\nrem: ${(px / base).toFixed(3)}\n%: ${((px / base) * 100).toFixed(1)}%`);
  };

  return (
    <ToolLayout id="font-size-converter">
      <ToolToggleGroup
        options={[
          { value: "px", label: "px" },
          { value: "pt", label: "pt" },
          { value: "em", label: "em" },
          { value: "rem", label: "rem" },
          { value: "percent", label: "%" },
        ]}
        value={unit}
        onChange={(v) => setUnit(v as any)}
        className="mb-2"
      />
      <ToolInput value={input} onChange={setInput} placeholder={`Enter value in ${unit}...`} label="Value" rows={1} />
      <ToolButton onClick={convert}>Convert</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
