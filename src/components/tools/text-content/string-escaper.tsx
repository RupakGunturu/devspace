import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function StringEscaper() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const escapeHtml = () => setOutput(input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"));
  const unescapeHtml = () => { const t = document.createElement("textarea"); t.innerHTML = input; setOutput(t.value); };
  const escapeJson = () => setOutput(JSON.stringify(input));
  const unescapeJson = () => { try { setOutput(JSON.parse(input)); } catch { setOutput("Invalid JSON"); } };
  const escapeUrl = () => setOutput(encodeURIComponent(input));
  const unescapeUrl = () => { try { setOutput(decodeURIComponent(input)); } catch { setOutput("Invalid URL encoding"); } };

  return (
    <ToolLayout id="string-escaper">
      <ToolInput value={input} onChange={setInput} placeholder="Enter text to escape/unescape..." label="Input" rows={4} />
      <div className="flex gap-2 flex-wrap">
        <ToolButton onClick={escapeHtml}>Escape HTML</ToolButton>
        <ToolButton onClick={unescapeHtml} variant="secondary">Unescape HTML</ToolButton>
        <ToolButton onClick={escapeJson}>Escape JSON</ToolButton>
        <ToolButton onClick={unescapeJson} variant="secondary">Unescape JSON</ToolButton>
        <ToolButton onClick={escapeUrl}>Encode URL</ToolButton>
        <ToolButton onClick={unescapeUrl} variant="secondary">Decode URL</ToolButton>
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
