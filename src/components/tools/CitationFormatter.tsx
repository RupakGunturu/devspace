import { useState, useMemo } from "react";
import { ToolLayout } from "./ToolLayout";
import { ToolButton } from "./ToolButton";
import { ToolInput } from "./ToolInput";
import { CopyButton } from "./CopyButton";

export function CitationFormatter() {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [publisher, setPublisher] = useState("");
  const [url, setUrl] = useState("");
  const [journal, setJournal] = useState("");

  const citations = useMemo(() => {
    const a = author.trim();
    const t = title.trim();
    const y = year.trim();
    const p = publisher.trim();
    const u = url.trim();
    const j = journal.trim();
    if (!a || !t) return { apa: "", mla: "", chicago: "" };

    const lastName = a.split(",").pop()?.trim() || a;
    const firstNames = a.includes(",")
      ? a
          .split(",")
          .slice(0, -1)
          .map((s) => s.trim())
          .join(", ")
      : "";

    const apa =
      `${lastName}${firstNames ? ", " + firstNames.charAt(0) + "." : ""} (${y || "n.d."}). ${t}. ${p ? p : ""}${j ? ". " + j : ""}${u ? ". " + u : ""}`
        .replace(/\.\./g, ".")
        .replace(/\.\s*\./g, ".")
        .trim();

    const mla =
      `${a}. "${t}." ${j ? j + ", " : ""}${p ? p + ", " : ""}${y || "n.d."}. ${u ? "Web." : ""}`
        .replace(/\.\./g, ".")
        .replace(/\.\s*\./g, ".")
        .trim();

    const chicago =
      `${a}. "${t}." ${p ? p : ""}${j ? ", " + j : ""} (${y || "n.d."}).${u ? " " + u : ""}`
        .replace(/\.\./g, ".")
        .replace(/\.\s*\./g, ".")
        .trim();

    return { apa, mla, chicago };
  }, [author, title, year, publisher, url, journal]);

  const formats = [
    { key: "apa" as const, label: "APA" },
    { key: "mla" as const, label: "MLA" },
    { key: "chicago" as const, label: "Chicago" },
  ];

  return (
    <ToolLayout id="citation-formatter">
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolInput
          value={author}
          onChange={setAuthor}
          label="Author(s)"
          placeholder="e.g. Smith, John and Doe, Jane"
          rows={2}
        />
        <ToolInput
          value={title}
          onChange={setTitle}
          label="Title"
          placeholder="e.g. The Art of Programming"
          rows={2}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolInput value={year} onChange={setYear} label="Year" placeholder="e.g. 2024" rows={1} />
        <ToolInput
          value={publisher}
          onChange={setPublisher}
          label="Publisher"
          placeholder="e.g. Tech Press"
          rows={1}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolInput
          value={journal}
          onChange={setJournal}
          label="Journal (if applicable)"
          placeholder="e.g. Journal of CS"
          rows={1}
        />
        <ToolInput
          value={url}
          onChange={setUrl}
          label="URL (if applicable)"
          placeholder="https://..."
          rows={1}
        />
      </div>
      <ToolButton onClick={() => {}} disabled={!author.trim() || !title.trim()}>
        Format Citation
      </ToolButton>

      {citations.apa && (
        <div className="flex flex-col gap-4">
          {formats.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
                  {label} Format
                </span>
                <CopyButton text={citations[key]} />
              </div>
              <div className="rounded-md border-2 border-line bg-input-bg p-4">
                <p className="whitespace-pre-wrap break-all font-mono text-sm text-foreground">
                  {citations[key]}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
