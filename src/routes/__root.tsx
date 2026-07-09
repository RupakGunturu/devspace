import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header, Footer } from "../components/site";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="max-w-md text-center">
          <h1 className="font-display text-7xl font-extrabold text-yellow">404</h1>
          <h2 className="mt-4 font-display text-xl font-bold">Page not found</h2>
          <p className="mt-2 text-sm text-muted">
            This corner of the zine doesn't exist. Yet.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-sm border-2 border-yellow bg-yellow px-4 py-2 font-mono text-sm font-bold text-ink no-underline"
              style={{ boxShadow: "4px 4px 0 var(--coral)" }}
            >
              Back to issue
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-bold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted">
          Something broke on our side. Try refreshing or head home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-sm border-2 border-yellow bg-yellow px-4 py-2 font-mono text-sm font-bold text-ink"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-sm border-2 border-line bg-transparent px-4 py-2 font-mono text-sm font-bold text-text no-underline"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DevSpace — a weekly dev zine, tools, and games" },
      {
        name: "description",
        content:
          "DevSpace is a student-built weekly dev zine with client-side tools, learning games, and irreverent takes on developer culture.",
      },
      { name: "author", content: "DevSpace" },
      { property: "og:title", content: "DevSpace — a weekly dev zine" },
      {
        property: "og:description",
        content:
          "Tools, games, and a weekly zine of dev culture — for students and early-career developers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}
