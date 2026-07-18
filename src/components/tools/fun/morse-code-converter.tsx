import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

const MORSE: Record<string, string> = { A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.", " ": "/" };
const REVERSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

export default function MorseCodeConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const toMorse = () => setOutput(input.toUpperCase().split("").map((c) => MORSE[c] || c).join(" "));
  const fromMorse = () => setOutput(input.split(" ").map((c) => REVERSE[c] || c).join(""));

  return (
    <ToolLayout id="morse-code-converter">
      <ToolInput value={input} onChange={setInput} placeholder="Enter text or morse code..." label="Input" rows={3} />
      <div className="flex flex-col sm:flex-row gap-2">
        <ToolButton onClick={toMorse}>Text → Morse</ToolButton>
        <ToolButton onClick={fromMorse} variant="secondary">Morse → Text</ToolButton>
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
