import { Link, useParams, useNavigate } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { toolBySlug, CATEGORY_COLORS } from "../data/tools";
import { getToolComponent } from "../components/tools/registry";
import { ToolIcon } from "../components/tools/ToolIcon";
import { userActivity } from "../lib/userActivity";
import { ToolAccentProvider } from "@/components/ToolAccentContext";
import { useAuth } from "@/components/AuthProvider";
import { ToolSkeleton } from "@/components/skeletons/ToolSkeleton";
import { cn } from "@/lib/utils";

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const tool = toolBySlug(slug!);
  const Component = tool ? getToolComponent(tool.slug) : null;
  const colors = tool ? CATEGORY_COLORS[tool.category] : undefined;

  useEffect(() => {
    document.title = tool ? `${tool.name} — DevSpace` : "Tool not found — DevSpace";
  }, [tool]);

  useEffect(() => {
    if (tool) {
      userActivity.logToolUse(tool.slug).catch(() => {});
    }
  }, [tool]);

  useEffect(() => {
    if (tool?.requiresAuth && !authLoading && !user) {
      navigate(`/login?redirect=/tools/${tool.slug}`, { replace: true });
    }
  }, [tool, user, navigate, authLoading]);

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
      <nav className="flex items-center gap-1.5 font-mono text-xs text-muted">
        <Link to="/tools" className="no-underline transition-colors hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link to="/tools" className="no-underline transition-colors hover:text-foreground capitalize">{tool.category}</Link>
        <span>/</span>
        <span className="text-foreground">{tool.name}</span>
      </nav>

      <div className="mt-6 mb-8 flex items-start gap-4">
        <div className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg [&_svg]:h-6 [&_svg]:w-6",
          colors?.bg ?? "bg-zinc-100",
          colors?.darkBg ?? "dark:bg-zinc-800",
        )}>
          <ToolIcon name={tool.icon} className={colors?.icon} />
        </div>
        <div>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{tool.name}</h1>
          <p className="mt-1.5 text-sm text-muted">{tool.description}</p>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-paper p-4 shadow-sm sm:p-6">
        {Component ? (
          <ToolAccentProvider color={colors?.accent ?? "#e8c81c"} fg={colors?.accentFg ?? "#1a1a2e"}>
            <Suspense fallback={<ToolSkeleton accent={colors?.accent ?? "#e8c81c"} />}>
              <Component />
            </Suspense>
          </ToolAccentProvider>
        ) : (
          <div className="p-6 text-center text-sm text-muted">Coming soon.</div>
        )}
      </div>
    </section>
  );
}
