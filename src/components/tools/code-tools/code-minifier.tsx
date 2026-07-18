import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";
import { ToolToggleGroup } from "../ToolToggleGroup";

export default function CodeMinifier() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("js");
  const [output, setOutput] = useState("");

  const minify = () => {
    if (language === "json") { try { setOutput(JSON.stringify(JSON.parse(input))); } catch { setOutput("Invalid JSON"); } return; }
    let result = input;
    result = result.replace(/\/\*[\s\S]*?\*\//g, "");
    result = result.replace(/\/\/.*$/gm, "");
    result = result.replace(/\s+/g, " ");
    result = result.replace(/\s*([{}();,=+\-<>!&|])\s*/g, "$1");
    result = result.replace(/;}/g, "}");
    setOutput(result.trim());
  };

  return (
    <ToolLayout id="code-minifier">
      <ToolToggleGroup
        options={[
          { value: "js", label: "JS" },
          { value: "css", label: "CSS" },
          { value: "html", label: "HTML" },
          { value: "json", label: "JSON" },
        ]}
        value={language}
        onChange={setLanguage}
        className="mb-2"
      />
      <ToolInput value={input} onChange={setInput} placeholder="Paste code..." label="Input" rows={10} />
      <ToolButton onClick={minify}>Minify</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
