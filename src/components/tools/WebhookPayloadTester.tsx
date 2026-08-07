import { useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { useToolAccent } from "@/components/ToolAccentContext";
import { CopyButton } from "./CopyButton";

type HttpMethod = "POST" | "PUT" | "PATCH";

interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
}

const TEMPLATES: Record<string, { headers: string; body: string }> = {
  Slack: {
    headers: '{\n  "Content-Type": "application/json"\n}',
    body: '{\n  "text": "Hello from DevSpace!",\n  "channel": "#general"\n}',
  },
  Discord: {
    headers: '{\n  "Content-Type": "application/json"\n}',
    body: '{\n  "content": "Hello from DevSpace!"\n}',
  },
  Stripe: {
    headers: '{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer sk_test_..." \n}',
    body: '{\n  "amount": 2000,\n  "currency": "usd",\n  "source": "tok_visa"\n}',
  },
  GitHub: {
    headers: '{\n  "Content-Type": "application/json",\n  "Accept": "application/vnd.github.v3+json"\n}',
    body: '{\n  "title": "Bug report",\n  "body": "Something went wrong",\n  "labels": ["bug"]\n}',
  },
  Custom: {
    headers: '{\n  "Content-Type": "application/json"\n}',
    body: '{\n  "key": "value"\n}',
  },
};

export function WebhookPayloadTester() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<HttpMethod>("POST");
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState('{\n  "key": "value"\n}');
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { color } = useToolAccent();

  const loadTemplate = (name: string) => {
    const t = TEMPLATES[name];
    if (t) {
      setHeaders(t.headers);
      setBody(t.body);
    }
  };

  const sendRequest = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResponse(null);

    const start = Date.now();

    try {
      let parsedHeaders: Record<string, string> = {};
      try {
        parsedHeaders = JSON.parse(headers);
      } catch {
        setError("Invalid JSON in headers");
        setLoading(false);
        return;
      }

      let parsedBody: unknown;
      try {
        parsedBody = JSON.parse(body);
      } catch {
        parsedBody = body;
      }

      const res = await fetch(url, {
        method,
        headers: parsedHeaders,
        body: JSON.stringify(parsedBody),
      });

      const resHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        resHeaders[key] = value;
      });

      let resBody: string;
      try {
        resBody = JSON.stringify(await res.json(), null, 2);
      } catch {
        resBody = await res.text();
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: resHeaders,
        body: resBody,
        time: Date.now() - start,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setUrl("");
    setHeaders('{\n  "Content-Type": "application/json"\n}');
    setBody('{\n  "key": "value"\n}');
    setResponse(null);
    setError("");
  };

  const responseText = response
    ? `Status: ${response.status} ${response.statusText}\n\nHeaders:\n${Object.entries(response.headers).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nBody:\n${response.body}\n\nTime: ${response.time}ms`
    : "";

  return (
    <ToolLayout id="webhook-payload-tester">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Webhook URL</label>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://hooks.example.com/webhook" className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none placeholder:text-muted" style={{ borderColor: url ? color : undefined }} />
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Method</label>
        <div className="flex gap-1">
          {(["POST", "PUT", "PATCH"] as HttpMethod[]).map((m) => (
            <button key={m} onClick={() => setMethod(m)} className="rounded-md border-2 px-4 py-1.5 font-mono text-xs transition-all" style={method === m ? { borderColor: color, backgroundColor: color, color: "#fff" } : { borderColor: "var(--border)" }}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-muted">Templates:</span>
        {Object.keys(TEMPLATES).map((name) => (
          <button key={name} onClick={() => loadTemplate(name)} className="rounded-md border-2 border-line px-2 py-0.5 font-mono text-[10px] text-muted transition-colors hover:border-current" style={{ ["--hover-color" as string]: color }}>
            {name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Headers (JSON)</label>
          <textarea value={headers} onChange={(e) => setHeaders(e.target.value)} rows={6} className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-3 font-mono text-xs text-input-text outline-none" />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">Body (JSON)</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-3 font-mono text-xs text-input-text outline-none" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <ToolButton onClick={sendRequest} disabled={!url.trim()} loading={loading}>Send Request</ToolButton>
        <ToolButton variant="secondary" onClick={reset}>Reset</ToolButton>
      </div>

      {error && (
        <div className="rounded-lg border-2 border-coral bg-coral/10 p-3 font-mono text-xs text-coral">
          {error}
        </div>
      )}

      {response && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">Response</span>
              <span className="rounded px-1.5 py-0.5 font-mono text-[10px] font-bold" style={{ backgroundColor: response.status < 300 ? "#10b981" : response.status < 400 ? "#f59e0b" : "#ef4444", color: "#fff" }}>
                {response.status} {response.statusText}
              </span>
              <span className="font-mono text-[10px] text-muted">{response.time}ms</span>
            </div>
            <CopyButton text={responseText} />
          </div>

          <div className="rounded-lg border-2 border-line bg-input-bg p-4">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-muted">Response Headers</span>
            <div className="space-y-0.5">
              {Object.entries(response.headers).map(([k, v]) => (
                <div key={k} className="flex gap-2 font-mono text-[10px]">
                  <span className="text-muted">{k}:</span>
                  <span className="text-input-text">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Response Body</span>
              <CopyButton text={response.body} />
            </div>
            <pre className="max-h-[300px] overflow-auto whitespace-pre-wrap break-all rounded-lg border-2 border-line bg-input-bg p-4 font-mono text-xs text-input-text">
              {response.body}
            </pre>
          </div>
        </div>
      )}

      {!response && !error && (
        <div className="rounded-lg border-2 border-dashed border-line p-8 text-center font-mono text-sm text-muted">
          Enter a URL and send a request to see the response
        </div>
      )}
    </ToolLayout>
  );
}
