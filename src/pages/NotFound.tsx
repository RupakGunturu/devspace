import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 — DevSpace";
  }, []);

  return (
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
  );
}
