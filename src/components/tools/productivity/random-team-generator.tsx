import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function RandomTeamGenerator() {
  const [names, setNames] = useState("");
  const [teamCount, setTeamCount] = useState("2");
  const [output, setOutput] = useState("");

  const generate = () => {
    const list = names.split("\n").map((n) => n.trim()).filter(Boolean);
    const n = parseInt(teamCount);
    if (list.length === 0 || isNaN(n) || n < 1) { setOutput("Enter names and team count"); return; }
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    const teams: string[][] = Array.from({ length: n }, () => []);
    shuffled.forEach((name, i) => teams[i % n].push(name));
    setOutput(teams.map((t, i) => `Team ${i + 1}:\n${t.map((n) => `  • ${n}`).join("\n")}`).join("\n\n"));
  };

  return (
    <ToolLayout id="random-team-generator">
      <ToolInput value={names} onChange={setNames} placeholder="One name per line..." label="Names" rows={8} />
      <div className="flex items-center gap-4">
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Teams</label><input type="number" value={teamCount} onChange={(e) => setTeamCount(e.target.value)} min="2" className="w-20 p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" /></div>
        <ToolButton onClick={generate}>Generate Teams</ToolButton>
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
