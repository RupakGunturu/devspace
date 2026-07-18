import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";
import { ToolToggleGroup } from "../ToolToggleGroup";

export default function TextSorter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"alpha" | "reverse" | "numeric">("alpha");

  const sort = () => {
    const lines = input.split("\n");
    if (mode === "alpha") setOutput(lines.sort().join("\n"));
    else if (mode === "reverse") setOutput(lines.sort().reverse().join("\n"));
    else setOutput(lines.sort((a, b) => parseFloat(a) - parseFloat(b)).join("\n"));
  };

  return (
    <ToolLayout id="text-sorter">
      <ToolInput value={input} onChange={setInput} placeholder="Enter one item per line..." label="Input" rows={10} />
      <div className="flex flex-col sm:flex-row gap-2">
        <ToolToggleGroup
          options={[
            { value: "alpha", label: "Alpha" },
            { value: "reverse", label: "Reverse" },
            { value: "numeric", label: "Numeric" },
          ]}
          value={mode}
          onChange={(v) => setMode(v as any)}
        />
        <ToolButton onClick={sort}>Sort</ToolButton>
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
