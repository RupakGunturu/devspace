import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function MockDataGenerator() {
  const [schema, setSchema] = useState("name:string, age:number, email:string, active:boolean");
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState("");

  const names = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Hank"];
  const domains = ["example.com", "test.io", "demo.co", "sample.dev"];

  const generate = () => {
    const fields = schema.split(",").map((f) => { const [name, type] = f.split(":").map((s) => s.trim()); return { name, type }; });
    const records = Array.from({ length: count }, () => {
      const obj: Record<string, any> = {};
      fields.forEach(({ name, type }) => {
        if (type === "string") obj[name] = names[Math.floor(Math.random() * names.length)] + "@" + domains[Math.floor(Math.random() * domains.length)];
        else if (type === "number") obj[name] = Math.floor(Math.random() * 100);
        else if (type === "boolean") obj[name] = Math.random() > 0.5;
        else obj[name] = "mock";
      });
      return obj;
    });
    setOutput(JSON.stringify(records, null, 2));
  };

  return (
    <ToolLayout id="mock-data-generator">
      <ToolInput value={schema} onChange={setSchema} placeholder="name:string, age:number, email:string" label="Schema (field:type, ...)" rows={2} />
      <div className="flex items-center gap-4">
        <div><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Count</label><input type="number" value={count} onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value))))} className="w-20 p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" /></div>
        <ToolButton onClick={generate}>Generate</ToolButton>
      </div>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
