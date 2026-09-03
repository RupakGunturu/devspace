import { NavLink, Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import {
  LayoutDashboard,
  FileText,
  Gamepad2,
  Wrench,
  ImageIcon,
  History,
  Layers,
  Briefcase,
  Bot,
  Sparkles,
  Lightbulb,
  LayoutList,
  FileClock,
  Home,
  LogOut,
  Menu,
  X,
  Rocket,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  end?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    title: "Content",
    items: [
      { to: "/admin/content/new", label: "New Content", icon: FileText },
      { to: "/admin/content?type=post", label: "Posts", icon: FileText },
      { to: "/admin/content?type=series", label: "Series", icon: FileClock },
      { to: "/admin/content?type=tip", label: "Tips", icon: Lightbulb },
      { to: "/admin/content?type=cheat-sheet", label: "Cheat Sheets", icon: LayoutList },
      { to: "/admin/content?type=stack-breakdown", label: "Stack Breakdowns", icon: Layers },
      { to: "/admin/content?type=hidden-gem", label: "Hidden Gems", icon: Sparkles },
      { to: "/admin/content?type=startup-term", label: "Startup Terms", icon: Rocket },
      { to: "/admin/content?type=hiring", label: "Hiring", icon: Briefcase },
      { to: "/admin/content?type=mcp-skill", label: "MCP Skills", icon: Bot },
      { to: "/admin/content?type=learning-resource", label: "Learning", icon: GraduationCap },
    ],
  },
  {
    title: "Media",
    items: [
      { to: "/admin/games", label: "Games", icon: Gamepad2 },
      { to: "/admin/tools", label: "Tools", icon: Wrench },
      { to: "/admin/images", label: "Images", icon: ImageIcon },
    ],
  },
  {
    title: "System",
    items: [{ to: "/admin/deployments", label: "Deploy Log", icon: History }],
  },
];

export function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Admin header */}
      <header className="sticky top-0 z-30 border-b-2 border-line bg-ink/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-sm p-2 text-text transition-colors hover:text-yellow lg:hidden"
              aria-label="Toggle admin menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link to="/" className="font-display text-lg font-extrabold text-text">
              dev/space <span className="text-yellow">ADMIN</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden font-mono text-[12px] text-muted sm:inline">{user?.email}</span>
            <Link
              to="/"
              className="flex items-center gap-1 font-mono text-[11px] font-bold text-text transition-colors hover:text-yellow"
            >
              <Home className="h-4 w-4" /> Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 rounded-sm bg-coral px-2 py-1 font-mono text-[11px] font-bold text-ink transition-colors hover:opacity-90"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6 sm:px-6">
        {/* Mobile backdrop */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-10 bg-black/50 lg:hidden"
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`${
            mobileOpen ? "flex" : "hidden"
          } flex-col rounded-lg border border-line bg-card lg:flex lg:w-56 lg:shrink-0 ${
            mobileOpen ? "absolute top-14 bottom-6 left-4 z-20 w-56 shadow-xl" : ""
          }`}
        >
          <nav
            className={`min-w-0 gap-1 p-2 ${
              mobileOpen ? "flex max-h-full flex-col overflow-y-auto" : "flex"
            } overflow-x-auto lg:flex lg:flex-col lg:overflow-visible`}
          >
            {NAV_SECTIONS.map((section) => (
              <div key={section.title} className="mb-2">
                <div className="mb-1 px-3 pt-2 font-mono text-[10px] font-bold uppercase tracking-wider text-muted/60">
                  {section.title}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-2 whitespace-nowrap rounded-sm px-3 py-2 font-mono text-[12px] transition-all duration-150 ${
                          isActive
                            ? "bg-yellow/15 font-bold text-yellow"
                            : "text-muted hover:bg-paper-dim hover:text-foreground"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.div
                              layoutId="admin-nav-active"
                              className="absolute top-0 left-0 h-full w-[3px] rounded-r-full bg-yellow"
                              transition={{ type: "spring", stiffness: 500, damping: 35 }}
                            />
                          )}
                          <item.icon
                            className={`h-4 w-4 transition-colors ${isActive ? "text-yellow" : "text-muted group-hover:text-foreground"}`}
                          />
                          {item.label}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
