import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ChangelogGenerator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    const lines = input.split("\n").filter(Boolean);
    const feats = lines.filter((l) => l.toLowerCase().startsWith("feat"));
    const fixes = lines.filter((l) => l.toLowerCase().startsWith("fix"));
    const others = lines.filter((l) => !l.toLowerCase().startsWith("feat") && !l.toLowerCase().startsWith("fix"));
    const date = new Date().toISOString().split("T")[0];
    const sections = [`# Changelog\n\n## [Unreleased] - ${date}\n`];
    if (feats.length) sections.push("### Added\n" + feats.map((f) => `- ${f.replace(/^feat:?\s*/i, "")}`).join("\n"));
    if (fixes.length) sections.push("### Fixed\n" + fixes.map((f) => `- ${f.replace(/^fix:?\s*/i, "")}`).join("\n"));
    if (others.length) sections.push("### Changed\n" + others.map((o) => `- ${o}`).join("\n"));
    setOutput(sections.join("\n\n"));
  };

  return (
    <ToolLayout id="changelog-generator">
      <ToolInput value={input} onChange={setInput} placeholder="feat: add user authentication&#10;fix: resolve login bug&#10;update: improve dashboard" label="Commit Messages (one per line)" rows={8} />
      <ToolButton onClick={generate}>Generate Changelog</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
