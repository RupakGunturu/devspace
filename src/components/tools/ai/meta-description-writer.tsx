import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function MetaDescriptionWriter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    const words = input.trim().split(/\s+/).slice(0, 20);
    const desc = words.join(" ");
    setOutput(desc.length > 155 ? desc.slice(0, 152) + "..." : desc);
  };

  return (
    <ToolLayout id="meta-description-writer">
      <ToolInput value={input} onChange={setInput} placeholder="Paste page content..." label="Content" rows={6} />
      <ToolButton onClick={generate}>Generate Meta Description</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
