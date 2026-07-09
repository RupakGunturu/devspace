import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function SemverExplainer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const explain = () => {
    const match = input.match(/^v?(\d+)\.(\d+)\.(\d+)(?:-(.+))?(?:\+(.+))?$/);
    if (!match) { setOutput("Invalid semver. Format: 1.2.3 or v1.2.3"); return; }
    const [, major, minor, pre, build] = match;
    const lines = [
      `Version: ${input}`,
      ``,
      `Major: ${major} — Breaking changes`,
      `Minor: ${minor} — New features (backward compatible)`,
      `Patch: ${pre} — Bug fixes (backward compatible)`,
    ];
    if (match[4]) lines.push(`Pre-release: ${match[4]} — Not stable`);
    if (match[5]) lines.push(`Build metadata: ${match[5]}`);
    lines.push(
      ``,
      `Next versions:`,
      `  Patch: ${major}.${minor}.${Number(pre) + 1}`,
      `  Minor: ${major}.${Number(minor) + 1}.0`,
      `  Major: ${Number(major) + 1}.0.0`,
    );
    setOutput(lines.join("\n"));
  };

  return (
    <ToolLayout id="semver-explainer">
      <ToolInput value={input} onChange={setInput} placeholder="e.g. 2.1.0, v1.4.2-beta.1" label="Version" rows={1} />
      <ToolButton onClick={explain}>Explain</ToolButton>
      <ToolOutput value={output} label="Breakdown" />
    </ToolLayout>
  );
}
