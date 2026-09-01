import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { CopyButton } from "./CopyButton";
import { useToolAccent } from "@/components/ToolAccentContext";

interface OgFields {
  title: string;
  description: string;
  imageUrl: string;
  siteName: string;
  url: string;
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 3) + "...";
}

function TwitterPreview({ fields }: { fields: OgFields }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-700 bg-black">
      {fields.imageUrl ? (
        <div
          className="h-48 w-full bg-gray-800 bg-cover bg-center"
          style={{ backgroundImage: `url(${fields.imageUrl})` }}
        />
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-gray-800 font-mono text-xs text-gray-500">
          No image
        </div>
      )}
      <div className="p-3">
        <p className="mb-0.5 truncate font-sans text-xs text-gray-400">
          {fields.siteName || fields.url || "example.com"}
        </p>
        <p className="mb-0.5 truncate font-sans text-sm font-bold text-white">
          {fields.title || "Page Title"}
        </p>
        <p className="line-clamp-2 font-sans text-xs text-gray-400">
          {fields.description || "Page description goes here..."}
        </p>
      </div>
    </div>
  );
}

function FacebookPreview({ fields }: { fields: OgFields }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-700 bg-[#242526]">
      {fields.imageUrl ? (
        <div
          className="h-52 w-full bg-gray-700 bg-cover bg-center"
          style={{ backgroundImage: `url(${fields.imageUrl})` }}
        />
      ) : (
        <div className="flex h-52 w-full items-center justify-center bg-gray-700 font-mono text-xs text-gray-500">
          No image
        </div>
      )}
      <div className="border-t border-gray-600 bg-[#3a3b3c] p-3">
        <p className="mb-0.5 truncate font-mono text-xs uppercase text-gray-400">
          {fields.url || "example.com"}
        </p>
        <p className="mb-1 font-sans text-base font-semibold text-white">
          {fields.title || "Page Title"}
        </p>
        <p className="line-clamp-2 font-sans text-sm text-gray-300">
          {fields.description || "Page description goes here..."}
        </p>
      </div>
    </div>
  );
}

function LinkedInPreview({ fields }: { fields: OgFields }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-700 bg-[#1b1f23]">
      {fields.imageUrl ? (
        <div
          className="h-40 w-full bg-gray-700 bg-cover bg-center"
          style={{ backgroundImage: `url(${fields.imageUrl})` }}
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-gray-700 font-mono text-xs text-gray-500">
          No image
        </div>
      )}
      <div className="p-3">
        <p className="mb-1 line-clamp-2 font-sans text-sm font-semibold text-white">
          {fields.title || "Page Title"}
        </p>
        <p className="line-clamp-3 font-sans text-xs text-gray-400">
          {fields.description || "Page description goes here..."}
        </p>
        <p className="mt-2 truncate font-mono text-xs text-gray-500">
          {fields.siteName || fields.url || "example.com"}
        </p>
      </div>
    </div>
  );
}

type PreviewPlatform = "twitter" | "facebook" | "linkedin";

export function OgImagePreviewer() {
  const [fields, setFields] = useState<OgFields>({
    title: "",
    description: "",
    imageUrl: "",
    siteName: "",
    url: "",
  });
  const [activeTab, setActiveTab] = useState<PreviewPlatform>("twitter");
  const { color } = useToolAccent();

  const update = (key: keyof OgFields, val: string) =>
    setFields((prev) => ({ ...prev, [key]: val }));

  const metaHtml = useMemo(() => {
    const lines: string[] = [
      `<meta property="og:title" content="${fields.title || "Page Title"}" />`,
      `<meta property="og:description" content="${fields.description || "Page description"}" />`,
      fields.imageUrl && `<meta property="og:image" content="${fields.imageUrl}" />`,
      fields.siteName && `<meta property="og:site_name" content="${fields.siteName}" />`,
      fields.url && `<meta property="og:url" content="${fields.url}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${fields.title || "Page Title"}" />`,
      `<meta name="twitter:description" content="${fields.description || "Page description"}" />`,
      fields.imageUrl && `<meta name="twitter:image" content="${fields.imageUrl}" />`,
    ].filter(Boolean);
    return lines.join("\n");
  }, [fields]);

  const titleWarning =
    fields.title.length > 60
      ? `${fields.title.length}/60 — too long`
      : fields.title.length > 0
        ? `${fields.title.length}/60`
        : "";
  const descWarning =
    fields.description.length > 160
      ? `${fields.description.length}/160 — too long`
      : fields.description.length > 0
        ? `${fields.description.length}/160`
        : "";

  return (
    <ToolLayout id="og-image-previewer">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
            Meta Fields
          </span>
          {[
            { key: "title" as const, label: "Title", limit: 60 },
            { key: "description" as const, label: "Description", limit: 160 },
            { key: "imageUrl" as const, label: "Image URL", limit: 0 },
            { key: "siteName" as const, label: "Site Name", limit: 0 },
            { key: "url" as const, label: "URL", limit: 0 },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="mb-1 block font-mono text-xs text-muted">{label}</label>
              {key === "description" ? (
                <textarea
                  value={fields[key]}
                  onChange={(e) => update(key, e.target.value)}
                  rows={3}
                  placeholder={label}
                  className="w-full resize-none rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = color;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "";
                  }}
                />
              ) : (
                <input
                  type="text"
                  value={fields[key]}
                  onChange={(e) => update(key, e.target.value)}
                  placeholder={label}
                  className="w-full rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none transition-colors placeholder:text-muted"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = color;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "";
                  }}
                />
              )}
              {key === "title" && titleWarning && (
                <p
                  className={`mt-1 font-mono text-xs ${fields.title.length > 60 ? "text-red-500" : "text-muted"}`}
                >
                  {titleWarning}
                </p>
              )}
              {key === "description" && descWarning && (
                <p
                  className={`mt-1 font-mono text-xs ${fields.description.length > 160 ? "text-red-500" : "text-muted"}`}
                >
                  {descWarning}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            {(["twitter", "facebook", "linkedin"] as PreviewPlatform[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="rounded-md border-2 px-3 py-1.5 font-mono text-xs font-medium capitalize transition-all"
                style={{
                  borderColor: activeTab === tab ? color : undefined,
                  backgroundColor: activeTab === tab ? color : undefined,
                  color: activeTab === tab ? "#1a1a2e" : undefined,
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div>
            {activeTab === "twitter" && <TwitterPreview fields={fields} />}
            {activeTab === "facebook" && <FacebookPreview fields={fields} />}
            {activeTab === "linkedin" && <LinkedInPreview fields={fields} />}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                Generated HTML
              </span>
              <CopyButton text={metaHtml} />
            </div>
            <pre className="max-h-60 overflow-auto whitespace-pre-wrap break-all rounded-md border-2 border-line bg-input-bg p-3 font-mono text-xs text-input-text">
              {metaHtml}
            </pre>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
