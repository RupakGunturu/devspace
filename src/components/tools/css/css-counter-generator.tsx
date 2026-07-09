import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CssCounterGenerator() {
  const [name, setName] = useState("item");
  const [style, setStyle] = useState("decimal");
  const [reset, setReset] = useState("0");
  const [output, setOutput] = useState("");

  const styles = ["decimal", "upper-alpha", "lower-alpha", "upper-roman", "lower-roman"];

  const generate = () => setOutput(`/* CSS */\n.counter {\n  counter-reset: ${name} ${reset};\n}\n.counter::before {\n  counter-increment: ${name};\n  content: counter(${name}, ${style});\n}\n\n/* HTML */\n<div class="counter">\n  <div>Item 1</div>\n  <div>Item 2</div>\n</div>`);

  return (
    <ToolLayout id="css-counter-generator">
      <div><label className="text-[10px] text-muted-foreground">Counter Name</label><input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" /></div>
      <div><label className="text-[10px] text-muted-foreground">Style</label><select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-xs text-foreground">{styles.map((s) => <option key={s}>{s}</option>)}</select></div>
      <div><label className="text-[10px] text-muted-foreground">Reset Value</label><input value={reset} onChange={(e) => setReset(e.target.value)} className="w-full p-2 bg-paper-dim/50 border border-border rounded text-sm font-mono text-foreground" /></div>
      <ToolButton onClick={generate}>Generate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
