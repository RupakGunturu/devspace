import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CssSpecificityCalculator() {
  const [selector, setSelector] = useState("");
  const [output, setOutput] = useState("");

  const calculate = () => {
    const ids = (selector.match(/#/g) || []).length;
    const classes = (selector.match(/\./g) || []).length + (selector.match(/\[/g) || []).length;
    const elements = (selector.match(/[a-zA-Z]+/g) || []).length - classes;
    const score = ids * 100 + classes * 10 + Math.max(0, elements);
    setOutput(`Selector: ${selector}\n\nSpecificity: (${ids}, ${classes}, ${Math.max(0, elements)})\nScore: ${score}\n\nID selectors: ${ids} (×100 = ${ids * 100})\nClass/attr selectors: ${classes} (×10 = ${classes * 10})\nElement selectors: ${Math.max(0, elements)} (×1 = ${Math.max(0, elements)})`);
  };

  return (
    <ToolLayout id="css-specificity-calculator">
      <ToolInput value={selector} onChange={setSelector} placeholder="#header .nav a" label="CSS Selector" rows={2} />
      <ToolButton onClick={calculate}>Calculate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
