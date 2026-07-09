import { useEffect } from "react";
import { SectionHead, StickerCard } from "../components/site";
import { TOOLS } from "../data/tools";

export default function ToolsIndex() {
  useEffect(() => {
    document.title = "Tools — DevSpace";
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
      <SectionHead idx="01" title="All Tools" />
      <p className="mb-10 max-w-xl text-sm text-muted">
        Everything runs in your browser. No accounts, no uploads, no wait.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {TOOLS.map((t, i) => (
          <StickerCard
            key={t.slug}
            icon={t.icon}
            title={t.name}
            index={i}
            to={`/tools/${t.slug}`}
          >
            {t.tagline}
          </StickerCard>
        ))}
      </div>
    </section>
  );
}
