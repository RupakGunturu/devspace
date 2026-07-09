import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

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
      <div className="flex gap-2">
        {["json", "css", "html", "js"].map((l) => <button key={l} onClick={() => setLanguage(l)} className={`px-3 py-1.5 text-xs rounded-full border transition-all ${language === l ? "bg-yellow text-white border-yellow" : "border-border text-muted-foreground"}`}>{l.toUpperCase()}</button>)}
      </div>
      <ToolInput value={input} onChange={setInput} placeholder="Paste code..." label="Input" rows={10} />
      <div className="flex gap-2">
        <ToolButton onClick={format}>Beautify</ToolButton>
        <ToolButton onClick={minify} variant="secondary">Minify</ToolButton>
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
