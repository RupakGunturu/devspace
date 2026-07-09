export interface Tool {
  slug: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  popular?: boolean;
}

export interface CheatSheetSection {
  title: string;
  items: { label: string; code?: string; description: string }[];
}

export interface CheatSheet {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  content: CheatSheetSection[];
}

export interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
}

export interface FavoriteItem {
  id: string;
  type: "tool" | "cheat-sheet" | "game";
  addedAt: number;
}

export interface RecentlyUsedItem {
  id: string;
  type: "tool" | "cheat-sheet" | "game";
  visitedAt: number;
}

export type Theme = "light" | "dark" | "system";
