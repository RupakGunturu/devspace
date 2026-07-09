import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function DocstringGenerator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    const match = input.match(/(?:function|const|let|var)\s+(\w+)\s*\(([^)]*)\)/);
    if (!match) { setOutput("Could not parse function signature"); return; }
    const name = match[1];
    const params = match[2].split(",").map((p) => p.trim().split(":")[0].split("=")[0].trim()).filter(Boolean);
    const lines = ["/**", ` * ${name}`];
    params.forEach((p) => lines.push(` * @param {any} ${p} - Description of ${p}`));
    lines.push(" * @returns {any} Description of return value", " * @example", ` * ${name}(${params.map(() => "value").join(", ")})`, " */");
    setOutput(lines.join("\n"));
  };

  return (
    <ToolLayout id="docstring-generator">
      <ToolInput value={input} onChange={setInput} placeholder="function calculateTotal(price, quantity, tax)" label="Function Signature" rows={2} />
      <ToolButton onClick={generate}>Generate Docstring</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
