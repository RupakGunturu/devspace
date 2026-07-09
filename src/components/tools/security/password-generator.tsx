import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [count, setCount] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);

  const generate = () => {
    let chars = "";
    if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";

    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      let pw = "";
      const arr = new Uint32Array(length);
      crypto.getRandomValues(arr);
      for (let j = 0; j < length; j++) pw += chars[arr[j] % chars.length];
      result.push(pw);
    }
    setPasswords(result);
  };

  return (
    <ToolLayout id="password-generator">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Length</label>
          <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} min={4} max={128} className="w-full p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Count</label>
          <input type="number" value={count} onChange={(e) => setCount(Math.min(20, Math.max(1, Number(e.target.value))))} min={1} max={20} className="w-full p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground" />
        </div>
      </div>
      <div className="flex gap-4 flex-wrap">
        {[
          { label: "Uppercase", value: uppercase, set: setUppercase },
          { label: "Lowercase", value: lowercase, set: setLowercase },
          { label: "Numbers", value: numbers, set: setNumbers },
          { label: "Symbols", value: symbols, set: setSymbols },
        ].map((o) => (
          <label key={o.label} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input type="checkbox" checked={o.value} onChange={(e) => o.set(e.target.checked)} className="accent-yellow" />
            {o.label}
          </label>
        ))}
      </div>
      <ToolButton onClick={generate}>Generate Passwords</ToolButton>
      {passwords.length > 0 && (
        <div className="space-y-2">
          {passwords.map((pw, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-paper-dim/50 border border-border rounded-sm">
              <code className="font-mono text-sm text-foreground break-all">{pw}</code>
              <button onClick={() => navigator.clipboard.writeText(pw)} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-paper-dim transition-colors shrink-0 ml-2">Copy</button>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
