import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function JsonVisualizer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const visualize = () => {
    try {
      const parsed = JSON.parse(input);
      const visualizeObj = (obj: any, indent = 0): string => {
        const pad = "  ".repeat(indent);
        if (Array.isArray(obj)) {
          if (obj.length === 0) return "[]";
          const items = obj.map((item) => `${pad}  ${visualizeObj(item, indent + 1)}`);
          return `[\n${items.join(",\n")}\n${pad}]`;
        }
        if (obj !== null && typeof obj === "object") {
          const entries = Object.entries(obj);
          if (entries.length === 0) return "{}";
          const items = entries.map(([key, val]) => {
            const type = Array.isArray(val) ? "array" : val === null ? "null" : typeof val;
            const preview = typeof val === "object" && val !== null
              ? Array.isArray(val) ? `Array(${val.length})` : `Object{${Object.keys(val).length}}`
              : JSON.stringify(val);
            return `${pad}  "${key}" → ${preview}  (${type})`;
          });
          return `{\n${items.join(",\n")}\n${pad}}`;
        }
        return JSON.stringify(obj);
      };
      setOutput(visualizeObj(parsed));
    } catch (e: any) {
      setOutput(`Error: ${e.message}`);
    }
  };

  return (
    <ToolLayout id="json-visualizer">
      <ToolInput value={input} onChange={setInput} placeholder='Paste JSON here...' label="JSON Input" rows={10} />
      <ToolButton onClick={visualize}>Visualize</ToolButton>
      <ToolOutput value={output} label="Tree View" />
    </ToolLayout>
  );
}
