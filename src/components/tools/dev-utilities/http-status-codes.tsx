import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function HttpStatusCodes() {
  const codes: Record<string, { desc: string; cat: string }> = {
    "200": { desc: "OK — Request succeeded", cat: "Success" },
    "201": { desc: "Created — Resource created successfully", cat: "Success" },
    "204": { desc: "No Content — Success with no response body", cat: "Success" },
    "301": { desc: "Moved Permanently — Resource moved to new URL", cat: "Redirect" },
    "302": { desc: "Found — Temporary redirect", cat: "Redirect" },
    "304": { desc: "Not Modified — Use cached version", cat: "Redirect" },
    "400": { desc: "Bad Request — Invalid request syntax", cat: "Client Error" },
    "401": { desc: "Unauthorized — Authentication required", cat: "Client Error" },
    "403": { desc: "Forbidden — No permission to access", cat: "Client Error" },
    "404": { desc: "Not Found — Resource doesn't exist", cat: "Client Error" },
    "405": { desc: "Method Not Allowed — HTTP method not supported", cat: "Client Error" },
    "408": { desc: "Request Timeout — Server timed out waiting", cat: "Client Error" },
    "409": { desc: "Conflict — Request conflicts with current state", cat: "Client Error" },
    "418": { desc: "I'm a teapot — Easter egg status code", cat: "Client Error" },
    "429": { desc: "Too Many Requests — Rate limit exceeded", cat: "Client Error" },
    "500": { desc: "Internal Server Error — Server error", cat: "Server Error" },
    "501": { desc: "Not Implemented — Feature not supported", cat: "Server Error" },
    "502": { desc: "Bad Gateway — Invalid upstream response", cat: "Server Error" },
    "503": { desc: "Service Unavailable — Server temporarily down", cat: "Server Error" },
    "504": { desc: "Gateway Timeout — Upstream server timeout", cat: "Server Error" },
  };

  return (
    <ToolLayout id="http-status-codes">
      <div className="space-y-1.5">
        {Object.entries(codes).map(([code, { desc, cat }]) => (
          <div key={code} className="flex items-center gap-3 p-2.5 bg-paper-dim/50 border border-border rounded-sm">
            <span className={`font-mono text-sm font-bold w-10 ${cat === "Success" ? "text-coral" : cat === "Redirect" ? "text-yellow-500" : cat === "Client Error" ? "text-orange-500" : "text-coral"}`}>{code}</span>
            <span className="text-sm text-foreground">{desc}</span>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
