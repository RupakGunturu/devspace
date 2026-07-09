import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function HtmlToMarkdown() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const convert = () => {
    let md = input;
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1");
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1");
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1");
    md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
    md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");
    md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
    md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*");
    md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");
    md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1");
    md = md.replace(/<[^>]+>/g, "");
    md = md.replace(/\n{3,}/g, "\n\n");
    setOutput(md.trim());
  };

  return (
    <ToolLayout id="html-to-markdown">
      <ToolInput value={input} onChange={setInput} placeholder="<h1>Title</h1>&#10;<p>Content</p>" label="HTML" rows={10} />
      <ToolButton onClick={convert}>Convert to Markdown</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
