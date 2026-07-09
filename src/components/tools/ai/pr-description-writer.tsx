import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function PrDescriptionWriter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    const lines = input.split("\n").filter(Boolean);
    const features = lines.filter((l) => /add|new|implement|create/i.test(l));
    const fixes = lines.filter((l) => /fix|bug|resolve|patch/i.test(l));
    const changes = lines.filter((l) => !features.includes(l) && !fixes.includes(l));
    const sections = ["## Summary\n", input.slice(0, 200)];
    if (features.length) sections.push("\n## Features\n" + features.map((f) => `- ${f}`).join("\n"));
    if (fixes.length) sections.push("\n## Bug Fixes\n" + fixes.map((f) => `- ${f}`).join("\n"));
    if (changes.length) sections.push("\n## Changes\n" + changes.map((c) => `- ${c}`).join("\n"));
    sections.push("\n## Testing\n- [ ] Unit tests pass\n- [ ] Manual testing completed");
    setOutput(sections.join("\n"));
  };

  return (
    <ToolLayout id="pr-description-writer">
      <ToolInput value={input} onChange={setInput} placeholder="Added user authentication&#10;Fixed login bug&#10;Updated dashboard styles" label="Changes (one per line)" rows={6} />
      <ToolButton onClick={generate}>Generate PR Description</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
