import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CronExplainer() {
  const [input, setInput] = useState("0 9 * * 1-5");
  const [output, setOutput] = useState("");

  const explain = () => {
    const parts = input.split(" ");
    if (parts.length !== 5) { setOutput("Enter 5 cron fields: minute hour day month weekday"); return; }
    const [min, hour, day, month, dow] = parts;
    const time = `${hour === "*" ? "every hour" : `at ${hour}:00`}, ${min === "*" ? "every minute" : `minute ${min}`}`;
    const date = `${day === "*" ? "every day" : `day ${day}`}, ${month === "*" ? "every month" : `month ${month}`}`;
    const week = dow === "*" ? "every day of week" : dow === "1-5" ? "weekdays (Mon-Fri)" : `day-of-week ${dow}`;
    setOutput(`Cron: ${input}\n\nRuns: ${time}, ${date}, ${week}`);
  };

  return (
    <ToolLayout id="cron-explainer">
      <ToolInput value={input} onChange={setInput} placeholder="0 9 * * 1-5" label="Cron Expression" rows={1} />
      <ToolButton onClick={explain}>Explain</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
