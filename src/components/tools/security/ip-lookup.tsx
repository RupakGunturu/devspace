import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function IpLookup() {
  const [ip, setIp] = useState("");
  const [output, setOutput] = useState("");

  const lookup = () => {
    const parts = ip.split(".").map(Number);
    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) { setOutput("Invalid IPv4 address"); return; }
    const first = parts[0];
    let className = "A";
    if (first >= 192) className = "C";
    else if (first >= 128) className = "B";
    const isPrivate = first === 10 || (first === 172 && parts[1] >= 16 && parts[1] <= 31) || (first === 192 && parts[1] === 168);
    const isLoopback = first === 127;
    setOutput(`IP: ${ip}\nClass: ${className}\nType: ${isPrivate ? "Private" : isLoopback ? "Loopback" : "Public"}\nBinary: ${parts.map((p) => p.toString(2).padStart(8, "0")).join(".")}`);
  };

  return (
    <ToolLayout id="ip-lookup">
      <ToolInput value={ip} onChange={setIp} placeholder="192.168.1.1" label="IP Address" rows={1} />
      <ToolButton onClick={lookup}>Lookup</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
