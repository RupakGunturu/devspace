import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CanonicalUrlChecker() {
  const [url, setUrl] = useState("");
  const [output, setOutput] = useState("");

  const check = () => {
    const tips = [
      "✅ Canonical URL should match the preferred version of the page",
      "✅ Use absolute URLs (with https://) in canonical tags",
      "✅ Canonical should point to the same domain as the page",
      "✅ Avoid canonical chains (A→B→C)",
      "✅ Self-referencing canonicals are good practice",
      "✅ Use canonical to consolidate duplicate content",
      "⚠ Don't canonical to paginated pages unless intended",
      "⚠ Don't use canonical on noindex pages",
      "⚠ Don't canonical to redirected URLs",
    ];
    setOutput(`URL: ${url}\n\nBest Practices:\n${tips.join("\n")}`);
  };

  return (
    <ToolLayout id="canonical-url-checker">
      <ToolInput value={url} onChange={setUrl} placeholder="https://example.com/page" label="URL" rows={1} />
      <ToolButton onClick={check}>Check</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
