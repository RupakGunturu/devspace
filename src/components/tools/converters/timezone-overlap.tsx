import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function TimezoneOverlap() {
  const [zones, setZones] = useState("UTC,EST,PST");
  const [output, setOutput] = useState("");

  const offsets: Record<string, number> = { "UTC": 0, "EST": -5, "PST": -8, "CST": -6, "MST": -7, "GMT": 0, "IST": 5.5, "CET": 1, "JST": 9, "AEST": 10 };

  const calculate = () => {
    const list = zones.split(",").map((z) => z.trim().toUpperCase());
    const workStart = 9;
    const workEnd = 17;
    const lines: string[] = [];
    for (const zone of list) {
      const offset = offsets[zone] ?? 0;
      const localStart = ((workStart + offset + 24) % 24).toString().padStart(2, "0") + ":00";
      const localEnd = ((workEnd + offset + 24) % 24).toString().padStart(2, "0") + ":00";
      lines.push(`${zone}: ${localStart} - ${localEnd}`);
    }
    setOutput(lines.join("\n"));
  };

  return (
    <ToolLayout id="timezone-overlap">
      <ToolInput value={zones} onChange={setZones} placeholder="UTC,EST,PST" label="Timezones (comma separated)" rows={1} />
      <ToolButton onClick={calculate}>Calculate Overlap</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
