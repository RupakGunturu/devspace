import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function TestCaseGenerator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    const match = input.match(/(?:function|const)\s+(\w+)\s*\(([^)]*)\)/);
    if (!match) { setOutput("Could not parse function"); return; }
    const name = match[1];
    setOutput(`describe('${name}', () => {\n  it('should handle normal input', () => {\n    const result = ${name}();\n    expect(result).toBeDefined();\n  });\n\n  it('should handle edge cases', () => {\n    const result = ${name}();\n    expect(result).not.toBeNull();\n  });\n\n  it('should handle empty input', () => {\n    expect(() => ${name}()).not.toThrow();\n  });\n});`);
  };

  return (
    <ToolLayout id="test-case-generator">
      <ToolInput value={input} onChange={setInput} placeholder="function add(a, b) { return a + b; }" label="Function" rows={4} />
      <ToolButton onClick={generate}>Generate Tests</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
