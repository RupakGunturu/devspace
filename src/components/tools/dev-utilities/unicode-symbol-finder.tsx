import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function UnicodeSymbolFinder() {
  const [search, setSearch] = useState("");
  const [output, setOutput] = useState("");

  const symbols = [
    { char: "©", name: "Copyright", code: "U+00A9" }, { char: "®", name: "Registered", code: "U+00AE" },
    { char: "™", name: "Trademark", code: "U+2122" }, { char: "€", name: "Euro", code: "U+20AC" },
    { char: "£", name: "Pound", code: "U+00A3" }, { char: "¥", name: "Yen", code: "U+00A5" },
    { char: "±", name: "Plus/Minus", code: "U+00B1" }, { char: "×", name: "Multiplication", code: "U+00D7" },
    { char: "÷", name: "Division", code: "U+00F7" }, { char: "≠", name: "Not Equal", code: "U+2260" },
    { char: "≤", name: "Less Equal", code: "U+2264" }, { char: "≥", name: "Greater Equal", code: "U+2265" },
    { char: "≈", name: "Approximately", code: "U+2248" }, { char: "∞", name: "Infinity", code: "U+221E" },
    { char: "π", name: "Pi", code: "U+03C0" }, { char: "∑", name: "Sum", code: "U+2211" },
    { char: "√", name: "Square Root", code: "U+221A" }, { char: "∫", name: "Integral", code: "U+222B" },
    { char: "∂", name: "Partial Derivative", code: "U+2202" }, { char: "λ", name: "Lambda", code: "U+03BB" },
    { char: "→", name: "Right Arrow", code: "U+2192" }, { char: "←", name: "Left Arrow", code: "U+2190" },
    { char: "↑", name: "Up Arrow", code: "U+2191" }, { char: "↓", name: "Down Arrow", code: "U+2193" },
    { char: "★", name: "Star", code: "U+2605" }, { char: "☆", name: "Star Outline", code: "U+2606" },
    { char: "♥", name: "Heart", code: "U+2665" }, { card: "♦", char: "◆", name: "Diamond", code: "U+25C6" },
    { char: "♠", name: "Spade", code: "U+2660" }, { char: "♣", name: "Club", code: "U+2663" },
    { char: "✓", name: "Checkmark", code: "U+2713" }, { char: "✗", name: "Cross", code: "U+2717" },
    { char: "⚡", name: "Lightning", code: "U+26A1" }, { char: "☕", name: "Coffee", code: "U+2615" },
    { char: "🔥", name: "Fire", code: "U+1F525" }, { char: "💡", name: "Bulb", code: "U+1F4A1" },
  ];

  const find = () => {
    const q = search.toLowerCase();
    const results = symbols.filter((s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));
    setOutput(results.length ? results.map((s) => `${s.char}  ${s.name}  ${s.code}`).join("\n") : "No symbols found");
  };

  return (
    <ToolLayout id="unicode-symbol-finder">
      <ToolInput value={search} onChange={setSearch} placeholder="Search by name or code (e.g. arrow, heart, pi)" label="Search" rows={1} />
      <ToolButton onClick={find}>Find Symbols</ToolButton>
      <ToolOutput value={output} label="Results" />
    </ToolLayout>
  );
}
