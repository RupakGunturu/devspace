import { Link, NavLink } from "react-router-dom";
import { useRef, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { StaggeredMenu } from "./ui/staggered-menu/StaggeredMenu";
import type { StaggeredMenuHandle } from "./ui/staggered-menu/StaggeredMenu";

export function Header() {
  const { theme, setTheme } = useTheme();
  const menuRef = useRef<StaggeredMenuHandle>(null);
  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between border-b-2 border-line bg-ink/90 px-4 py-4 backdrop-blur sm:px-8">
        <div className="flex items-center gap-2">
          <button
            onClick={() => menuRef.current?.toggle()}
            className="sm:hidden rounded-sm p-1.5 text-yellow transition-colors hover:text-yellow/80"
            aria-label="Open menu"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="4" x2="16" y2="4" />
              <line x1="2" y1="9" x2="16" y2="9" />
              <line x1="2" y1="14" x2="16" y2="14" />
            </svg>
          </button>
          <Link to="/" className="font-display text-xl font-extrabold text-text no-underline">
            dev<span className="text-yellow">/</span>space
          </Link>
        </div>
        <nav className="hidden gap-6 sm:flex">
          <NavItem to="/">Feed</NavItem>
          <NavItem to="/tools">Tools</NavItem>
          <NavItem to="/cheat-sheets">Sheets</NavItem>
          <NavItem to="/games">Games</NavItem>
          <NavItem to="/about">About</NavItem>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-sm border border-line p-1.5 text-muted hover:text-yellow transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <div
            className="rounded-sm bg-yellow px-3 py-1.5 font-mono text-[11px] font-bold text-ink"
            style={{ transform: "rotate(-3deg)", boxShadow: "2px 2px 0 var(--coral)" }}
          >
            ISSUE №047
          </div>
        </div>
      </header>
      <div className="block sm:hidden">
        <StaggeredMenu
          ref={menuRef}
          hamburger
          isFixed
          position="right"
          colors={["#1a1a2e", "#2a2a4a"]}
          items={[
            { label: "Feed", link: "/" },
            { label: "Tools", link: "/tools" },
            { label: "Sheets", link: "/cheat-sheets" },
            { label: "Games", link: "/games" },
            { label: "About", link: "/about" },
          ]}
          accentColor="#f4d922"
          menuButtonColor="#f4d922"
          openMenuButtonColor="#f4d922"
          changeMenuColorOnOpen={false}
          displayItemNumbering
          displaySocials={false}
        />
      </div>
    </>
  );
}

function NavItem({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `font-mono text-[13px] no-underline transition-colors ${
          isActive ? "text-yellow" : "text-muted hover:text-yellow"
        }`
      }
    >
      {children}
    </NavLink>
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
}: {
  icon: string;
  title: string;
  children: ReactNode;
  index?: number;
  to?: string;
}) {
  const rot = ROTATIONS[index % ROTATIONS.length];
  const inner = (
    <div
      className={`sticker sticker-hover block rounded-md bg-paper p-6 text-foreground ${rot}`}
    >
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
      <p className="mt-2 text-[13px] text-foreground/70">{children}</p>
    </div>
  );
  if (to) {
    return (
      <Link to={to} className="no-underline">
        {inner}
      </Link>
    );
  }
  return inner;
}
