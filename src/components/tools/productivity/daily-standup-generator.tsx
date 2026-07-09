import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function DailyStandupGenerator() {
  const [yesterday, setYesterday] = useState("");
  const [today, setToday] = useState("");
  const [blockers, setBlockers] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    const lines = ["## Daily Standup\n"];
    if (yesterday) lines.push(`**Yesterday:** ${yesterday}`);
    if (today) lines.push(`**Today:** ${today}`);
    if (blockers) lines.push(`**Blockers:** ${blockers}`);
    else lines.push("**Blockers:** None");
    setOutput(lines.join("\n"));
  };

  return (
    <ToolLayout id="daily-standup-generator">
      <ToolInput value={yesterday} onChange={setYesterday} placeholder="What did you do yesterday?" label="Yesterday" rows={3} />
      <ToolInput value={today} onChange={setToday} placeholder="What will you do today?" label="Today" rows={3} />
      <ToolInput value={blockers} onChange={setBlockers} placeholder="Any blockers?" label="Blockers" rows={2} />
      <ToolButton onClick={generate}>Generate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
