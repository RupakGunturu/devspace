import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function DockerCommandBuilder() {
  const [image, setImage] = useState("node");
  const [tag, setTag] = useState("18-alpine");
  const [port, setPort] = useState("3000");
  const [env, setEnv] = useState("");
  const [volume, setVolume] = useState("");
  const [output, setOutput] = useState("");

  const build = () => {
    const parts = ["docker run -d"];
    if (port) parts.push(`-p ${port}:${port}`);
    if (env) env.split(",").filter(Boolean).forEach((e) => parts.push(`-e ${e.trim()}`));
    if (volume) parts.push(`-v ${volume}`);
    parts.push("--name my-container");
    parts.push(`${image}:${tag}`);
    setOutput(parts.join(" \\\n  "));
  };

  return (
    <ToolLayout id="docker-command-builder">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className="text-[10px] text-muted-foreground">Image</label><input value={image} onChange={(e) => setImage(e.target.value)} className="w-full p-2 bg-background border border-border rounded text-xs font-mono" /></div>
        <div><label className="text-[10px] text-muted-foreground">Tag</label><input value={tag} onChange={(e) => setTag(e.target.value)} className="w-full p-2 bg-background border border-border rounded text-xs font-mono" /></div>
        <div><label className="text-[10px] text-muted-foreground">Port</label><input value={port} onChange={(e) => setPort(e.target.value)} className="w-full p-2 bg-background border border-border rounded text-xs font-mono" /></div>
        <div><label className="text-[10px] text-muted-foreground">Volume (host:container)</label><input value={volume} onChange={(e) => setVolume(e.target.value)} className="w-full p-2 bg-background border border-border rounded text-xs font-mono" placeholder="./data:/app/data" /></div>
      </div>
      <div><label className="text-[10px] text-muted-foreground">Env vars (comma separated)</label><input value={env} onChange={(e) => setEnv(e.target.value)} className="w-full p-2 bg-background border border-border rounded text-xs font-mono" placeholder="NODE_ENV=production,PORT=3000" /></div>
      <ToolButton onClick={build}>Generate Command</ToolButton>
      <ToolOutput value={output} label="Docker Command" />
    </ToolLayout>
  );
}
