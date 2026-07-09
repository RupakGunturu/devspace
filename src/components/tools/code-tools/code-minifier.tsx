import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

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
      <div className="flex gap-2 mb-2">
        {["js", "css", "html", "json"].map((l) => <button key={l} onClick={() => setLanguage(l)} className={`px-3 py-1.5 text-xs rounded-full border transition-all ${language === l ? "bg-yellow text-white border-yellow" : "border-border text-muted-foreground"}`}>{l.toUpperCase()}</button>)}
      </div>
      <ToolInput value={input} onChange={setInput} placeholder="Paste code..." label="Input" rows={10} />
      <ToolButton onClick={minify}>Minify</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
