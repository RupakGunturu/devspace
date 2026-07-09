import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

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
      <div className="flex gap-2 mb-2">
        <button onClick={() => setMode("yamlToJson")} className={`px-3 py-1.5 text-xs rounded-full border transition-all ${mode === "yamlToJson" ? "bg-yellow text-white border-yellow" : "border-border text-muted-foreground"}`}>YAML → JSON</button>
        <button onClick={() => setMode("jsonToYaml")} className={`px-3 py-1.5 text-xs rounded-full border transition-all ${mode === "jsonToYaml" ? "bg-yellow text-white border-yellow" : "border-border text-muted-foreground"}`}>JSON → YAML</button>
      </div>
      <ToolInput value={input} onChange={setInput} placeholder="Enter YAML or JSON..." label="Input" rows={8} />
      <ToolButton onClick={mode === "yamlToJson" ? yamlToJson : jsonToYaml}>Convert</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
