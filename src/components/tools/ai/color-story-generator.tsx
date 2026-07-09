import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ColorStoryGenerator() {
  const [mood, setMood] = useState("");
  const [output, setOutput] = useState("");

  const palettes: Record<string, string[]> = {
    "happy": ["#FFD700", "#FFA500", "#FF6347", "#FF69B4", "#FFB6C1"],
    "sad": ["#4682B4", "#5F9EA0", "#708090", "#778899", "#B0C4DE"],
    "energetic": ["#FF4500", "#FF6347", "#FF8C00", "#FFD700", "#ADFF2F"],
    "calm": ["#E0F7FA", "#B2EBF2", "#80DEEA", "#4DD0E1", "#26C6DA"],
    "mysterious": ["#2C003E", "#512B58", "#8B0A50", "#C71585", "#FF69B4"],
    "professional": ["#1A237E", "#283593", "#3949AB", "#5C6BC0", "#7986CB"],
    "creative": ["#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#00BCD4"],
    "nature": ["#1B5E20", "#2E7D32", "#388E3C", "#4CAF50", "#81C784"],
    "luxury": ["#000000", "#1a1a1a", "#4a0e4e", "#8B008B", "#D4AF37"],
  };

  const generate = () => {
    const lower = mood.toLowerCase();
    const match = Object.entries(palettes).find(([key]) => lower.includes(key));
    if (match) {
      setOutput(`Mood: ${match[0]}\n\nPalette:\n${match[1].map((c) => `${c}  ████`).join("\n")}\n\nCSS Variables:\n${match[1].map((c, i) => `--color-${i + 1}: ${c};`).join("\n")}`);
    } else setOutput("Try: happy, sad, energetic, calm, mysterious, professional, creative, nature, luxury");
  };

  return (
    <ToolLayout id="color-story-generator">
      <ToolInput value={mood} onChange={setMood} placeholder="energetic" label="Mood / Emotion" rows={1} />
      <ToolButton onClick={generate}>Generate Palette</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
