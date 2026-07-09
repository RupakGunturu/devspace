import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function SlugGenerator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    setOutput(input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""));
  };

  return (
    <ToolLayout id="slug-generator">
      <ToolInput value={input} onChange={setInput} placeholder="Enter text to convert to slug..." label="Input Text" rows={3} />
      <ToolButton onClick={generate}>Generate Slug</ToolButton>
      <ToolOutput value={output} label="URL Slug" />
    </ToolLayout>
  );
}
