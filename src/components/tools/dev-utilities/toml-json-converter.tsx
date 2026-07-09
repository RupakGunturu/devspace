import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function TomlJsonConverter() {
  const [input, setInput] = useState("[server]\nhost = \"localhost\"\nport = 8080\n\ndatabase]\nname = \"mydb\"");
  const [output, setOutput] = useState("");

  const convert = () => {
    const obj: Record<string, any> = {};
    let currentSection = "";
    input.split("\n").filter(Boolean).forEach((line) => {
      const sectionMatch = line.match(/^\[(\w+)\]/);
      if (sectionMatch) { currentSection = sectionMatch[1]; obj[currentSection] = {}; return; }
      const kvMatch = line.match(/^(\w+)\s*=\s*"?([^"]*)"?$/);
      if (kvMatch && currentSection) {
        const [, key, val] = kvMatch;
        obj[currentSection][key] = isNaN(Number(val)) ? val : Number(val);
      }
    });
    setOutput(JSON.stringify(obj, null, 2));
  };

  return (
    <ToolLayout id="toml-json-converter">
      <ToolInput value={input} onChange={setInput} placeholder="[section]&#10;key = value" label="TOML Input" rows={8} />
      <ToolButton onClick={convert}>Convert to JSON</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
