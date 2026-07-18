import { createContext, useContext, type ReactNode } from "react";

interface ToolAccent {
  color: string;
  fg: string;
}

const ToolAccentContext = createContext<ToolAccent>({ color: "#e8c81c", fg: "#1a1a2e" });

export function ToolAccentProvider({ color, fg, children }: ToolAccent & { children: ReactNode }) {
  return (
    <ToolAccentContext.Provider value={{ color, fg }}>
      {children}
    </ToolAccentContext.Provider>
  );
}

export function useToolAccent() {
  return useContext(ToolAccentContext);
}
