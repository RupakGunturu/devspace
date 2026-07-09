import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CodeReviewAssistant() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const review = () => {
    const issues: string[] = [];
    const lines = input.split("\n");
    if (input.includes("console.log")) issues.push("⚠️  Found console.log — remove before production");
    if (/\bvar\b/.test(input)) issues.push("⚠️  Uses 'var' — prefer 'const' or 'let'");
    if (/==(?!=)/.test(input)) issues.push("⚠️  Uses == instead of === — use strict equality");
    if (lines.length > 50) issues.push("⚠️  File is very long — consider splitting");
    if (input.includes("TODO") || input.includes("FIXME")) issues.push("⚠️  Contains TODO/FIXME comments");
    if (input.includes("any")) issues.push("⚠️  Uses 'any' type — avoid in TypeScript");
    if (/\bfunction\s+\w+\([^)]*\)\s*\{[\s\S]{500,}\}/.test(input)) issues.push("⚠️  Long function — consider breaking into smaller functions");
    if (input.includes("alert(")) issues.push("⚠️  Uses alert() — remove before production");
    if (issues.length === 0) issues.push("✅ No obvious issues found!");
    setOutput(issues.join("\n"));
  };

  return (
    <ToolLayout id="code-review-assistant">
      <ToolInput value={input} onChange={setInput} placeholder="Paste code to review..." label="Code" rows={12} />
      <ToolButton onClick={review}>Review Code</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
