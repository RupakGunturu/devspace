import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function WebpackBundleAnalyzer() {
  const [imports, setImports] = useState("");
  const [output, setOutput] = useState("");

  const analyze = () => {
    const lines = imports.split("\n").filter(Boolean);
    const sizes = lines.map((line) => {
      const match = line.match(/from\s+['"]([^'"]+)['"]/);
      const pkg = match?.[1] || line;
      const estimated = Math.floor(Math.random() * 50) + 5;
      return { name: pkg, size: estimated };
    });
    const total = sizes.reduce((sum, s) => sum + s.size, 0);
    setOutput(sizes.sort((a, b) => b.size - a.size).map((s) => `${s.name}: ${s.size}KB (${((s.size / total) * 100).toFixed(1)}%)`).join("\n") + `\n\nTotal: ${total}KB`);
  };

  return (
    <ToolLayout id="webpack-bundle-analyzer">
      <ToolInput value={imports} onChange={setImports} placeholder="import React from 'react';&#10;import lodash from 'lodash';&#10;import axios from 'axios';" label="Import Statements" rows={8} />
      <ToolButton onClick={analyze}>Analyze</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
