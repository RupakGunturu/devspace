import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { cheatSheets } from "../data/cheat-sheets";

function sheetById(id: string) {
  return cheatSheets.find((s) => s.id === id);
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handle}
      className="ml-2 rounded-sm border-2 border-line px-2 py-0.5 font-mono text-[10px] text-muted hover:border-yellow hover:text-yellow"
    >
      {copied ? "done" : "copy"}
    </button>
  );
}

export default function CheatSheetPage() {
  const { id } = useParams<{ id: string }>();
  const sheet = sheetById(id!);

  useEffect(() => {
    document.title = sheet ? `${sheet.title} — DevSpace` : "Not found — DevSpace";
  }, [sheet]);

  if (!sheet) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Cheat sheet not found</h1>
        <Link to="/cheat-sheets" className="mt-6 inline-block font-mono text-sm text-yellow">← back to cheat sheets</Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-12 sm:px-8 sm:py-16">
      <Link to="/cheat-sheets" className="font-mono text-xs text-muted no-underline hover:text-yellow">
        ← all cheat sheets
      </Link>
      <div className="mt-6 mb-10">
        <h1 className="font-display text-4xl font-extrabold">{sheet.title}</h1>
        <p className="mt-2 text-muted">{sheet.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {sheet.tags.map((tag) => (
            <span key={tag} className="rounded-full border-2 border-line px-3 py-1 font-mono text-[10px] font-bold uppercase text-muted">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        {sheet.content.map((section, si) => (
          <div key={si} className="rounded-md border-2 border-line bg-ink">
            <div className="border-b-2 border-line bg-paper-dim/50 px-5 py-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-yellow">
                {section.title}
              </span>
            </div>
            <div className="space-y-1 p-4">
              {section.items.map((item, ii) => (
                <div key={ii} className="flex flex-col gap-1 rounded-sm border-2 border-line/50 bg-paper-dim/30 p-3 sm:flex-row sm:items-start sm:gap-3">
                  <span className="min-w-[120px] shrink-0 font-mono text-sm font-bold text-text">
                    {item.label}
                  </span>
                  <div className="min-w-0 flex-1">
                    {item.code && (
                      <div className="mb-1 flex items-center gap-2">
                        <code className="break-all rounded-sm bg-paper-dim/50 px-2 py-0.5 font-mono text-xs text-yellow">
                          {item.code}
                        </code>
                        <CopyBtn text={item.code} />
                      </div>
                    )}
                    <p className="text-xs leading-relaxed text-muted">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
