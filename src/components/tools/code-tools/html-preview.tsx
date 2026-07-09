import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function HtmlPreview() {
  const [code, setCode] = useState('<h1 style="color: #3b82f6;">Hello World</h1>\n<p style="font-family: sans-serif;">This is a live HTML preview.</p>\n<button onclick="alert(\'Clicked!\')">Click Me</button>');

  return (
    <ToolLayout id="html-preview">
      <ToolInput value={code} onChange={setCode} placeholder="Enter HTML..." label="HTML Code" rows={10} />
      <div>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Live Preview</span>
        <iframe srcDoc={code} className="w-full h-[300px] bg-white border border-border rounded-sm" sandbox="allow-scripts" />
      </div>
    </ToolLayout>
  );
}
