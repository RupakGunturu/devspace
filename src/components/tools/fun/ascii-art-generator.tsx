import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function AsciiArtGenerator() {
  const [input, setInput] = useState("HELLO");
  const [font, setFont] = useState("standard");
  const [output, setOutput] = useState("");

  const fonts: Record<string, Record<string, string[]>> = {
    standard: {
      H: ["#   #", "#   #", "#####", "#   #", "#   #"],
      E: ["#####", "#    ", "#### ", "#    ", "#####"],
      L: ["#    ", "#    ", "#    ", "#    ", "#####"],
      O: [" ### ", "#   #", "#   #", "#   #", " ### "],
      " ": ["     ", "     ", "     ", "     ", "     "],
    },
  };

  const generate = () => {
    const chars = input.toUpperCase().split("");
    const lines = Array(5).fill("");
    const f = fonts.standard;
    chars.forEach((c) => {
      const charLines = f[c] || f[" "];
      charLines.forEach((line, i) => { lines[i] += line + " "; });
    });
    setOutput(lines.join("\n"));
  };

  return (
    <ToolLayout id="ascii-art-generator">
      <ToolInput value={input} onChange={setInput} placeholder="HELLO" label="Text" rows={1} />
      <ToolButton onClick={generate}>Generate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
