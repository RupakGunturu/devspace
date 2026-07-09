import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function UnixTimestamp() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const toUnix = () => {
    const d = new Date(input || Date.now());
    setOutput(`Unix timestamp: ${Math.floor(d.getTime() / 1000)}\nISO: ${d.toISOString()}\nUTC: ${d.toUTCString()}`);
  };

  const toDate = () => {
    const ts = parseInt(input, 10);
    const d = new Date(isNaN(ts) ? input : ts * 1000);
    setOutput(`Date: ${d.toLocaleString()}\nISO: ${d.toISOString()}\nUTC: ${d.toUTCString()}\nUnix: ${Math.floor(d.getTime() / 1000)}`);
  };

  return (
    <ToolLayout id="unix-timestamp">
      <ToolInput value={input} onChange={setInput} placeholder="Enter date string or unix timestamp..." label="Input" rows={2} />
      <div className="flex gap-2">
        <ToolButton onClick={toUnix}>Date → Unix</ToolButton>
        <ToolButton onClick={toDate} variant="secondary">Unix → Date</ToolButton>
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
