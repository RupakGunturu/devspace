import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function EmojiCombiner() {
  const [emoji1, setEmoji1] = useState("😀");
  const [emoji2, setEmoji2] = useState("🔥");
  const [output, setOutput] = useState("");

  const combine = () => { setOutput(`${emoji1}${emoji2}`); };

  return (
    <ToolLayout id="emoji-combiner">
      <div className="grid grid-cols-2 gap-4">
        <ToolInput value={emoji1} onChange={setEmoji1} placeholder="😀" label="Emoji 1" rows={1} />
        <ToolInput value={emoji2} onChange={setEmoji2} placeholder="🔥" label="Emoji 2" rows={1} />
      </div>
      <ToolButton onClick={combine}>Combine</ToolButton>
      {output && <div className="text-center p-6 bg-paper-dim/50 border border-border rounded-sm"><span className="text-6xl">{output}</span></div>}
    </ToolLayout>
  );
}
