import { Link, useParams } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { toolBySlug, CATEGORY_COLORS } from "../data/tools";
import { getToolComponent } from "../components/tools/registry";
import { ToolIcon } from "../components/tools/ToolIcon";
import { cn } from "@/lib/utils";

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const tool = toolBySlug(slug!);
  const Component = tool ? getToolComponent(tool.slug) : null;

  useEffect(() => {
    document.title = tool ? `${tool.name} — DevSpace` : "Tool not found — DevSpace";
  }, [tool]);

  if (!tool) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Tool not found</h1>
        <p className="mt-2 text-sm text-muted">Maybe we haven't built this one yet.</p>
        <Link to="/tools" className="mt-6 inline-block font-mono text-sm text-yellow">← back to tools</Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-12 sm:px-8 sm:py-16">
      <Link to="/tools" className="font-mono text-xs text-muted no-underline hover:text-yellow">
        ← all tools
      </Link>
      <div className="mt-6 mb-8">
        <div className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full [&_svg]:h-7 [&_svg]:w-7",
          CATEGORY_COLORS[tool.category]?.bg ?? "bg-zinc-100",
          CATEGORY_COLORS[tool.category]?.darkBg ?? "dark:bg-zinc-800",
        )}>
          <ToolIcon name={tool.icon} className={CATEGORY_COLORS[tool.category]?.icon} />
        </div>
        <h1 className="mt-3 font-display text-4xl font-extrabold">{tool.name}</h1>
        <p className="mt-2 text-muted">{tool.description}</p>
      </div>
      <div className="rounded-md border-2 border-line bg-paper p-1">
        {Component ? (
          <Suspense fallback={<div className="p-6 text-muted">Loading...</div>}>
            <Component />
          </Suspense>
        ) : (
          <div className="p-6 text-muted">Coming soon.</div>
        )}
      </div>
    </section>
  );
}
