import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function RegexVisualizer() {
  const [regex, setRegex] = useState("\\d{3}-\\d{4}");
  const [output, setOutput] = useState("");

  const parts: Record<string, string> = {
    "\\d": "Any digit (0-9)", "\\w": "Any word character (a-z, A-Z, 0-9, _)", "\\s": "Any whitespace",
    ".": "Any character", "^": "Start of string", "$": "End of string",
    "*": "0 or more", "+": "1 or more", "?": "0 or 1",
    "{n}": "Exactly n times", "{n,}": "n or more times", "{n,m}": "Between n and m times",
    "[abc]": "Any of a, b, or c", "[^abc]": "Not a, b, or c",
    "(a|b)": "a or b", "\\b": "Word boundary",
  };

  const visualize = () => {
    let result = regex;
    Object.entries(parts).forEach(([pattern, desc]) => {
      result = result.replace(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), `<span class="text-yellow">${pattern}</span> → ${desc}`);
    });
    setOutput(result);
  };

  return (
    <ToolLayout id="regex-visualizer">
      <ToolInput value={regex} onChange={setRegex} placeholder="\\d{3}-\\d{4}" label="Regex Pattern" rows={2} />
      <ToolButton onClick={visualize}>Visualize</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
