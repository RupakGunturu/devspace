import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ErrorMessageExplainer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const errors: Record<string, string> = {
    "Cannot read properties of undefined": "You're trying to access a property on undefined. Add null checks or optional chaining (?.).",
    "is not a function": "You're calling something as a function but it isn't one. Check the variable type.",
    "Module not found": "Import path is wrong or package not installed. Check the import statement.",
    "Maximum call stack size exceeded": "Infinite recursion. A function is calling itself without a base case.",
    "SyntaxError": "There's a syntax error in your code. Check for missing brackets, semicolons, or quotes.",
    "ReferenceError": "Variable is not defined. Check spelling and scope.",
    "TypeError": "Wrong type being used. Check the variable type before using it.",
    "CORS": "Cross-origin request blocked. Check server CORS headers.",
    "ECONNREFUSED": "Server is not running or wrong port. Start the server.",
    "ENOMEM": "Out of memory. The process is using too much memory.",
  };

  const explain = () => {
    const matches = Object.entries(errors).filter(([key]) => input.includes(key));
    if (matches.length > 0) setOutput(matches.map(([key, desc]) => `${key}\n→ ${desc}`).join("\n\n"));
    else setOutput("No matching error pattern found. Try pasting the full error message.");
  };

  return (
    <ToolLayout id="error-message-explainer">
      <ToolInput value={input} onChange={setInput} placeholder="Paste error message..." label="Error Message" rows={6} />
      <ToolButton onClick={explain}>Explain Error</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
