import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function BrowserStorageInspector() {
  const [output, setOutput] = useState("");

  const inspect = () => {
    const lines: string[] = [];
    // LocalStorage
    const ls: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const val = localStorage.getItem(key) || "";
        ls.push(`  ${key}: ${val.length > 80 ? val.slice(0, 80) + "..." : val}`);
      }
    }
    lines.push(`📦 LocalStorage (${ls.length} items)`, ...ls.length ? ls : ["  (empty)"]);
    // SessionStorage
    const ss: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        const val = sessionStorage.getItem(key) || "";
        ss.push(`  ${key}: ${val.length > 80 ? val.slice(0, 80) + "..." : val}`);
      }
    }
    lines.push(``, `📦 SessionStorage (${ss.length} items)`, ...ss.length ? ss : ["  (empty)"]);
    // Cookies
    const cookies = document.cookie.split(";").filter(Boolean);
    lines.push(``, `🍪 Cookies (${cookies.length})`, ...cookies.length ? cookies.map((c) => `  ${c.trim()}`) : ["  (none)"]);
    setOutput(lines.join("\n"));
  };

  const clearAll = () => {
    localStorage.clear();
    sessionStorage.clear();
    setOutput("All localStorage and sessionStorage cleared.");
  };

  return (
    <ToolLayout id="browser-storage-inspector">
      <div className="flex flex-col sm:flex-row gap-2">
        <ToolButton onClick={inspect}>Inspect Storage</ToolButton>
        <ToolButton onClick={clearAll} variant="secondary">Clear All</ToolButton>
      </div>
      <ToolOutput value={output} label="Storage Contents" />
    </ToolLayout>
  );
}
