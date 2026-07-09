import { createFileRoute } from "@tanstack/react-router";
import { SectionHead, StickerCard } from "../components/site";
import { TOOLS } from "../data/tools";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Tools — DevSpace" },
      { name: "description", content: "Fast, client-side dev tools: JSON, regex, contrast, markdown, base64, hashes." },
      { property: "og:title", content: "Tools — DevSpace" },
      { property: "og:description", content: "Client-side dev tools that run entirely in your browser." },
    ],
  }),
  component: ToolsIndex,
});

function ToolsIndex() {
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
            to="/tools/$slug"
            params={{ slug: t.slug }}
          >
            {t.tagline}
          </StickerCard>
        ))}
      </div>
    </section>
  );
}
