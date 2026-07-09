import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function MarkdownToHtml() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const convert = () => {
    let html = input;
    html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
    html = html.replace(/\n\n/g, "<br/><br/>");
    setOutput(html);
  };

  return (
    <ToolLayout id="markdown-to-html">
      <ToolInput value={input} onChange={setInput} placeholder="# Heading&#10;&#10;**Bold** and *italic*" label="Markdown" rows={10} />
      <ToolButton onClick={convert}>Convert to HTML</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
