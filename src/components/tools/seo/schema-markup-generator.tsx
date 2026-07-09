import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function SchemaMarkupGenerator() {
  const [type, setType] = useState<"faq" | "article" | "breadcrumb">("faq");
  const [data, setData] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");

  const generate = () => {
    if (type === "faq") {
      setOutput(JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: data.q1 || "Question?", acceptedAnswer: { "@type": "Answer", text: data.a1 || "Answer" } }] }, null, 2));
    } else if (type === "article") {
      setOutput(JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: data.headline || "Title", author: { "@type": "Person", name: data.author || "Author" }, datePublished: data.date || new Date().toISOString().split("T")[0] }, null, 2));
    } else {
      setOutput(JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: data.home || "Home", item: data.homeUrl || "/" }, { "@type": "ListItem", position: 2, name: data.page || "Page" }] }, null, 2));
    }
  };

  return (
    <ToolLayout id="schema-markup-generator">
      <div className="flex gap-2 mb-2">
        {(["faq", "article", "breadcrumb"] as const).map((t) => <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 text-xs rounded-full border transition-all ${type === t ? "bg-yellow text-white border-yellow" : "border-border text-muted-foreground"}`}>{t.toUpperCase()}</button>)}
      </div>
      <div className="space-y-3">
        {type === "faq" && (<><ToolInput value={data.q1 || ""} onChange={(v) => setData({ ...data, q1: v })} placeholder="Question?" label="Question" rows={1} /><ToolInput value={data.a1 || ""} onChange={(v) => setData({ ...data, a1: v })} placeholder="Answer" label="Answer" rows={2} /></>)}
        {type === "article" && (<><ToolInput value={data.headline || ""} onChange={(v) => setData({ ...data, headline: v })} placeholder="Article title" label="Headline" rows={1} /><ToolInput value={data.author || ""} onChange={(v) => setData({ ...data, author: v })} placeholder="Author name" label="Author" rows={1} /><ToolInput value={data.date || ""} onChange={(v) => setData({ ...data, date: v })} placeholder="2024-01-15" label="Date" rows={1} /></>)}
        {type === "breadcrumb" && (<><ToolInput value={data.home || ""} onChange={(v) => setData({ ...data, home: v })} placeholder="Home" label="Home Name" rows={1} /><ToolInput value={data.page || ""} onChange={(v) => setData({ ...data, page: v })} placeholder="Page Name" label="Page Name" rows={1} /></>)}
      </div>
      <ToolButton onClick={generate}>Generate Schema</ToolButton>
      <ToolOutput value={output} />
    </ToolLayout>
  );
}
