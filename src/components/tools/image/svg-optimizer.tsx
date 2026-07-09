import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function SvgOptimizer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const optimize = () => {
    let result = input;
    result = result.replace(/<!--[\s\S]*?-->/g, "");
    result = result.replace(/<metadata[\s\S]*?<\/metadata>/gi, "");
    result = result.replace(/\s+/g, " ");
    result = result.replace(/>\s+</g, "><");
    result = result.replace(/\s*\/>/g, "/>");
    result = result.replace(/ xmlns:xlink="[^"]*"/g, "");
    result = result.replace(/ data-name="[^"]*"/g, "");
    setOutput(result.trim());
  };

  return (
    <ToolLayout id="svg-optimizer">
      <ToolInput value={input} onChange={setInput} placeholder="Paste SVG code..." label="SVG Input" rows={10} />
      <ToolButton onClick={optimize}>Optimize</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
