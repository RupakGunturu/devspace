import { HiringItem } from "../types";

export const HIRING_CATEGORIES: Record<string, { label: string; color: string }> = {
  "job-boards": { label: "Job Boards", color: "#3b82f6" },
  freelance: { label: "Freelance", color: "#8b5cf6" },
  remote: { label: "Remote", color: "#10b981" },
  internships: { label: "Internships", color: "#f97316" },
  "career-resources": { label: "Career Resources", color: "#ec4899" },
};

export const HIRING_CATEGORY_COLORS: Record<string, { bg: string; darkBg: string; icon: string }> =
  {
    "job-boards": {
      bg: "bg-blue-100",
      darkBg: "dark:bg-blue-900/30",
      icon: "text-blue-600 dark:text-blue-400",
    },
    freelance: {
      bg: "bg-violet-100",
      darkBg: "dark:bg-violet-900/30",
      icon: "text-violet-600 dark:text-violet-400",
    },
    remote: {
      bg: "bg-emerald-100",
      darkBg: "dark:bg-emerald-900/30",
      icon: "text-emerald-600 dark:text-emerald-400",
    },
    internships: {
      bg: "bg-orange-100",
      darkBg: "dark:bg-orange-900/30",
      icon: "text-orange-600 dark:text-orange-400",
    },
    "career-resources": {
      bg: "bg-pink-100",
      darkBg: "dark:bg-pink-900/30",
      icon: "text-pink-600 dark:text-pink-400",
    },
  };

export const HIRING_ITEMS: HiringItem[] = [
  {
    id: "linkedin-jobs",
    name: "LinkedIn Jobs",
    url: "https://linkedin.com/jobs",
    icon: "Briefcase",
    tagline: "The professional network's job board — filter by remote, entry-level, and more.",
    category: "job-boards",
    tags: ["professional", "networking", "full-time"],
  },
  {
    id: "indeed",
    name: "Indeed",
    url: "https://indeed.com",
    icon: "Search",
    tagline: "Massive job aggregator — one search across thousands of company career pages.",
    category: "job-boards",
    tags: ["aggregator", "large", "all-levels"],
  },
  {
    id: "wellfound",
    name: "Wellfound (AngelList)",
    url: "https://wellfound.com",
    icon: "Rocket",
    tagline: "Startup jobs, equity comp details, and direct founder messaging.",
    category: "job-boards",
    tags: ["startup", "equity", "founders"],
  },
  {
    id: "toptal",
    name: "Toptal",
    url: "https://toptal.com",
    icon: "Star",
    tagline: "Top 3% freelance talent — rigorous screening, premium rates.",
    category: "freelance",
    tags: ["premium", "screening", "high-pay"],
  },
  {
    id: "upwork",
    name: "Upwork",
    url: "https://upwork.com",
    icon: "Globe",
    tagline: "Largest freelance marketplace — from quick gigs to long-term contracts.",
    category: "freelance",
    tags: ["marketplace", "gigs", "flexible"],
  },
  {
    id: "github-jobs",
    name: "GitHub Jobs",
    url: "https://github.com/jobs",
    icon: "GitBranch",
    tagline: "Developer-focused listings — employers look at your actual code.",
    category: "job-boards",
    tags: ["developer", "open-source", "technical"],
  },
  {
    id: "remote-ok",
    name: "Remote OK",
    url: "https://remoteok.com",
    icon: "Wifi",
    tagline: "Curated remote-only jobs — no location required, worldwide.",
    category: "remote",
    tags: ["remote", "worldwide", "async"],
  },
  {
    id: "weworkremotely",
    name: "We Work Remotely",
    url: "https://weworkremotely.com",
    icon: "Building2",
    tagline: "One of the oldest remote job boards — quality over quantity.",
    category: "remote",
    tags: ["remote", "curated", "quality"],
  },
  {
    id: "internally",
    name: "Interness",
    url: "https://interness.com",
    icon: "GraduationCap",
    tagline: "Curated internship opportunities for students and fresh grads.",
    category: "internships",
    tags: ["internship", "students", "entry-level"],
  },
  {
    id: "glassdoor",
    name: "Glassdoor",
    url: "https://glassdoor.com",
    icon: "BarChart3",
    tagline: "Salary data, company reviews, and interview questions — research before you apply.",
    category: "career-resources",
    tags: ["reviews", "salary", "research"],
  },
];
