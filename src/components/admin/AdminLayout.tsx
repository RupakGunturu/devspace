import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
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
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/content/new", label: "New Content", icon: FileText, end: false },
  { to: "/admin/content?type=post", label: "Posts", icon: FileText, end: false },
  { to: "/admin/content?type=series", label: "Series", icon: FileClock, end: false },
  { to: "/admin/content?type=tip", label: "Tips", icon: Lightbulb, end: false },
  { to: "/admin/content?type=cheat-sheet", label: "Cheat Sheets", icon: LayoutList, end: false },
  {
    to: "/admin/content?type=stack-breakdown",
    label: "Stack Breakdowns",
    icon: Layers,
    end: false,
  },
  { to: "/admin/content?type=hidden-gem", label: "Hidden Gems", icon: Sparkles, end: false },
  { to: "/admin/content?type=hiring", label: "Hiring", icon: Briefcase, end: false },
  { to: "/admin/content?type=mcp-skill", label: "MCP Skills", icon: Bot, end: false },
  { to: "/admin/content?type=startup-term", label: "Startup Terms", icon: FileText, end: false },
  { to: "/admin/games", label: "Games", icon: Gamepad2, end: false },
  { to: "/admin/tools", label: "Tools", icon: Wrench, end: false },
  { to: "/admin/images", label: "Images", icon: ImageIcon, end: false },
  { to: "/admin/deployments", label: "Deploy Log", icon: History, end: false },
];

export function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
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
        {/* Mobile backdrop — closes the drawer when tapping outside */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-10 bg-black/50 lg:hidden"
            aria-hidden="true"
          />
        )}

        {/* Sidebar — drawer on mobile, fixed column on lg */}
        <aside
          className={`${
            mobileOpen ? "flex" : "hidden"
          } flex-col rounded-lg border border-line bg-card p-2 lg:flex lg:w-56 lg:shrink-0 ${
            mobileOpen ? "absolute top-14 bottom-6 left-4 z-20 w-56 shadow-xl" : ""
          }`}
        >
          <nav
            className={`min-w-0 gap-1 ${
              mobileOpen ? "flex max-h-full flex-col overflow-y-auto" : "flex"
            } overflow-x-auto lg:flex lg:flex-col lg:overflow-visible`}
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 whitespace-nowrap rounded-sm px-3 py-2 font-mono text-[12px] transition-colors ${
                    isActive
                      ? "bg-yellow font-bold text-ink"
                      : "text-muted hover:bg-paper-dim hover:text-yellow"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
