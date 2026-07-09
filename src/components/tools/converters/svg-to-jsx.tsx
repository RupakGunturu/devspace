import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function SvgToJsx() {
  const [input, setInput] = useState('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>');
  const [output, setOutput] = useState("");

  const convert = () => {
    let result = input;
    result = result.replace(/class=/g, "className=");
    result = result.replace(/stroke-width=/g, "strokeWidth=");
    result = result.replace(/stroke-linecap=/g, "strokeLinecap=");
    result = result.replace(/stroke-linejoin=/g, "strokeLinejoin=");
    result = result.replace(/fill-rule=/g, "fillRule=");
    result = result.replace(/clip-rule=/g, "clipRule=");
    result = result.replace(/font-size=/g, "fontSize=");
    result = result.replace(/font-family=/g, "fontFamily=");
    result = result.replace(/text-anchor=/g, "textAnchor=");
    result = result.replace(/viewBox=/g, "viewBox=");
    setOutput(result);
  };

  return (
    <ToolLayout id="svg-to-jsx">
      <ToolInput value={input} onChange={setInput} placeholder="Paste SVG code..." label="SVG" rows={8} />
      <ToolButton onClick={convert}>Convert to JSX</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
