import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function TimestampConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const convertToDate = () => {
    const ts = parseInt(input);
    if (isNaN(ts)) { setOutput("Invalid timestamp"); return; }
    const ms = ts > 1e11 ? ts : ts * 1000;
    const d = new Date(ms);
    setOutput([
      `ISO:    ${d.toISOString()}`,
      `Local:  ${d.toLocaleString()}`,
      `UTC:    ${d.toUTCString()}`,
      `Date:   ${d.toDateString()}`,
      `Time:   ${d.toTimeString()}`,
    ].join("\n"));
  };

  const fromDateToTs = () => {
    const d = new Date(input || Date.now());
    if (isNaN(d.getTime())) { setOutput("Invalid date"); return; }
    setOutput([
      `Seconds: ${Math.floor(d.getTime() / 1000)}`,
      `Millis:  ${d.getTime()}`,
      `ISO:     ${d.toISOString()}`,
    ].join("\n"));
  };

  return (
    <ToolLayout id="timestamp-converter">
      <ToolInput value={input} onChange={setInput} placeholder="Unix timestamp or date string" label="Input" rows={2} />
      <div className="flex gap-2">
        <ToolButton onClick={convertToDate}>To Date</ToolButton>
        <ToolButton onClick={fromDateToTs} variant="secondary">To Timestamp</ToolButton>
        <ToolButton onClick={() => setInput(String(Math.floor(Date.now() / 1000)))} variant="secondary">Now</ToolButton>
      </div>
      <ToolOutput value={output} label="Result" />
    </ToolLayout>
  );
}
