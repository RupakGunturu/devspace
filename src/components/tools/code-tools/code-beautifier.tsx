import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";
import { ToolToggleGroup } from "../ToolToggleGroup";

export default function CodeBeautifier() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("json");
  const [output, setOutput] = useState("");

  const format = () => {
    try {
      if (language === "json") {
        setOutput(JSON.stringify(JSON.parse(input), null, 2));
      } else {
        let indent = 0;
        const formatted = input
          .replace(/\s*{\s*/g, " {\n" + "  ".repeat(++indent))
          .replace(/\s*}\s*/g, "\n" + "  ".repeat(--indent) + "}")
          .replace(/;\s*/g, ";\n" + "  ".repeat(indent))
          .replace(/,\s*/g, ",\n" + "  ".repeat(indent));
        setOutput(formatted);
      }
    } catch { setOutput("Error formatting code"); }
  };

  const minify = () => {
    setOutput(input.replace(/\s+/g, " ").trim());
  };

  return (
    <ToolLayout id="code-beautifier">
      <ToolToggleGroup
        options={[
          { value: "json", label: "JSON" },
          { value: "css", label: "CSS" },
          { value: "html", label: "HTML" },
          { value: "js", label: "JS" },
        ]}
        value={language}
        onChange={setLanguage}
      />
      <ToolInput value={input} onChange={setInput} placeholder="Paste code..." label="Input" rows={10} />
      <div className="flex flex-col sm:flex-row gap-2">
        <ToolButton onClick={format}>Beautify</ToolButton>
        <ToolButton onClick={minify} variant="secondary">Minify</ToolButton>
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
