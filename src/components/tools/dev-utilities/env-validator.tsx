import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function EnvValidator() {
  const [input, setInput] = useState("DATABASE_URL=postgres://localhost:5432/mydb\nAPI_KEY=\nSECRET_KEY=abc123\nDEBUG=true");
  const [output, setOutput] = useState("");

  const validate = () => {
    const lines = input.split("\n").filter(Boolean);
    const issues: string[] = [];
    const keys: string[] = [];
    lines.forEach((line, i) => {
      const match = line.match(/^(\w+)=(.*)$/);
      if (!match) { issues.push(`Line ${i + 1}: Invalid format — should be KEY=VALUE`); return; }
      const [, key, value] = match;
      if (keys.includes(key)) issues.push(`⚠️  Duplicate key: ${key}`);
      keys.push(key);
      if (!value) issues.push(`⚠️  Empty value: ${key}`);
      if (key.includes("SECRET") || key.includes("KEY") || key.includes("PASSWORD")) {
        if (value.length < 8) issues.push(`⚠️  Weak secret: ${key} (less than 8 chars)`);
      }
    });
    if (issues.length === 0) issues.push("✅ All environment variables look good!");
    setOutput(issues.join("\n"));
  };

  return (
    <ToolLayout id="env-validator">
      <ToolInput value={input} onChange={setInput} placeholder="KEY=value&#10;SECRET=..." label=".env File Content" rows={8} />
      <ToolButton onClick={validate}>Validate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
