import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolOutput } from "../ToolOutput";

const cats: Record<string, string> = {
  "200": "OK", "201": "Created", "204": "No Content", "301": "Moved Permanently", "302": "Found", "304": "Not Modified",
  "400": "Bad Request", "401": "Unauthorized", "403": "Forbidden", "404": "Not Found", "405": "Method Not Allowed",
  "408": "Request Timeout", "409": "Conflict", "410": "Gone", "418": "I'm a teapot", "429": "Too Many Requests",
  "500": "Internal Server Error", "501": "Not Implemented", "502": "Bad Gateway", "503": "Service Unavailable", "504": "Gateway Timeout",
};

export default function HttpCatReference() {
  return (
    <ToolLayout id="http-cat-reference">
      <div className="space-y-1.5">
        {Object.entries(cats).map(([code, desc]) => (
          <div key={code} className="flex items-center gap-3 p-2.5 bg-paper-dim/50 border border-border rounded-sm">
            <img src={`https://http.cat/${code}`} alt={code} className="w-16 h-12 object-cover rounded" loading="lazy" />
            <div><span className="font-mono text-sm font-bold text-foreground">{code}</span><span className="text-sm text-muted-foreground ml-2">{desc}</span></div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
