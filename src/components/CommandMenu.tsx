import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Layers,
  Wrench,
  FileText,
  Gamepad2,
  Lightbulb,
  Info,
  Sun,
  Moon,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { useTheme } from "./ThemeProvider";

const navItems = [
  { icon: Home, label: "Feed", path: "/" },
  { icon: Layers, label: "Stacks", path: "/stack-breakdown" },
  { icon: Wrench, label: "Tools", path: "/tools" },
  { icon: FileText, label: "Sheets", path: "/cheat-sheets" },
  { icon: Gamepad2, label: "Games", path: "/games" },
  { icon: Lightbulb, label: "Tips", path: "/tips" },
  { icon: Info, label: "About", path: "/about" },
];

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <CommandDialog onOpenChange={setOpen} open={open}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="h-[320px] max-h-[320px] hide-scrollbar">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navItems.map((item) => (
            <CommandItem
              key={item.path}
              onSelect={() => runCommand(() => navigate(item.path))}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
              <CommandShortcut>{item.path}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() =>
              runCommand(() =>
                setTheme(theme === "dark" ? "light" : "dark")
              )
            }
          >
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>Toggle theme</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
