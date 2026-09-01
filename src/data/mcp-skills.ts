import { McpSkill } from "../types";

export const MCP_SKILL_CATEGORIES: Record<string, { label: string; color: string }> = {
  productivity: { label: "Productivity", color: "#eab308" },
  data: { label: "Data", color: "#10b981" },
  code: { label: "Code", color: "#6366f1" },
  web: { label: "Web", color: "#06b6d4" },
  communication: { label: "Communication", color: "#ec4899" },
  devops: { label: "DevOps", color: "#f97316" },
  ai: { label: "AI", color: "#8b5cf6" },
};

export const MCP_SKILL_COLORS: Record<string, { bg: string; darkBg: string; icon: string }> = {
  productivity: {
    bg: "bg-yellow-100",
    darkBg: "dark:bg-yellow-900/30",
    icon: "text-yellow-600 dark:text-yellow-400",
  },
  data: {
    bg: "bg-emerald-100",
    darkBg: "dark:bg-emerald-900/30",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  code: {
    bg: "bg-indigo-100",
    darkBg: "dark:bg-indigo-900/30",
    icon: "text-indigo-600 dark:text-indigo-400",
  },
  web: {
    bg: "bg-cyan-100",
    darkBg: "dark:bg-cyan-900/30",
    icon: "text-cyan-600 dark:text-cyan-400",
  },
  communication: {
    bg: "bg-pink-100",
    darkBg: "dark:bg-pink-900/30",
    icon: "text-pink-600 dark:text-pink-400",
  },
  devops: {
    bg: "bg-orange-100",
    darkBg: "dark:bg-orange-900/30",
    icon: "text-orange-600 dark:text-orange-400",
  },
  ai: {
    bg: "bg-violet-100",
    darkBg: "dark:bg-violet-900/30",
    icon: "text-violet-600 dark:text-violet-400",
  },
};

export const MCP_SKILLS: McpSkill[] = [
  {
    id: "filesystem",
    name: "Filesystem",
    description:
      "Read, write, and manage files and directories through a safe, sandboxed interface.",
    icon: "FolderOpen",
    category: "code",
    tags: ["files", "read", "write", "sandbox"],
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem",
  },
  {
    id: "github-mcp",
    name: "GitHub",
    description:
      "Create repos, manage issues, search code, and interact with the GitHub API seamlessly.",
    icon: "GitBranch",
    category: "code",
    tags: ["github", "repos", "issues", "PR"],
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/github",
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    description: "Query and explore PostgreSQL databases with read-only safety by default.",
    icon: "Database",
    category: "data",
    tags: ["postgres", "sql", "database", "query"],
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres",
  },
  {
    id: "brave-search",
    name: "Brave Search",
    description: "Web and local search powered by Brave's index — no API key overload.",
    icon: "Search",
    category: "web",
    tags: ["search", "web", "brave", "discovery"],
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search",
  },
  {
    id: "google-maps",
    name: "Google Maps",
    description: "Places, directions, and geocoding through the Google Maps Platform API.",
    icon: "MapPin",
    category: "productivity",
    tags: ["maps", "places", "geocoding", "navigation"],
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/google-maps",
  },
  {
    id: "slack",
    name: "Slack",
    description:
      "Read and post messages, manage channels, and search conversations in Slack workspaces.",
    icon: "MessageSquare",
    category: "communication",
    tags: ["slack", "messaging", "channels", "workspace"],
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/slack",
  },
  {
    id: "docker",
    name: "Docker",
    description: "Manage containers, images, and volumes — run and inspect Docker environments.",
    icon: "Container",
    category: "devops",
    tags: ["docker", "containers", "images", "devops"],
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/docker",
  },
  {
    id: "memory",
    name: "Memory",
    description: "Persistent knowledge graph for storing and retrieving context across sessions.",
    icon: "Brain",
    category: "ai",
    tags: ["memory", "knowledge-graph", "context", "persistence"],
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/memory",
  },
  {
    id: "puppeteer",
    name: "Puppeteer",
    description: "Browser automation — screenshots, scraping, form filling, and page interaction.",
    icon: "Globe",
    category: "web",
    tags: ["browser", "automation", "scraping", "screenshots"],
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer",
  },
  {
    id: "sqlite",
    name: "SQLite",
    description: "Lightweight local database queries — perfect for embedded and small-scale data.",
    icon: "HardDrive",
    category: "data",
    tags: ["sqlite", "database", "local", "lightweight"],
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite",
  },
];
