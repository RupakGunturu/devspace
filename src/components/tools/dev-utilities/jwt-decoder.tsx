import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const decode = () => {
    try {
      const parts = token.trim().split(".");
      if (parts.length !== 3) throw new Error("Invalid JWT format");
      const header = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      const result = {
        header,
        payload,
        signature: parts[2],
        isExpired: payload.exp ? payload.exp * 1000 < Date.now() : false,
      };
      setOutput(JSON.stringify(result, null, 2));
      setError("");
    } catch (e: any) { setError(e.message); setOutput(""); }
  };

  return (
    <ToolLayout id="jwt-decoder">
      <ToolInput value={token} onChange={setToken} placeholder="Paste JWT token..." label="Token" rows={4} />
      <ToolButton onClick={decode}>Decode JWT</ToolButton>
      {error && <p className="text-sm text-coral font-mono">{error}</p>}
      <ToolOutput value={output} label="Decoded JWT" />
    </ToolLayout>
  );
}
