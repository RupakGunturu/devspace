import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { useToolAccent } from "@/components/ToolAccentContext";

export function MetaTitleLengthChecker() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keyword, setKeyword] = useState("");
  const { color } = useToolAccent();

  const titleLen = title.length;
  const descLen = description.length;

  const titleStatus = useMemo(() => {
    if (titleLen === 0) return "neutral" as const;
    if (titleLen < 30) return "short" as const;
    if (titleLen >= 50 && titleLen <= 60) return "optimal" as const;
    if (titleLen > 60) return "long" as const;
    return "ok" as const;
  }, [titleLen]);

  const descStatus = useMemo(() => {
    if (descLen === 0) return "neutral" as const;
    if (descLen < 120) return "short" as const;
    if (descLen >= 150 && descLen <= 160) return "optimal" as const;
    if (descLen > 160) return "long" as const;
    return "ok" as const;
  }, [descLen]);

  const keywordProminence = useMemo(() => {
    if (!keyword.trim() || !title.trim()) return null;
    const kw = keyword.trim().toLowerCase();
    const t = title.toLowerCase();
    const d = description.toLowerCase();
    const titleIdx = t.indexOf(kw);
    const descIdx = d.indexOf(kw);
    const titleWords = title.trim().split(/\s+/);
    const kwWords = kw.split(/\s+/);
    const firstN = Math.ceil(titleWords.length * 0.3);
    const inFront = titleWords.slice(0, firstN).join(" ").toLowerCase().includes(kw);
    return {
      inTitle: titleIdx >= 0,
      titlePosition: titleIdx >= 0 ? titleIdx + 1 : null,
      inDescription: descIdx >= 0,
      descPosition: descIdx >= 0 ? descIdx + 1 : null,
      inFrontThird: inFront,
      score: (titleIdx >= 0 ? 1 : 0) + (descIdx >= 0 ? 1 : 0) + (inFront ? 1 : 0),
    };
  }, [title, description, keyword]);

  const statusColor = (s: string) => {
    if (s === "optimal") return "#22c55e";
    if (s === "long") return "#ef4444";
    if (s === "short") return "#f59e0b";
    return "#6b7280";
  };

  const statusLabel = (s: string) => {
    if (s === "optimal") return "Optimal";
    if (s === "long") return "Too long";
    if (s === "short") return "Too short";
    return "—";
  };

  const progressPct = (len: number, max: number) => Math.min((len / max) * 100, 100);

  const inputCls =
    "w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted";

  return (
    <ToolLayout id="meta-title-length-checker">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Page Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter page title..."
            maxLength={100}
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
            Target Keyword
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. react hooks"
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
          Meta Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter meta description..."
          rows={3}
          maxLength={300}
          className={inputCls + " resize-y"}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = color;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "";
          }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Title Length
            </span>
            <span
              className="font-mono text-sm font-bold"
              style={{ color: statusColor(titleStatus) }}
            >
              {titleLen}/60 — {statusLabel(titleStatus)}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progressPct(titleLen, 70)}%`,
                backgroundColor: statusColor(titleStatus),
              }}
            />
          </div>
          <div className="mt-2 flex justify-between font-mono text-[10px] text-muted">
            <span>0</span>
            <span className="text-[#22c55e]">50</span>
            <span className="text-[#22c55e]">60</span>
            <span className="text-[#ef4444]">70+</span>
          </div>
        </div>

        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
              Description Length
            </span>
            <span
              className="font-mono text-sm font-bold"
              style={{ color: statusColor(descStatus) }}
            >
              {descLen}/160 — {statusLabel(descStatus)}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progressPct(descLen, 200)}%`,
                backgroundColor: statusColor(descStatus),
              }}
            />
          </div>
          <div className="mt-2 flex justify-between font-mono text-[10px] text-muted">
            <span>0</span>
            <span className="text-[#22c55e]">150</span>
            <span className="text-[#22c55e]">160</span>
            <span className="text-[#ef4444]">200+</span>
          </div>
        </div>
      </div>

      {keyword.trim() && (
        <div className="rounded-md border-2 border-line bg-input-bg p-4">
          <span className="mb-3 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Keyword Prominence
          </span>
          {keywordProminence && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: keywordProminence.inTitle ? "#22c55e" : "#ef4444" }}
                />
                <span className="font-mono text-xs text-foreground">
                  In Title:{" "}
                  {keywordProminence.inTitle
                    ? `Yes (pos ${keywordProminence.titlePosition})`
                    : "No"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: keywordProminence.inDescription ? "#22c55e" : "#ef4444",
                  }}
                />
                <span className="font-mono text-xs text-foreground">
                  In Desc:{" "}
                  {keywordProminence.inDescription
                    ? `Yes (pos ${keywordProminence.descPosition})`
                    : "No"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: keywordProminence.inFrontThird ? "#22c55e" : "#f59e0b",
                  }}
                />
                <span className="font-mono text-xs text-foreground">
                  Front 30%: {keywordProminence.inFrontThird ? "Yes" : "No"}
                </span>
              </div>
            </div>
          )}
          {keywordProminence && (
            <div className="mt-3 font-mono text-xs text-muted">
              Score: {keywordProminence.score}/3 —{" "}
              {keywordProminence.score === 3
                ? "Excellent"
                : keywordProminence.score >= 2
                  ? "Good"
                  : "Needs improvement"}
            </div>
          )}
        </div>
      )}

      <div className="rounded-md border-2 border-line bg-input-bg p-4">
        <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Google SERP Preview
        </span>
        <div className="space-y-1">
          <div className="truncate font-mono text-lg text-[#8ab4f8] underline">
            {title || "Page Title — Your Site"}
          </div>
          <div className="font-mono text-xs text-[#70757a]">https://yoursite.com › page</div>
          <div className="line-clamp-2 font-mono text-sm text-[#4d5156]">
            {description ||
              "Add a meta description to see how it will appear in Google search results..."}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
