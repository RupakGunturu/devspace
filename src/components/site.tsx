import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b-2 border-line bg-ink/90 px-4 py-4 backdrop-blur sm:px-8">
      <Link to="/" className="font-display text-xl font-extrabold text-text no-underline">
        dev<span className="text-yellow">/</span>space
      </Link>
      <nav className="hidden gap-6 sm:flex">
        <NavLink to="/">Feed</NavLink>
        <NavLink to="/tools">Tools</NavLink>
        <NavLink to="/games">Games</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
      <div
        className="rounded-sm bg-yellow px-3 py-1.5 font-mono text-[11px] font-bold text-ink"
        style={{ transform: "rotate(-3deg)", boxShadow: "2px 2px 0 var(--coral)" }}
      >
        ISSUE №047
      </div>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="font-mono text-[13px] text-muted no-underline transition-colors hover:text-yellow"
      activeProps={{ className: "font-mono text-[13px] text-yellow no-underline" }}
      activeOptions={{ exact: to === "/" }}
    >
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="border-t-2 border-line px-8 py-10 text-center font-mono text-xs text-muted">
      dev<span className="text-yellow">/</span>space — issue №047, built by a student, for students
    </footer>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div
      className="overflow-hidden border-y-2 border-line bg-coral py-2.5"
      style={{ transform: "rotate(-1deg)", marginLeft: "-10px", marginRight: "-10px" }}
    >
      <div className="inline-flex whitespace-nowrap animate-marquee">
        {doubled.map((s, i) => (
          <span
            key={i}
            className="px-6 font-display text-lg font-extrabold uppercase text-ink"
          >
            ★ {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SectionHead({ idx, title }: { idx: string; title: string }) {
  return (
    <div className="mb-8 flex items-baseline gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-yellow font-display text-sm font-extrabold text-yellow">
        {idx}
      </div>
      <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
    </div>
  );
}

const ROTATIONS = ["-rotate-[1.5deg]", "rotate-[1deg]", "-rotate-[0.5deg]", "rotate-[1.5deg]", "-rotate-[1deg]", "rotate-[0.5deg]"];

export function StickerCard({
  icon,
  title,
  children,
  index = 0,
  to,
  params,
}: {
  icon: string;
  title: string;
  children: ReactNode;
  index?: number;
  to?: string;
  params?: Record<string, string>;
}) {
  const rot = ROTATIONS[index % ROTATIONS.length];
  const inner = (
    <div
      className={`sticker sticker-hover block rounded-md bg-paper p-6 text-ink ${rot}`}
    >
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
      <p className="mt-2 text-[13px] text-ink/70">{children}</p>
    </div>
  );
  if (to) {
    return (
      <Link to={to} params={params as never} className="no-underline">
        {inner}
      </Link>
    );
  }
  return inner;
}
