import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function JsonPathTester() {
  const [json, setJson] = useState('{"store": {"book": [{"title": "Book1", "price": 10}, {"title": "Book2", "price": 20}]}}');
  const [path, setPath] = useState("$.store.book[0].title");
  const [output, setOutput] = useState("");

  const evaluate = () => {
    try {
      const data = JSON.parse(json);
      const parts = path.replace(/^\$\.?/, "").split(/\.|\[(\d+)\]/).filter(Boolean);
      let result: any = data;
      for (const part of parts) {
        if (/^\d+$/.test(part)) result = result[parseInt(part)];
        else result = result[part];
        if (result === undefined) break;
      }
      setOutput(JSON.stringify(result, null, 2));
    } catch { setOutput("Invalid JSON or path"); }
  };

  return (
    <ToolLayout id="json-path-tester">
      <ToolInput value={json} onChange={setJson} placeholder='{"key": "value"}' label="JSON" rows={6} />
      <ToolInput value={path} onChange={setPath} placeholder="$.store.book[0].title" label="JSONPath" rows={1} />
      <ToolButton onClick={evaluate}>Evaluate</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
