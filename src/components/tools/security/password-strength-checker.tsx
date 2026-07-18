import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<{ score: number; label: string; color: string; entropy: number; crackTime: string; details: string[] } | null>(null);

  const check = () => {
    const details: string[] = [];
    let score = 0;
    if (password.length >= 8) { score += 1; details.push("✓ 8+ characters"); } else details.push("✗ Less than 8 characters");
    if (password.length >= 12) { score += 1; details.push("✓ 12+ characters"); }
    if (/[a-z]/.test(password)) { score += 1; details.push("✓ Lowercase letters"); } else details.push("✗ No lowercase letters");
    if (/[A-Z]/.test(password)) { score += 1; details.push("✓ Uppercase letters"); } else details.push("✗ No uppercase letters");
    if (/[0-9]/.test(password)) { score += 1; details.push("✓ Numbers"); } else details.push("✗ No numbers");
    if (/[^a-zA-Z0-9]/.test(password)) { score += 1; details.push("✓ Special characters"); } else details.push("✗ No special characters");

    const charset = (/[a-z]/.test(password) ? 26 : 0) + (/[A-Z]/.test(password) ? 26 : 0) + (/[0-9]/.test(password) ? 10 : 0) + (/[^a-zA-Z0-9]/.test(password) ? 32 : 0);
    const entropy = password.length * Math.log2(Math.max(charset, 1));
    const combos = Math.pow(charset || 1, password.length);
    const crackSec = combos / 1e10;
    const crackTime = crackSec < 1 ? "Instant" : crackSec < 60 ? `${Math.round(crackSec)} seconds` : crackSec < 3600 ? `${Math.round(crackSec / 60)} minutes` : crackSec < 86400 ? `${Math.round(crackSec / 3600)} hours` : crackSec < 31536000 ? `${Math.round(crackSec / 86400)} days` : `${Math.round(crackSec / 31536000)} years`;

    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong", "Excellent"];
    const colors = ["text-coral", "text-coral", "text-orange-500", "text-yellow-500", "text-lime-500", "text-coral", "text-green-600"];

    setResult({ score: Math.min(score, 6), label: labels[Math.min(score, 6)], color: colors[Math.min(score, 6)], entropy: Math.round(entropy), crackTime, details });
  };

  return (
    <ToolLayout id="password-strength-checker">
      <ToolInput value={password} onChange={setPassword} placeholder="Enter a password to check..." label="Password" rows={2} />
      <ToolButton onClick={check}>Check Strength</ToolButton>
      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className={`text-2xl font-bold font-sans ${result.color}`}>{result.label}</span>
            <div className="flex gap-1">{Array.from({ length: 7 }).map((_, i) => <div key={i} className={`w-8 h-2 rounded-full ${i < result.score ? "bg-current " + result.color : "bg-paper-dim"}`} />)}</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-paper-dim/50 border border-border rounded-sm"><span className="text-[10px] uppercase tracking-wider text-muted-foreground">Entropy</span><p className="font-mono text-lg font-bold text-foreground">{result.entropy} bits</p></div>
            <div className="p-3 bg-paper-dim/50 border border-border rounded-sm"><span className="text-[10px] uppercase tracking-wider text-muted-foreground">Crack Time</span><p className="font-mono text-lg font-bold text-foreground">{result.crackTime}</p></div>
          </div>
          <div className="space-y-1">{result.details.map((d, i) => <p key={i} className={`text-sm font-mono ${d.startsWith("✓") ? "text-coral" : "text-coral"}`}>{d}</p>)}</div>
        </div>
      )}
    </ToolLayout>
  );
}
