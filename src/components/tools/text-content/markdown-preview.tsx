import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function MarkdownPreview() {
  const [input, setInput] = useState("# Hello World\n\nThis is **bold** and *italic* text.\n\n- Item 1\n- Item 2\n- Item 3\n\n```js\nconsole.log('Hello');\n```");

  const renderMarkdown = (md: string): string => {
    let html = md
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, '<code class="bg-paper-dim px-1.5 py-0.5 rounded text-sm">$1</code>')
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul class="list-disc pl-5">${m}</ul>`)
      .replace(/\n\n/g, "<br/><br/>");
    return html;
  };

  return (
    <ToolLayout id="markdown-preview">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ToolInput value={input} onChange={setInput} placeholder="Write Markdown..." label="Markdown" rows={15} />
        <div>
          <span className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Preview</span>
          <div className="w-full min-h-[380px] p-4 bg-paper-dim/50 border border-border rounded-sm prose prose-sm dark:prose-invert max-w-none font-sans" dangerouslySetInnerHTML={{ __html: renderMarkdown(input) }} />
        </div>
      </div>
    </ToolLayout>
  );
}
