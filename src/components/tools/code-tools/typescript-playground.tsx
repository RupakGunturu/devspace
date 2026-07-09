import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function TypeScriptPlayground() {
  const [input, setInput] = useState('const greeting: string = "Hello, World!";\nconsole.log(greeting);');
  const [output, setOutput] = useState("");

  const transpile = () => {
    let result = input;
    result = result.replace(/:\s*(string|number|boolean|any|void|never|unknown|object|symbol|bigint)\b/g, "");
    result = result.replace(/<[^>]+>/g, "");
    result = result.replace(/interface\s+\w+\s*\{[^}]*\}/g, "");
    result = result.replace(/type\s+\w+\s*=\s*[^;]+;/g, "");
    result = result.replace(/as\s+\w+/g, "");
    result = result.replace(/!\./g, ".");
    setOutput(result);
  };

  return (
    <ToolLayout id="typescript-playground">
      <ToolInput value={input} onChange={setInput} placeholder="TypeScript code..." label="TypeScript" rows={10} />
      <ToolButton onClick={transpile}>Transpile to JS</ToolButton>
      <ToolOutput value={output} label="JavaScript Output" />
    </ToolLayout>
  );
}
