import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CodeExplainer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const explain = () => {
    const lines = input.split("\n");
    const result = lines.map((line, i) => {
      const trimmed = line.trim();
      let explanation = "";
      if (trimmed.startsWith("import ")) explanation = "Import statement — brings in external module";
      else if (trimmed.startsWith("export ")) explanation = "Export — makes this available to other modules";
      else if (trimmed.startsWith("function ") || trimmed.includes("=>")) explanation = "Function definition";
      else if (trimmed.startsWith("const ") || trimmed.startsWith("let ")) explanation = "Variable declaration";
      else if (trimmed.startsWith("if ")) explanation = "Conditional — runs block if condition is true";
      else if (trimmed.startsWith("for ")) explanation = "Loop — iterates over a sequence";
      else if (trimmed.startsWith("return ")) explanation = "Return — exits function with a value";
      else if (trimmed.startsWith("class ")) explanation = "Class definition — blueprint for objects";
      else if (trimmed.includes("async")) explanation = "Asynchronous function — handles promises";
      else if (trimmed.includes("try")) explanation = "Try block — error handling begins here";
      else if (trimmed.includes("catch")) explanation = "Catch block — handles errors from try";
      return explanation ? `${line}  // ${explanation}` : line;
    });
    setOutput(result.join("\n"));
  };

  return (
    <ToolLayout id="code-explainer">
      <ToolInput value={input} onChange={setInput} placeholder="Paste code to explain..." label="Code" rows={12} />
      <ToolButton onClick={explain}>Explain Code</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
