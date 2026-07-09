import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function ApiRateLimitEstimator() {
  const [requests, setRequests] = useState("1000");
  const [window, setWindow] = useState("60");
  const [output, setOutput] = useState("");

  const estimate = () => {
    const r = parseInt(requests);
    const w = parseInt(window);
    if (isNaN(r) || isNaN(w) || r <= 0 || w <= 0) { setOutput("Invalid values"); return; }
    const rps = (r / w).toFixed(2);
    const rpm = r;
    const rph = r * (3600 / w);
    const rpd = r * (86400 / w);
    const lines = [
      `Rate Limit: ${r} requests per ${w} seconds`,
      ``,
      `📊 Breakdown:`,
      `  Per second:  ${rps} req/s`,
      `  Per minute:  ${rpm} req/min`,
      `  Per hour:    ${rph.toLocaleString()} req/hr`,
      `  Per day:     ${rpd.toLocaleString()} req/day`,
      ``,
      `⚠️  Tips:`,
      `  - Use exponential backoff on 429 errors`,
      `  - Cache responses to reduce requests`,
      `  - Batch API calls when possible`,
      `  - Implement client-side rate limiting`,
    ];
    setOutput(lines.join("\n"));
  };

  return (
    <ToolLayout id="api-rate-limit-estimator">
      <div className="grid grid-cols-2 gap-3">
        <ToolInput value={requests} onChange={setRequests} placeholder="1000" label="Max Requests" rows={1} />
        <ToolInput value={window} onChange={setWindow} placeholder="60" label="Time Window (seconds)" rows={1} />
      </div>
      <ToolButton onClick={estimate}>Estimate</ToolButton>
      <ToolOutput value={output} label="Rate Limit Analysis" />
    </ToolLayout>
  );
}
