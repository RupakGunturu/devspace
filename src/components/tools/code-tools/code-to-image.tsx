import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";
import { ToolToggleGroup } from "../ToolToggleGroup";
import { useToolAccent } from "@/components/ToolAccentContext";

export default function CodeToImage() {
  const [code, setCode] = useState('const hello = () => {\n  console.log("Hello World!");\n};');
  const [theme, setTheme] = useState("dark");
  const [url, setUrl] = useState("");
  const { color } = useToolAccent();

  const generate = () => {
    const canvas = document.createElement("canvas");
    const lines = code.split("\n");
    canvas.width = 600;
    canvas.height = Math.max(200, lines.length * 24 + 80);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = theme === "dark" ? "#1e1e2e" : "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = theme === "dark" ? "#cdd6f4" : "#333333";
    ctx.font = "14px monospace";
    lines.forEach((line, i) => { ctx.fillText(line, 20, 50 + i * 24); });
    setUrl(canvas.toDataURL());
  };

  return (
    <ToolLayout id="code-to-image">
      <ToolInput value={code} onChange={setCode} placeholder="Paste code..." label="Code" rows={8} />
      <div className="flex gap-2">
        <ToolToggleGroup
          options={[
            { value: "dark", label: "Dark" },
            { value: "light", label: "Light" },
          ]}
          value={theme}
          onChange={setTheme}
        />
        <ToolButton onClick={generate}>Generate Image</ToolButton>
      </div>
      {url && <div className="flex flex-col items-center gap-4"><img src={url} alt="Code" className="border border-border rounded-sm" /><a href={url} download="code.png" className="text-sm hover:underline" style={{ color }}>Download</a></div>}
    </ToolLayout>
  );
}
