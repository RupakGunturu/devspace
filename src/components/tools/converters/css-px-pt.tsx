import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";
import { ToolToggleGroup } from "../ToolToggleGroup";

export default function CssPxPt() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"pxToPt" | "ptToPx">("pxToPt");
  const [output, setOutput] = useState("");

  const convert = () => {
    const val = parseFloat(input);
    if (isNaN(val)) { setOutput("Enter valid number"); return; }
    if (mode === "pxToPt") setOutput(`${val}px = ${(val * 0.75).toFixed(2)}pt`);
    else setOutput(`${val}pt = ${(val / 0.75).toFixed(2)}px`);
  };

  return (
    <ToolLayout id="css-px-pt">
      <ToolToggleGroup
        options={[
          { value: "pxToPt", label: "px → pt" },
          { value: "ptToPx", label: "pt → px" },
        ]}
        value={mode}
        onChange={(v) => setMode(v as any)}
        className="mb-2"
      />
      <ToolInput value={input} onChange={setInput} placeholder="Enter value..." label="Value" rows={1} />
      <ToolButton onClick={convert}>Convert</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
