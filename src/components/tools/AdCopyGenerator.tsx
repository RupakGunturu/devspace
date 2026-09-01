import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { CopyButton } from "./CopyButton";
import { useToolAccent } from "@/components/ToolAccentContext";

interface AdVariant {
  headline: string;
  description: string;
}

const GENERATION_TEMPLATES: ((p: {
  name: string;
  benefit: string;
  audience: string;
  cta: string;
}) => AdVariant)[] = [
  (p) => ({
    headline: `${p.name} — ${p.benefit}`,
    description: `Discover how ${p.name} helps ${p.audience.toLowerCase()} achieve ${p.benefit.toLowerCase()}. ${p.cta} today.`,
  }),
  (p) => ({
    headline: `${p.audience} Trust ${p.name}`,
    description: `Join thousands of ${p.audience.toLowerCase()} who chose ${p.name} for ${p.benefit.toLowerCase()}. ${p.cta} now and see results.`,
  }),
  (p) => ({
    headline: `Why ${p.name}? ${p.benefit}`,
    description: `${p.name} is built for ${p.audience.toLowerCase()} who want ${p.benefit.toLowerCase()}. Get started with ${p.cta}.`,
  }),
  (p) => ({
    headline: `${p.benefit} With ${p.name}`,
    description: `${p.name} helps ${p.audience.toLowerCase()} get ${p.benefit.toLowerCase()} — faster, smarter, better. ${p.cta} to learn more.`,
  }),
  (p) => ({
    headline: `${p.name} for ${p.audience}`,
    description: `Designed for ${p.audience.toLowerCase()}. ${p.name} delivers ${p.benefit.toLowerCase()}. ${p.cta} and transform your workflow.`,
  }),
];

export function AdCopyGenerator() {
  const [name, setName] = useState("");
  const [benefit, setBenefit] = useState("");
  const [audience, setAudience] = useState("");
  const [cta, setCta] = useState("Get Started");
  const { color } = useToolAccent();

  const variants = useMemo(() => {
    if (!name.trim() || !benefit.trim() || !audience.trim()) return [];
    return GENERATION_TEMPLATES.map((fn) =>
      fn({
        name: name.trim(),
        benefit: benefit.trim(),
        audience: audience.trim(),
        cta: cta.trim() || "Get Started",
      }),
    );
  }, [name, benefit, audience, cta]);

  const charCountColor = (len: number, max: number) => {
    if (len <= max) return "#22c55e";
    return "#ef4444";
  };

  const copyAll = () => {
    const all = variants
      .map((v, i) => `Variant ${i + 1}\nHeadline: ${v.headline}\nDescription: ${v.description}`)
      .join("\n\n");
    navigator.clipboard.writeText(all);
  };

  const inputCls =
    "w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted";

  return (
    <ToolLayout id="ad-copy-generator">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Product / Service Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. DevSpace Pro"
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
            Key Benefit
          </label>
          <input
            type="text"
            value={benefit}
            onChange={(e) => setBenefit(e.target.value)}
            placeholder="e.g. ship code 10x faster"
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Target Audience
          </label>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g. full-stack developers"
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
            CTA Button Text
          </label>
          <input
            type="text"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            placeholder="e.g. Get Started"
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

      {variants.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
            {variants.length} Variants Generated
          </span>
          <ToolButton onClick={copyAll} variant="secondary">
            Copy All Variants
          </ToolButton>
        </div>
      )}

      {variants.map((v, i) => (
        <div key={i} className="rounded-md border-2 border-line bg-input-bg p-4">
          <div className="mb-3 flex items-center justify-between">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-xs font-bold"
              style={{ backgroundColor: color, color: "#1a1a2e" }}
            >
              Variant {i + 1}
            </span>
            <CopyButton text={`Headline: ${v.headline}\nDescription: ${v.description}`} />
          </div>
          <div className="space-y-2">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-[10px] font-medium uppercase text-muted">
                  Headline
                </span>
                <span
                  className="font-mono text-[10px] font-bold"
                  style={{ color: charCountColor(v.headline.length, 30) }}
                >
                  {v.headline.length}/30
                </span>
              </div>
              <p className="font-mono text-sm font-medium text-foreground">{v.headline}</p>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-[10px] font-medium uppercase text-muted">
                  Description
                </span>
                <span
                  className="font-mono text-[10px] font-bold"
                  style={{ color: charCountColor(v.description.length, 90) }}
                >
                  {v.description.length}/90
                </span>
              </div>
              <p className="font-mono text-sm text-foreground">{v.description}</p>
            </div>
          </div>
        </div>
      ))}

      {name.trim() && benefit.trim() && audience.trim() && variants.length > 0 && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Google Ads Compliance
          </span>
          <div className="grid gap-2 sm:grid-cols-2">
            {variants.map((v, i) => {
              const hOk = v.headline.length <= 30;
              const dOk = v.description.length <= 90;
              return (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: hOk && dOk ? "#22c55e" : "#ef4444" }}
                  />
                  <span className="font-mono text-xs text-muted">
                    Variant {i + 1}: {hOk && dOk ? "Pass" : "Fail"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
