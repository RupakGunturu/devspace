import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function TweetLengthChecker() {
  const [input, setInput] = useState("");
  const chars = input.length;
  const limit = 280;
  const remaining = limit - chars;
  const percent = Math.min(100, (chars / limit) * 100);

  return (
    <ToolLayout id="tweet-length-checker">
      <ToolInput value={input} onChange={setInput} placeholder="Type your tweet..." label="Tweet Text" rows={4} />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{chars} / {limit} characters</span>
          <span className={`text-sm font-mono font-bold ${remaining < 0 ? "text-coral" : remaining < 20 ? "text-yellow-500" : "text-coral"}`}>{remaining} remaining</span>
        </div>
        <div className="w-full h-2 bg-paper-dim rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${percent > 100 ? "bg-coral" : percent > 80 ? "bg-yellow-500" : "bg-coral"}`} style={{ width: `${Math.min(100, percent)}%` }} />
        </div>
        {remaining < 0 && <p className="text-sm text-coral font-mono">Over limit by {Math.abs(remaining)} characters!</p>}
      </div>
    </ToolLayout>
  );
}
