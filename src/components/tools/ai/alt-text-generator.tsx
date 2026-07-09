import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function AltTextGenerator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    const keywords = input.split(",").map((k) => k.trim()).filter(Boolean);
    if (keywords.length === 0) { setOutput("Enter image description keywords"); return; }
    const templates = [
      `A ${keywords.join(" and ")} image`,
      `Photo showing ${keywords.join(", ")}`,
      `Illustration of ${keywords.join(" with ")}`,
      `Image containing ${keywords.join(", ")}`,
    ];
    setOutput(templates[Math.floor(Math.random() * templates.length)]);
  };

  return (
    <ToolLayout id="alt-text-generator">
      <ToolInput value={input} onChange={setInput} placeholder="sunset, beach, ocean, palm trees" label="Image keywords (comma separated)" rows={2} />
      <ToolButton onClick={generate}>Generate Alt Text</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
