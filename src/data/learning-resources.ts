import { LearningResource } from "../types";

export interface LearningCategory {
  id: string;
  label: string;
  icon: string;
  accent: string;
}

export const LEARNING_CATEGORIES: LearningCategory[] = [
  { id: "git", label: "Git / Version Control", icon: "GitBranch", accent: "#f97316" },
  { id: "css", label: "CSS / Frontend Concepts", icon: "Palette", accent: "#3b82f6" },
  { id: "sql", label: "SQL / Databases", icon: "Database", accent: "#d97706" },
  { id: "regex", label: "Regex", icon: "Regex", accent: "#8b5cf6" },
  { id: "vim", label: "Vim / Terminal", icon: "Terminal", accent: "#10b981" },
  { id: "algorithms", label: "Algorithms / Data Structures", icon: "Network", accent: "#06b6d4" },
  { id: "security", label: "Security / Web Internals", icon: "ShieldCheck", accent: "#ef4444" },
  {
    id: "programming",
    label: "Programming / AI Battle Games",
    icon: "Gamepad2",
    accent: "#ec4899",
  },
  { id: "lists", label: "Curated Lists", icon: "List", accent: "#14b8a6" },
];

export const learningResources: LearningResource[] = [
  {
    id: "oh-my-git",
    title: "Oh My Git!",
    description:
      "An open-source game about learning Git with an integrated terminal where players can execute real Git commands.",
    url: "https://ohmygit.org/",
    category: "git",
    cost: "free",
  },
  {
    id: "learn-git-branching",
    title: "Learn Git Branching",
    description:
      "A git repository visualizer, sandbox, and series of educational tutorials and challenges that helps developers understand git through visualization.",
    url: "https://learngitbranching.js.org/",
    category: "git",
    cost: "free",
  },
  {
    id: "git-it",
    title: "Git-it",
    description: "A cross-platform desktop app that teaches Git and GitHub on the command line.",
    url: "https://github.com/jlord/git-it-electron",
    category: "git",
    cost: "free",
  },
  {
    id: "git-immersion",
    title: "Git Immersion",
    description:
      "50+ guided labs teaching Git fundamentals through hands-on practice, from beginner concepts to team collaboration workflows.",
    url: "https://gitimmersion.com/",
    category: "git",
    cost: "free",
  },
  {
    id: "flexbox-froggy",
    title: "Flexbox Froggy",
    description: "A game for learning CSS flexbox by arranging frogs on lily pads.",
    url: "https://flexboxfroggy.com/",
    category: "css",
    cost: "free",
  },
  {
    id: "grid-garden",
    title: "Grid Garden",
    description: "Same concept as Flexbox Froggy but for CSS Grid.",
    url: "https://cssgridgarden.com/",
    category: "css",
    cost: "free",
  },
  {
    id: "grid-critters",
    title: "Grid Critters",
    description:
      "Use a ship's Grid tool to save alien critters from extinction while learning CSS grid.",
    url: "https://gridcritters.com/",
    category: "css",
    cost: "paid",
  },
  {
    id: "emmet-game",
    title: "Emmet Game",
    description:
      "Learn CSS selectors and HTML through a guessing game based on Emmet abbreviations.",
    url: "https://emmetgame.com/",
    category: "css",
    cost: "free",
  },
  {
    id: "sql-murder-mystery",
    title: "SQL Murder Mystery",
    description: "Solve a murder mystery using only SQL queries against a city's crime database.",
    url: "https://mystery.knightlab.com/",
    category: "sql",
    cost: "free",
  },
  {
    id: "sql-noir",
    title: "SQL Noir",
    description: "Solve detective-style mysteries by writing SQL queries.",
    url: "https://www.sqlnoir.com/",
    category: "sql",
    cost: "free",
  },
  {
    id: "regex-crossword",
    title: "Regex Crossword",
    description: "Solve crossword puzzles where the only clues are regular expressions.",
    url: "https://regexcrossword.com/",
    category: "regex",
    cost: "free",
  },
  {
    id: "regex-golf",
    title: "Regex Golf",
    description: "Warm up by writing the shortest regex that matches a target set of strings.",
    url: "https://alf.nu/RegexGolf",
    category: "regex",
    cost: "free",
  },
  {
    id: "regexone",
    title: "RegexOne",
    description: "Step-by-step interactive regex tutorial with live matching.",
    url: "https://regexone.com/",
    category: "regex",
    cost: "free",
  },
  {
    id: "vim-adventures",
    title: "Vim Adventures",
    description: "Learn Vim motions and commands while playing an actual adventure game.",
    url: "https://vim-adventures.com/",
    category: "vim",
    cost: "freemium",
  },
  {
    id: "openvim",
    title: "OpenVim",
    description: "A free interactive Vim tutorial directly in the browser.",
    url: "https://www.openvim.com/",
    category: "vim",
    cost: "free",
  },
  {
    id: "vim-genius",
    title: "Vim Genius",
    description: "Flashcard-style speed drills to build Vim command muscle memory.",
    url: "https://vimgenius.com/",
    category: "vim",
    cost: "free",
  },
  {
    id: "pathfinding-visualizer",
    title: "Pathfinding Visualizer",
    description:
      "Draw walls, place start/end nodes, and watch Dijkstra, A*, BFS, and DFS explore a grid live.",
    url: "https://clementmihailescu.github.io/Pathfinding-Visualizer/",
    category: "algorithms",
    cost: "free",
  },
  {
    id: "visualgo",
    title: "VisuAlgo",
    description:
      "Interactive visualizations covering sorting, trees, graphs, DP, and more, built for university-level CS teaching.",
    url: "https://visualgo.net/",
    category: "algorithms",
    cost: "free",
  },
  {
    id: "xss-game",
    title: "XSS Game (by Google)",
    description:
      "A game about tricking simulated pages into running injected code, teaching XSS vulnerabilities hands-on.",
    url: "https://xss-game.appspot.com/",
    category: "security",
    cost: "free",
  },
  {
    id: "codecombat",
    title: "CodeCombat",
    description: "Learn to code and use AI concepts entirely through gameplay.",
    url: "https://codecombat.com/",
    category: "programming",
    cost: "freemium",
  },
  {
    id: "screeps",
    title: "Screeps",
    description:
      "An actual MMO strategy game where the 'AI' is JavaScript code you write, running persistently in a shared world.",
    url: "https://screeps.com/",
    category: "programming",
    cost: "paid",
  },
  {
    id: "robocode",
    title: "RoboCode",
    description:
      "Build a Java robot battle tank that fights other tanks in real-time, on-screen battles.",
    url: "https://robocode.sourceforge.io/",
    category: "programming",
    cost: "free",
  },
  {
    id: "awesome-learn-by-playing",
    title: "awesome-learn-by-playing",
    description:
      "Community-curated GitHub list of learn-by-playing tech resources across Git, SQL, regex, Ruby, Scala, and more.",
    url: "https://github.com/lmammino/awesome-learn-by-playing",
    category: "lists",
    cost: "free",
  },
  {
    id: "awesome-educational-games",
    title: "AwesomeEducationalGames",
    description:
      "Curated list of educational games for software development topics (Vim, CSS, Git, security, robotics).",
    url: "https://github.com/xmatekaj/AwesomeEducationalGames",
    category: "lists",
    cost: "free",
  },
];
