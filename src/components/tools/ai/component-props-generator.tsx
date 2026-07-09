import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ComponentPropsGenerator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    const propMatches = input.match(/(\w+)=\{[^}]+\}/g) || [];
    const stringProps = input.match(/(\w+)="[^"]+"/g) || [];
    const props = [...propMatches, ...stringProps].map((p) => {
      const name = p.split("=")[0];
      const isString = p.includes('"');
      return `  ${name}: ${isString ? "string" : "any"};`;
    });
    const componentName = input.match(/(?:function|const)\s+(\w+)/)?.[1] || "Component";
    setOutput(`interface ${componentName}Props {\n${props.length ? props.join("\n") : "  // No props detected"}\n}\n\nexport default function ${componentName}({ ${props.map((p) => p.split(":")[0].trim()).join(", ")} }: ${componentName}Props) {\n  // ...\n}`);
  };

  return (
    <ToolLayout id="component-props-generator">
      <ToolInput value={input} onChange={setInput} placeholder='<Button variant="primary" onClick={handleClick} disabled={isLoading}>' label="JSX Component" rows={4} />
      <ToolButton onClick={generate}>Generate Props</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
