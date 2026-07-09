import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function DependencySizeChecker() {
  const [packages, setPackages] = useState("");
  const [output, setOutput] = useState("");

  const sizes: Record<string, string> = {
    "react": "6.3 KB (gzipped)", "react-dom": "32.5 KB (gzipped)", "lodash": "69.8 KB (gzipped)",
    "moment": "72.4 KB (gzipped)", "dayjs": "7 KB (gzipped)", "axios": "5.3 KB (gzipped)",
    "tailwindcss": "3.8 KB (gzipped)", "framer-motion": "34.5 KB (gzipped)", "zustand": "1.2 KB (gzipped)",
    "next": "85.2 KB (gzipped)", "vue": "33.4 KB (gzipped)", "svelte": "2.1 KB (gzipped)",
  };

  const check = () => {
    const list = packages.split(",").map((p) => p.trim().toLowerCase());
    setOutput(list.map((p) => `${p}: ${sizes[p] || "Unknown — check bundlephobia.com"}`).join("\n"));
  };

  return (
    <ToolLayout id="dependency-size-checker">
      <ToolInput value={packages} onChange={setPackages} placeholder="react, lodash, axios" label="Package Names (comma separated)" rows={2} />
      <ToolButton onClick={check}>Check Sizes</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
