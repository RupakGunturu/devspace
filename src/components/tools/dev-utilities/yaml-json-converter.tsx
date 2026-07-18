import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";
import { ToolToggleGroup } from "../ToolToggleGroup";

export default function YamlJsonConverter() {
  const [input, setInput] = useState("name: John\nage: 30\ncity: NYC");
  const [mode, setMode] = useState<"yamlToJson" | "jsonToYaml">("yamlToJson");
  const [output, setOutput] = useState("");

  const yamlToJson = () => {
    const obj: Record<string, any> = {};
    input.split("\n").filter(Boolean).forEach((line) => {
      const match = line.match(/^(\s*)(\w+):\s*(.*)$/);
      if (match) { const [, indent, key, val] = match; obj[key] = isNaN(Number(val)) ? val : Number(val); }
    });
    setOutput(JSON.stringify(obj, null, 2));
  };

  const jsonToYaml = () => {
    try {
      const obj = JSON.parse(input);
      setOutput(Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join("\n"));
    } catch { setOutput("Invalid JSON"); }
  };

  return (
    <ToolLayout id="yaml-json-converter">
      <ToolToggleGroup
        options={[
          { value: "yamlToJson", label: "YAML → JSON" },
          { value: "jsonToYaml", label: "JSON → YAML" },
        ]}
        value={mode}
        onChange={(v) => setMode(v as any)}
        className="mb-2"
      />
      <ToolInput value={input} onChange={setInput} placeholder="Enter YAML or JSON..." label="Input" rows={8} />
      <ToolButton onClick={mode === "yamlToJson" ? yamlToJson : jsonToYaml}>Convert</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
