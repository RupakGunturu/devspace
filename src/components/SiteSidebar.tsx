import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Sparkles,
  Boxes,
  Layers,
  BookOpen,
  Lightbulb,
  Rocket,
  Bot,
  Wrench,
  Gamepad2,
  Briefcase,
  Star,
  User,
  Info,
  Menu,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavEntry = { to: string; label: string; icon: React.ComponentType<{ className?: string }> };

const GROUPS: { title: string; items: NavEntry[] }[] = [
  {
    title: "Content",
    items: [
      { to: "/", label: "Feed", icon: Flame },
      { to: "/hidden-gems", label: "Hidden Gems", icon: Star },
      { to: "/bookmarks", label: "Bookmarks", icon: Sparkles },
    ],
  },
  {
    title: "Learn",
    items: [
      { to: "/stack-breakdown", label: "Stack Breakdowns", icon: Layers },
      { to: "/cheat-sheets", label: "Cheat Sheets", icon: BookOpen },
      { to: "/tips", label: "Tips", icon: Lightbulb },
      { to: "/feed/hot-take", label: "Startup Terms", icon: Rocket },
      { to: "/mcp-skills", label: "MCP Skills", icon: Bot },
    ],
  },
  {
    title: "Work",
    items: [
      { to: "/tools", label: "Tools", icon: Wrench },
      { to: "/games", label: "Games", icon: Gamepad2 },
      { to: "/hiring", label: "Hiring", icon: Briefcase },
    ],
  },
  {
    title: "Account",
    items: [
      { to: "/profile", label: "Profile", icon: User },
      { to: "/about", label: "About", icon: Info },
    ],
  },
];

export function SiteSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      {/* Mobile overlay backdrop */}
      {open && (
        <div className="fixed inset-0 z-30 bg-ink/50 lg:hidden" onClick={onClose} aria-hidden />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full flex-col border-r-2 border-line bg-paper transition-all duration-300 ease-out",
          // desktop: expandable rail
          "lg:translate-x-0",
          collapsed ? "lg:w-16" : "lg:w-64",
          // mobile: drawer
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div
          className={cn(
            "flex items-center border-b-2 border-line px-3 py-3",
            collapsed ? "lg:justify-center" : "lg:justify-between",
            "justify-between",
          )}
        >
          {(!collapsed || open) && (
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted">
              Explore
            </span>
          )}
          <div className="flex items-center gap-1">
            {open && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-sm p-1 text-muted transition-colors hover:text-yellow lg:hidden"
                aria-label="Close menu"
              >
                ✕
              </button>
            )}
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="hidden rounded-sm p-1 text-muted transition-colors hover:text-yellow lg:block"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-2 py-3">
          {GROUPS.map((group) => (
            <div key={group.title}>
              {(!collapsed || open) && (
                <p className="px-2 pb-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-muted/70">
                  {group.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.to + item.label}>
                      <NavLink
                        to={item.to}
                        end={item.to === "/"}
                        onClick={onClose}
                        title={collapsed ? item.label : undefined}
                        className={({ isActive }) =>
                          cn(
                            "group flex items-center gap-3 rounded-md px-2 py-2 font-mono text-[13px] no-underline transition-colors",
                            collapsed && !open && "lg:justify-center lg:px-0",
                            isActive
                              ? "bg-yellow text-ink"
                              : "text-muted hover:bg-paper-dim hover:text-yellow",
                          )
                        }
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {(!collapsed || open) && (
                          <span className="whitespace-nowrap text-left">{item.label}</span>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
