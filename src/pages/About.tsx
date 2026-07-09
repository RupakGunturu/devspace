import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    document.title = "About — DevSpace";
  }, []);

  return (
    <section className="mx-auto max-w-2xl px-6 py-16 sm:px-8 sm:py-24">
      <div className="mb-4 font-mono text-xs uppercase tracking-widest text-coral">▸ colophon</div>
      <h1 className="font-display text-5xl font-extrabold leading-tight">
        A zine, some tools,
        <br />
        <span className="inline-block bg-yellow px-2 text-ink" style={{ transform: "rotate(-1deg)" }}>
          three tiny games.
        </span>
      </h1>
      <div className="mt-10 space-y-5 text-lg text-muted">
        <p>
          DevSpace is a weekly, student-built zine for people who are still figuring this
          whole "software" thing out. That includes us.
        </p>
        <p>
          Every issue mixes a few things: a set of{" "}
          <Link to="/tools" className="text-yellow no-underline">tools</Link>{" "}
          that run entirely in your browser, a few{" "}
          <Link to="/games" className="text-yellow no-underline">games</Link>{" "}
          that pretend to be fun and secretly teach you things, and a feed of short posts
          across a handful of{" "}
          <Link to="/feed/bug-of-the-week" className="text-yellow no-underline">
            recurring series
          </Link>
          .
        </p>
        <p>
          It's rookie-learning-out-loud, not corporate. No newsletter popup, no cookie
          banner drama, no "unlock this article." Just a zine.
        </p>
        <p className="font-mono text-sm">
          If you want to write for it, ship a game, or fix our typos — the whole thing is
          the point.
        </p>
      </div>
      <div className="mt-12 border-t-2 border-dashed border-line pt-6">
        <div className="font-mono text-xs text-muted">Colophon</div>
        <div className="mt-2 grid grid-cols-2 gap-4 font-mono text-sm">
          <div>
            <div className="text-muted">Display type</div>
            <div className="font-display font-bold">Bricolage Grotesque</div>
          </div>
          <div>
            <div className="text-muted">Body type</div>
            <div>Inter</div>
          </div>
          <div>
            <div className="text-muted">Mono / tags</div>
            <div>JetBrains Mono</div>
          </div>
          <div>
            <div className="text-muted">Issue</div>
            <div>№047</div>
          </div>
        </div>
      </div>
    </section>
  );
}
