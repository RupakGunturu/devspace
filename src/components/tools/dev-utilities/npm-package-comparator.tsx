import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function NpmPackageComparator() {
  const [pkg1, setPkg1] = useState("");
  const [pkg2, setPkg2] = useState("");
  const [output, setOutput] = useState("");

  const compare = async () => {
    if (!pkg1.trim() || !pkg2.trim()) { setOutput("Please enter two package names"); return; }
    setOutput("Loading package data...");
    try {
      const [data1, data2] = await Promise.all([
        fetch(`https://registry.npmjs.org/${pkg1.trim()}`).then((r) => r.json()),
        fetch(`https://registry.npmjs.org/${pkg2.trim()}`).then((r) => r.json()),
      ]);
      const latest1 = data1["dist-tags"]?.latest;
      const latest2 = data2["dist-tags"]?.latest;
      const v1 = data1.versions?.[latest1];
      const v2 = data2.versions?.[latest2];
      const lines = [
        `📦 ${pkg1.trim()} v${latest1}`,
        `   License: ${v1?.license || "N/A"}`,
        `   Description: ${data1.description || "N/A"}`,
        ``,
        `📦 ${pkg2.trim()} v${latest2}`,
        `   License: ${v2?.license || "N/A"}`,
        `   Description: ${data2.description || "N/A"}`,
        ``,
        `📊 Dependencies:`,
        `   ${pkg1.trim()}: ${Object.keys(v1?.dependencies || {}).length} deps`,
        `   ${pkg2.trim()}: ${Object.keys(v2?.dependencies || {}).length} deps`,
      ];
      setOutput(lines.join("\n"));
    } catch {
      setOutput("Error fetching package data. Check package names.");
    }
  };

  return (
    <ToolLayout id="npm-package-comparator">
      <div className="grid grid-cols-2 gap-3">
        <ToolInput value={pkg1} onChange={setPkg1} placeholder="e.g. lodash" label="Package 1" rows={1} />
        <ToolInput value={pkg2} onChange={setPkg2} placeholder="e.g. ramda" label="Package 2" rows={1} />
      </div>
      <ToolButton onClick={compare}>Compare Packages</ToolButton>
      <ToolOutput value={output} label="Comparison" />
    </ToolLayout>
  );
}
