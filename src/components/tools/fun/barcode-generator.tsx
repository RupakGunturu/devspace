import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function BarcodeGenerator() {
  const [input, setInput] = useState("1234567890");
  const [output, setOutput] = useState("");

  const CODE128: Record<string, number[]> = {
    "0": [2, 1, 2, 2, 2, 2], "1": [2, 2, 2, 1, 2, 2], "2": [2, 2, 2, 2, 2, 1],
    "3": [1, 2, 1, 2, 2, 3], "4": [1, 2, 1, 3, 2, 2], "5": [1, 3, 1, 2, 2, 2],
    "6": [1, 2, 2, 2, 1, 3], "7": [1, 2, 2, 3, 1, 2], "8": [1, 3, 2, 2, 1, 2],
    "9": [2, 2, 1, 2, 1, 3], "A": [2, 2, 1, 3, 1, 2], "B": [2, 3, 1, 2, 1, 2],
    "C": [1, 1, 2, 2, 3, 2], "D": [1, 2, 2, 2, 3, 1], "E": [1, 1, 3, 2, 2, 2],
  };

  const generate = () => {
    const bars = input.toUpperCase().split("").map((c) => CODE128[c] || CODE128["0"]).flat();
    let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + (bars.length * 3) + '" height="80">';
    let x = 10;
    bars.forEach((width, i) => {
      if (i % 2 === 0) svg += `<rect x="${x}" y="10" width="${width * 2}" height="50" fill="black"/>`;
      x += width * 2;
    });
    svg += `<text x="${x / 2}" y="75" text-anchor="middle" font-family="monospace" font-size="12">${input}</text></svg>`;
    setOutput(svg);
  };

  return (
    <ToolLayout id="barcode-generator">
      <ToolInput value={input} onChange={setInput} placeholder="1234567890" label="Text / Numbers" rows={1} />
      <ToolButton onClick={generate}>Generate Barcode</ToolButton>
      {output && <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-sm border border-border" dangerouslySetInnerHTML={{ __html: output }} />}
    </ToolLayout>
  );
}
