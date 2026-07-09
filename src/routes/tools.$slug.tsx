import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { toolBySlug } from "../data/tools";
import { JsonFormatter } from "../components/tools/JsonFormatter";
import { RegexTester } from "../components/tools/RegexTester";
import { ContrastChecker } from "../components/tools/ContrastChecker";
import { MarkdownPreviewer } from "../components/tools/MarkdownPreviewer";
import { Base64UrlCodec } from "../components/tools/Base64UrlCodec";
import { UuidHashGenerator } from "../components/tools/UuidHashGenerator";

const REGISTRY: Record<string, React.ComponentType> = {
  "json-formatter": JsonFormatter,
  "regex-tester": RegexTester,
  "contrast-checker": ContrastChecker,
  "markdown-previewer": MarkdownPreviewer,
  "base64-url-codec": Base64UrlCodec,
  "uuid-hash": UuidHashGenerator,
};

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = toolBySlug(params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Tool not found — DevSpace" }, { name: "robots", content: "noindex" }] };
    }
    const t = loaderData.tool;
    return {
      meta: [
        { title: `${t.name} — DevSpace` },
        { name: "description", content: t.description },
        { property: "og:title", content: `${t.name} — DevSpace` },
        { property: "og:description", content: t.description },
      ],
    };
  },
  component: ToolPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Tool not found</h1>
      <p className="mt-2 text-sm text-muted">Maybe we haven't built this one yet.</p>
      <Link to="/tools" className="mt-6 inline-block font-mono text-sm text-yellow">← back to tools</Link>
    </div>
  ),
});

function ToolPage() {
  const { tool } = Route.useLoaderData();
  const Component = REGISTRY[tool.slug];
  return (
    <section className="mx-auto max-w-4xl px-6 py-12 sm:px-8 sm:py-16">
      <Link to="/tools" className="font-mono text-xs text-muted no-underline hover:text-yellow">
        ← all tools
      </Link>
      <div className="mt-6 mb-8">
        <div className="text-4xl">{tool.icon}</div>
        <h1 className="mt-3 font-display text-4xl font-extrabold">{tool.name}</h1>
        <p className="mt-2 text-muted">{tool.description}</p>
      </div>
      <div className="rounded-md border-2 border-line bg-ink p-1">
        {Component ? <Component /> : <div className="p-6 text-muted">Coming soon.</div>}
      </div>
    </section>
  );
}
