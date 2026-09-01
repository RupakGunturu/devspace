import { useState } from "react";
import { ToolLayout } from "../ToolLayout";

const cats: Record<string, string> = {
  "200": "OK",
  "201": "Created",
  "204": "No Content",
  "301": "Moved Permanently",
  "302": "Found",
  "304": "Not Modified",
  "400": "Bad Request",
  "401": "Unauthorized",
  "403": "Forbidden",
  "404": "Not Found",
  "405": "Method Not Allowed",
  "408": "Request Timeout",
  "409": "Conflict",
  "410": "Gone",
  "418": "I'm a teapot",
  "429": "Too Many Requests",
  "500": "Internal Server Error",
  "501": "Not Implemented",
  "502": "Bad Gateway",
  "503": "Service Unavailable",
  "504": "Gateway Timeout",
};

export default function HttpCatReference() {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (code: string) => {
    setFailedImages((prev) => new Set(prev).add(code));
  };

  return (
    <ToolLayout id="http-cat-reference">
      <div className="space-y-1.5">
        {Object.entries(cats).map(([code, desc]) => (
          <div
            key={code}
            className="flex items-center gap-3 p-2.5 bg-paper-dim/50 border border-border rounded-sm"
          >
            {failedImages.has(code) ? (
              <div className="w-16 h-12 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center text-lg">
                🐱
              </div>
            ) : (
              <img
                src={`https://http.cat/${code}`}
                alt={`HTTP ${code}`}
                className="w-16 h-12 object-cover rounded"
                loading="lazy"
                onError={() => handleImageError(code)}
              />
            )}
            <div>
              <span className="font-mono text-sm font-bold text-foreground">{code}</span>
              <span className="text-sm text-muted-foreground ml-2">{desc}</span>
            </div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
