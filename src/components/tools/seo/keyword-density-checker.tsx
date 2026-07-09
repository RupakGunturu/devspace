import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function KeywordDensityChecker() {
  const [text, setText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [output, setOutput] = useState("");

  const check = () => {
    const words = text.toLowerCase().split(/\s+/).filter(Boolean);
    const kw = keyword.toLowerCase();
    const count = words.filter((w) => w.includes(kw)).length;
    const density = ((count / words.length) * 100).toFixed(2);
    setOutput(`Keyword: "${keyword}"\nOccurrences: ${count}\nTotal words: ${words.length}\nDensity: ${density}%`);
  };

  return (
    <ToolLayout id="keyword-density-checker">
      <ToolInput value={text} onChange={setText} placeholder="Paste your content..." label="Content" rows={8} />
      <ToolInput value={keyword} onChange={setKeyword} placeholder="Enter keyword..." label="Keyword" rows={1} />
      <ToolButton onClick={check}>Check Density</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
