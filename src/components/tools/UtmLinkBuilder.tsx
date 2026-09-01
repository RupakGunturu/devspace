import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { CopyButton } from "./CopyButton";
import { useToolAccent } from "@/components/ToolAccentContext";

const PRESETS: { label: string; source: string; medium: string }[] = [
  { label: "Google / CPC", source: "google", medium: "cpc" },
  { label: "Facebook / Social", source: "facebook", medium: "social" },
  { label: "Twitter / Social", source: "twitter", medium: "social" },
  { label: "LinkedIn / Social", source: "linkedin", medium: "social" },
  { label: "Newsletter / Email", source: "newsletter", medium: "email" },
  { label: "Direct / None", source: "direct", medium: "none" },
];

export function UtmLinkBuilder() {
  const [baseUrl, setBaseUrl] = useState("https://example.com");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");
  const { color } = useToolAccent();

  const builtUrl = useMemo(() => {
    try {
      const url = new URL(baseUrl);
      if (source.trim()) url.searchParams.set("utm_source", source.trim());
      if (medium.trim()) url.searchParams.set("utm_medium", medium.trim());
      if (campaign.trim()) url.searchParams.set("utm_campaign", campaign.trim());
      if (term.trim()) url.searchParams.set("utm_term", term.trim());
      if (content.trim()) url.searchParams.set("utm_content", content.trim());
      return url.toString();
    } catch {
      return "";
    }
  }, [baseUrl, source, medium, campaign, term, content]);

  const isValidUrl = useMemo(() => {
    try {
      new URL(baseUrl);
      return true;
    } catch {
      return false;
    }
  }, [baseUrl]);

  const inputCls =
    "w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted";

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setSource(p.source);
    setMedium(p.medium);
  };

  return (
    <ToolLayout id="utm-link-builder">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className="rounded-full border-2 border-line px-3 py-1.5 font-mono text-xs text-muted transition-all hover:border-current"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = color;
                e.currentTarget.style.color = color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.color = "";
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Base URL *
        </label>
        <input
          type="text"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="https://example.com/landing-page"
          className={inputCls}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = color;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "";
          }}
        />
        {!isValidUrl && baseUrl.trim() && (
          <p className="mt-1 font-mono text-xs text-[#ef4444]">Enter a valid URL</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Campaign Source *
          </label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. google, facebook"
            className={inputCls}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = color;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "";
            }}
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Campaign Medium *
          </label>
          <input
            type="text"
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            placeholder="e.g. cpc, social, email"
            className={inputCls}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = color;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "";
            }}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Campaign Name
        </label>
        <input
          type="text"
          value={campaign}
          onChange={(e) => setCampaign(e.target.value)}
          placeholder="e.g. spring_sale_2024"
          className={inputCls}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = color;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "";
          }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Campaign Term
          </label>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="e.g. react+hooks"
            className={inputCls}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = color;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "";
            }}
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Campaign Content
          </label>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="e.g. header_cta, sidebar_banner"
            className={inputCls}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = color;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "";
            }}
          />
        </div>
      </div>

      {builtUrl && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Generated UTM URL
            </span>
            <CopyButton text={builtUrl} />
          </div>
          <p className="break-all font-mono text-sm text-foreground">{builtUrl}</p>
        </div>
      )}

      {builtUrl && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <span className="mb-3 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            UTM Parameters Breakdown
          </span>
          <div className="space-y-2">
            {source.trim() && (
              <div className="flex items-center gap-2">
                <span
                  className="inline-block rounded px-1.5 py-0.5 font-mono text-[10px] font-bold"
                  style={{ backgroundColor: color, color: "#1a1a2e" }}
                >
                  utm_source
                </span>
                <span className="font-mono text-sm text-foreground">{source}</span>
              </div>
            )}
            {medium.trim() && (
              <div className="flex items-center gap-2">
                <span
                  className="inline-block rounded px-1.5 py-0.5 font-mono text-[10px] font-bold"
                  style={{ backgroundColor: color, color: "#1a1a2e" }}
                >
                  utm_medium
                </span>
                <span className="font-mono text-sm text-foreground">{medium}</span>
              </div>
            )}
            {campaign.trim() && (
              <div className="flex items-center gap-2">
                <span
                  className="inline-block rounded px-1.5 py-0.5 font-mono text-[10px] font-bold"
                  style={{ backgroundColor: color, color: "#1a1a2e" }}
                >
                  utm_campaign
                </span>
                <span className="font-mono text-sm text-foreground">{campaign}</span>
              </div>
            )}
            {term.trim() && (
              <div className="flex items-center gap-2">
                <span
                  className="inline-block rounded px-1.5 py-0.5 font-mono text-[10px] font-bold"
                  style={{ backgroundColor: color, color: "#1a1a2e" }}
                >
                  utm_term
                </span>
                <span className="font-mono text-sm text-foreground">{term}</span>
              </div>
            )}
            {content.trim() && (
              <div className="flex items-center gap-2">
                <span
                  className="inline-block rounded px-1.5 py-0.5 font-mono text-[10px] font-bold"
                  style={{ backgroundColor: color, color: "#1a1a2e" }}
                >
                  utm_content
                </span>
                <span className="font-mono text-sm text-foreground">{content}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {builtUrl && (
        <div className="flex justify-end">
          <ToolButton onClick={() => navigator.clipboard.writeText(builtUrl)}>
            Copy Full URL
          </ToolButton>
        </div>
      )}
    </ToolLayout>
  );
}
