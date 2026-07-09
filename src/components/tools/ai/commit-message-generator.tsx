import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CommitMessageGenerator() {
  const [diff, setDiff] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    const lines = diff.split("\n");
    const added = lines.filter((l) => l.startsWith("+") && !l.startsWith("+++")).length;
    const removed = lines.filter((l) => l.startsWith("-") && !l.startsWith("---")).length;
    const hasNewFile = diff.includes("+++ b/");
    const hasDelete = diff.includes("--- a/");
    const hasTest = diff.includes(".test.") || diff.includes(".spec.");
    const hasStyle = diff.includes(".css") || diff.includes(".scss");

    let type = "chore";
    if (hasNewFile && !hasDelete) type = "feat";
    else if (hasDelete && !hasNewFile) type = "feat";
    else if (hasTest) type = "test";
    else if (hasStyle) type = "style";
    else if (removed > added * 2) type = "refactor";
    else if (added > 0 && removed > 0) type = "fix";

    const scope = diff.match(/(?:src|components|pages)\/(\w+)/)?.[1] || "";
    setOutput(`${type}${scope ? `(${scope})` : ""}: ${added} files changed, ${added} insertions, ${removed} deletions\n\nCo-authored-by: AI <ai@example.com>`);
  };

  return (
    <ToolLayout id="commit-message-generator">
      <ToolInput value={diff} onChange={setDiff} placeholder="Paste git diff output..." label="Diff" rows={10} />
      <ToolButton onClick={generate}>Generate Message</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
