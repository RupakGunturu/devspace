import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function VariableNamer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const suggestions: Record<string, string[]> = {
    "d": ["date", "data", "delta"], "s": ["string", "str", "score"], "cb": ["callback", " handleClick"],
    "e": ["event", "error", "element"], "el": ["element", "el"], "idx": ["index", "i"],
    "n": ["number", "count", "index"], "r": ["result", "response", "res"],
    "t": ["time", "text", "target"], "v": ["value", "val"], "arr": ["array", "items", "list"],
    "fn": ["function", "handler"], "obj": ["object", "item"], "str": ["string", "text"],
    "num": ["number", "count", "total"], "flag": ["isEnabled", "hasAccess", "shouldRender"],
    "temp": ["placeholder", "intermediate"], "tmp": ["temporary", "buffer"],
  };

  const process = () => {
    const lines = input.split("\n");
    const result = lines.map((line) => {
      const match = line.match(/(?:const|let|var)\s+(\w+)/);
      if (!match) return line;
      const name = match[1];
      const suggestionsList = suggestions[name] || [];
      if (suggestionsList.length === 0) return line;
      return `${line}  // suggested: ${suggestionsList.join(", ")}`;
    });
    setOutput(result.join("\n"));
  };

  return (
    <ToolLayout id="variable-namer">
      <ToolInput value={input} onChange={setInput} placeholder="const d = new Date();&#10;let s = 'hello';&#10;const cb = () => {};" label="Code" rows={8} />
      <ToolButton onClick={process}>Suggest Names</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
