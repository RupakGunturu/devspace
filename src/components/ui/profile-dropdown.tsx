import { LogOut, Settings, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";
import type { AuthUser } from "@/lib/api";

interface MenuItem {
  label: string;
  value?: string;
  href: string;
  icon: React.ReactNode;
}

interface ProfileDropdownProps {
  user: AuthUser;
  onLogout?: () => void;
  className?: string;
}

export default function ProfileDropdown({
  user,
  onLogout,
  className,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout?.();
    toast.danger("Logged out");
    navigate("/");
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const menuItems: MenuItem[] = [
    {
      label: "Profile",
      href: "/profile",
      icon: <User className="h-4 w-4" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <div className={cn("relative", className)} {...(!className ? {} : {})}>
      <DropdownMenu onOpenChange={setIsOpen}>
        <div className="group relative">
          <DropdownMenuTrigger asChild>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200/60 bg-white transition-all duration-200 hover:border-zinc-300 hover:shadow-sm focus:outline-none dark:border-zinc-800/60 dark:bg-zinc-900 dark:hover:border-zinc-700"
              type="button"
            >
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-[2px]">
                  <div className="h-full w-full overflow-hidden rounded-full bg-white dark:bg-zinc-900">
                    {user.avatar ? (
                      <img
                        alt={user.name}
                        className="h-full w-full rounded-full object-cover"
                        height={30}
                        src={user.avatar}
                        width={30}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <div
                      className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-[11px] font-bold text-white ${user.avatar ? "hidden" : ""}`}
                    >
                      {initials}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>

          <div
            className={cn(
              "absolute top-1/2 -right-3 -translate-y-1/2 transition-all duration-200",
              isOpen ? "opacity-100" : "opacity-60 group-hover:opacity-100"
            )}
          >
            <svg
              aria-hidden="true"
              className={cn(
                "transition-all duration-200",
                isOpen
                  ? "scale-110 text-blue-500 dark:text-blue-400"
                  : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"
              )}
              fill="none"
              height="24"
              viewBox="0 0 12 24"
              width="12"
            >
              <path
                d="M2 4C6 8 6 16 2 20"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          <DropdownMenuContent
            align="end"
            className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-56 max-sm:w-48 origin-top-right rounded-2xl border border-zinc-200/60 bg-white/95 p-2 shadow-xl shadow-zinc-900/5 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in dark:border-zinc-800/60 dark:bg-zinc-900/95 dark:shadow-zinc-950/20"
            sideOffset={4}
          >
            <div className="space-y-1">
              {menuItems.map((item) => (
                <DropdownMenuItem asChild key={item.label}>
                  <Link
                    className="group flex cursor-pointer items-center rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-zinc-200/50 hover:bg-zinc-100/80 hover:shadow-sm dark:hover:border-zinc-700/50 dark:hover:bg-zinc-800/60"
                    to={item.href}
                  >
                    <div className="flex flex-1 items-center gap-2">
                      {item.icon}
                      <span className="whitespace-nowrap font-medium text-sm text-zinc-900 leading-tight tracking-tight transition-colors group-hover:text-zinc-950 dark:text-zinc-100 dark:group-hover:text-zinc-50">
                        {item.label}
                      </span>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                      {item.value && (
                        <span
                          className={cn(
                            "rounded-md px-2 py-1 font-medium text-xs tracking-tight",
                            item.label === "Model"
                              ? "border border-blue-500/10 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                              : "border border-purple-500/10 bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
                          )}
                        >
                          {item.value}
                        </span>
                      )}
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>

            <DropdownMenuSeparator className="my-3 bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />

            <DropdownMenuItem asChild>
              <button
                className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-transparent bg-red-500/10 p-3 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/20 hover:shadow-sm"
                onClick={handleLogout}
                type="button"
              >
                <LogOut className="h-4 w-4 text-red-500 group-hover:text-red-600" />
                <span className="font-medium text-red-500 text-sm group-hover:text-red-600">
                  Sign Out
                </span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </div>
      </DropdownMenu>
    </div>
  );
}
