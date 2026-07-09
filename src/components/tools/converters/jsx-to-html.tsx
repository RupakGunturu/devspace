import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function JsxToHtml() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const convert = () => {
    let html = input;
    html = html.replace(/className=/g, "class=");
    html = html.replace(/htmlFor=/g, "for=");
    html = html.replace(/onClick=\{[^}]+\}/g, "");
    html = html.replace(/onChange=\{[^}]+\}/g, "");
    html = html.replace(/\{[^}]*\}/g, "");
    setOutput(html);
  };

  return (
    <ToolLayout id="jsx-to-html">
      <ToolInput value={input} onChange={setInput} placeholder='<div className="container">Hello</div>' label="JSX" rows={8} />
      <ToolButton onClick={convert}>Convert to HTML</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
