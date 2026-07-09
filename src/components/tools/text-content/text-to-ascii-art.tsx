import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function TextToAsciiArt() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const fonts: Record<string, (s: string) => string> = {
    "Small": (s) => s.toUpperCase(),
    "Block": (s) => {
      const map: Record<string, string[]> = {
        A: [" █▀█ ", "█▄█ █", "█ █▄█"], B: ["█▄▄ ", "█▄█ ", "█ █ "], C: ["█▄█ ", "█   ", "█▄█ "], D: ["█▄  ", "█ █ ", "█▄█ "],
        E: ["█▄▄ ", "█▄  ", "█▄▄ "], F: ["█▄▄ ", "█▄  ", "█   "], G: ["█▄▄ ", "█ █ ", "█▄█ "], H: ["█ █ ", "█▄█ ", "█ █ "],
        I: ["█▄█ ", " █  ", "█▄█ "], J: ["  █ ", "  █ ", "█▄█ "], K: ["█ █ ", "██  ", "█ █ "], L: ["█   ", "█   ", "█▄▄ "],
        M: ["█ █ ", "███ ", "█ █ "], N: ["█ █ ", "███ ", "██  "], O: ["█▄█ ", "█ █ ", "█▄█ "], P: ["█▄▄ ", "█▄█ ", "█   "],
        Q: ["█▄█ ", "█ █ ", " ██"], R: ["█▄▄ ", "█▄█ ", "█ █ "], S: ["█▄▄ ", "█▄  ", "▄█  "], T: ["███ ", " █  ", " █  "],
        U: ["█ █ ", "█ █ ", "█▄█ "], V: ["█ █ ", "█ █ ", " ▀  "], W: ["█ █ ", "███ ", "█ █ "], X: ["█ █ ", " █  ", "█ █ "],
        Y: ["█ █ ", " █  ", " █  "], Z: ["███ ", " █  ", "███ "], " ": ["   ", "   ", "   "],
      };
      return s.toUpperCase().split("").map((c) => map[c] || map[" "]).reduce((acc, char) => acc.map((line, i) => line + char[i] + " "), ["", "", ""]).join("\n");
    },
  };

  const generate = (font: string) => {
    const fn = fonts[font] || fonts["Small"];
    setOutput(fn(input || "HELLO"));
  };

  return (
    <ToolLayout id="text-to-ascii-art">
      <ToolInput value={input} onChange={setInput} placeholder="Enter text..." label="Input" rows={2} />
      <div className="flex gap-2">
        {Object.keys(fonts).map((f) => (
          <ToolButton key={f} onClick={() => generate(f)} variant="secondary">{f}</ToolButton>
        ))}
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
