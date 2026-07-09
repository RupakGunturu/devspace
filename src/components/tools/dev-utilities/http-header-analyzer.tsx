import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function HttpHeaderAnalyzer() {
  const [input, setInput] = useState("Content-Type: application/json\nCache-Control: max-age=3600\nX-Frame-Options: DENY");
  const [output, setOutput] = useState("");

  const headers: Record<string, string> = {
    "Content-Type": "Specifies the media type of the resource",
    "Cache-Control": "Directs caching mechanisms on requests/responses",
    "X-Frame-Options": "Whether browser should render page in frame/iframe",
    "X-Content-Type-Options": "Prevents MIME type sniffing",
    "Strict-Transport-Security": "Enforces HTTPS connections",
    "X-XSS-Protection": "Enables XSS filtering in browsers",
    "Authorization": "Contains credentials for authenticating the user agent",
    "Accept": "Defines acceptable media types for response",
    "User-Agent": "Information about the client software",
  };

  const analyze = () => {
    const lines = input.split("\n").filter(Boolean);
    setOutput(lines.map((line) => {
      const [key, ...rest] = line.split(":");
      const value = rest.join(":").trim();
      const desc = headers[key.trim()] || "Custom header";
      return `${key.trim()}: ${value}\n  → ${desc}`;
    }).join("\n\n"));
  };

  return (
    <ToolLayout id="http-header-analyzer">
      <ToolInput value={input} onChange={setInput} placeholder="Content-Type: application/json&#10;Cache-Control: max-age=3600" label="HTTP Headers" rows={6} />
      <ToolButton onClick={analyze}>Analyze</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
