import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function GitignoreGenerator() {
  const [stacks, setStacks] = useState<string[]>([]);
  const [output, setOutput] = useState("");

  const templates: Record<string, string> = {
    node: "node_modules/\n.env\n.env.local\ndist/\nbuild/\n.cache/\n*.log\n.DS_Store\ncoverage/",
    python: "__pycache__/\n*.pyc\n.env\nvenv/\n.venv/\n*.egg-info/\ndist/\nbuild/",
    go: "bin/\n*.exe\n.env\ngo.sum\nvendor/",
    rust: "target/\n*.swp",
    java: "target/\n*.class\n*.jar\n.idea/\n*.iml\nbuild/",
    docker: "*.log\n.env\ndist/\nnode_modules/",
    vscode: ".vscode/\n*.code-workspace",
    macos: ".DS_Store\n._*\n.Spotlight-V100\n.Trashes",
  };

  const toggle = (s: string) => setStacks((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  const generate = () => {
    const lines = ["# Generated .gitignore", ""];
    for (const s of stacks) { lines.push(`# ${s}`); lines.push(templates[s] || ""); lines.push(""); }
    setOutput(lines.join("\n").trim());
  };

  return (
    <ToolLayout id="gitignore-generator">
      <div className="flex gap-2 flex-wrap">{Object.keys(templates).map((s) => <button key={s} onClick={() => toggle(s)} className={`px-3 py-1.5 text-xs rounded-full border transition-all ${stacks.includes(s) ? "bg-yellow text-white border-yellow" : "border-border text-muted-foreground"}`}>{s}</button>)}</div>
      <ToolButton onClick={generate}>Generate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
