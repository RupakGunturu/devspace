import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "./AuthProvider";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";
import ProfileDropdown from "./ui/profile-dropdown";
import { Footer as LargeFooter } from "./ui/large-name-footer";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b-2 border-line bg-ink/90 px-3 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="rounded-sm p-1.5 text-yellow transition-colors hover:text-yellow/80 lg:hidden"
          aria-label="Open menu"
          type="button"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="2" y1="4" x2="16" y2="4" />
            <line x1="2" y1="9" x2="16" y2="9" />
            <line x1="2" y1="14" x2="16" y2="14" />
          </svg>
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-xl font-extrabold text-text no-underline"
        >
          <img src="/favicon.png" alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
          <span>
            dev<span className="text-yellow">/</span>space
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <AnimatedThemeToggler
          className="text-text"
          theme={theme === "system" ? undefined : theme}
          onThemeChange={(t) => setTheme(t)}
        />
        {user ? (
          <ProfileDropdown user={user} onLogout={logout} />
        ) : (
          <Link
            to="/login"
            className="rounded-sm bg-yellow px-3 py-1.5 font-mono text-[11px] font-bold text-ink no-underline transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(244,217,34,0.4)]"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return <LargeFooter />;
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
          <span key={i} className="px-6 font-display text-lg font-extrabold uppercase text-ink">
            ★ {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SectionHead({
  idx,
  title,
  color = "yellow",
}: {
  idx: string;
  title: string;
  color?: "yellow" | "coral";
}) {
  const colorClasses = color === "coral" ? "border-coral text-coral" : "border-yellow text-yellow";
  return (
    <div className="mb-8 flex items-baseline gap-4">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm font-extrabold ${colorClasses}`}
      >
        {idx}
      </div>
      <h2 className="whitespace-nowrap font-display text-2xl font-bold sm:text-3xl">{title}</h2>
    </div>
  );
}

const ROTATIONS = [
  "-rotate-[1.5deg]",
  "rotate-[1deg]",
  "-rotate-[0.5deg]",
  "rotate-[1.5deg]",
  "-rotate-[1deg]",
  "rotate-[0.5deg]",
];

export function StickerCard({
  icon,
  title,
  children,
  index = 0,
  to,
  actions,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  index?: number;
  to?: string;
  actions?: ReactNode;
}) {
  const rot = ROTATIONS[index % ROTATIONS.length];
  const inner = (
    <div className={`sticker sticker-hover block rounded-md bg-paper p-6 text-foreground ${rot}`}>
      <div className="mb-3">
        {typeof icon === "string" ? (
          <div className="text-3xl leading-none">{icon}</div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 [&_svg]:h-5 [&_svg]:w-5">
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-bold">{title}</h3>
        {actions}
      </div>
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
