import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolButton } from "../ToolButton";

export default function PalindromeChecker() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ isPalindrome: boolean; cleaned: string } | null>(null);

  const check = () => {
    const cleaned = input.toLowerCase().replace(/[^a-z0-9]/g, "");
    const reversed = cleaned.split("").reverse().join("");
    setResult({ isPalindrome: cleaned === reversed, cleaned });
  };

  return (
    <ToolLayout id="palindrome-checker">
      <ToolInput value={input} onChange={setInput} placeholder="Enter text to check..." label="Input" rows={3} />
      <ToolButton onClick={check}>Check</ToolButton>
      {result && (
        <div className="p-4 bg-paper-dim/50 border border-border rounded-sm">
          <p className={`text-lg font-bold font-sans ${result.isPalindrome ? "text-coral" : "text-coral"}`}>
            {result.isPalindrome ? "✓ Palindrome!" : "✗ Not a palindrome"}
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-mono">Cleaned: "{result.cleaned}"</p>
        </div>
      )}
    </ToolLayout>
  );
}
