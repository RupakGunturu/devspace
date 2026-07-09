import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ReadingTimeEstimator() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");

  const estimate = () => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    setOutput(`Words: ${words}\nReading time: ${hours > 0 ? `${hours}h ` : ""}${mins}min\nSpeaking time: ${Math.ceil(words / 130)} min`);
  };

  return (
    <ToolLayout id="reading-time-estimator">
      <ToolInput value={text} onChange={setText} placeholder="Paste article text..." label="Text" rows={10} />
      <ToolButton onClick={estimate}>Estimate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
