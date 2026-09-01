import { useMemo, useState } from "react";
import { ToolLayout } from "./ToolLayout";

const deprecated = [
  "request",
  "node-uuid",
  "jade",
  "mkdirp",
  "moment",
  "tslint",
  "nyc",
  "istanbul",
];
const known = new Set([
  "react",
  "react-dom",
  "next",
  "vue",
  "nuxt",
  "angular",
  "svelte",
  "typescript",
  "eslint",
  "prettier",
  "vite",
  "webpack",
  "parcel",
  "tailwindcss",
  "postcss",
  "sass",
  "less",
  "prisma",
  "mongoose",
  "sequelize",
  "typeorm",
  "drizzle-orm",
  "express",
  "fastify",
  "hono",
  "hapi",
  "koa",
  "zod",
  "yup",
  "joi",
  "ajv",
  "axios",
  "node-fetch",
  "got",
  "ky",
  "swr",
  "zustand",
  "jotai",
  "recoil",
  "redux",
  "@reduxjs/toolkit",
  "lucide-react",
  "heroicons",
  "@radix-ui/react-icons",
  "framer-motion",
  "motion",
  "gsap",
  "jest",
  "vitest",
  "mocha",
  "chai",
  "@testing-library/react",
  "cypress",
  "playwright",
  "storybook",
  "@storybook/react",
  "date-fns",
  "dayjs",
  "luxon",
  "lodash",
  "ramda",
  "radash",
  "graphql",
  "@apollo/client",
  "urql",
  "trpc",
  "stripe",
  "@stripe/stripe-js",
  "firebase",
  "@firebase/app",
  "supabase",
  "dotenv",
  "cross-env",
  "concurrently",
  "npm-run-all",
  "husky",
  "lint-staged",
  "commitlint",
  "ts-node",
  "tsx",
  "esbuild",
  "swc",
]);

interface Analysis {
  totalDeps: number;
  totalDevDeps: number;
  issues: { severity: "warn" | "error" | "info"; message: string }[];
  depList: { name: string; version: string; isDev: boolean }[];
}

export function PackageJsonChecker() {
  const [input, setInput] = useState(`{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "moment": "^2.29.4",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "eslint": "^8.50.0",
    "vite": "^5.0.0",
    "prettier": "^3.0.0"
  }
}`);

  const analysis = useMemo((): Analysis => {
    const issues: Analysis["issues"] = [];
    const depList: Analysis["depList"] = [];

    try {
      const pkg = JSON.parse(input);
      const deps = pkg.dependencies || {};
      const devDeps = pkg.devDependencies || {};

      for (const [name, version] of Object.entries(deps)) {
        depList.push({ name, version: String(version), isDev: false });
        if (deprecated.includes(name)) {
          issues.push({
            severity: "error",
            message: `"${name}" is deprecated. Consider migrating to a modern alternative.`,
          });
        }
        if (
          typeof version === "string" &&
          !version.startsWith("^") &&
          !version.startsWith("~") &&
          !version.startsWith(">=")
        ) {
          issues.push({
            severity: "warn",
            message: `"${name}" uses an exact version (${version}). Consider using ^ for patch updates.`,
          });
        }
      }

      for (const [name, version] of Object.entries(devDeps)) {
        depList.push({ name, version: String(version), isDev: true });
        if (deprecated.includes(name)) {
          issues.push({ severity: "warn", message: `Dev dependency "${name}" is deprecated.` });
        }
      }

      if (Object.keys(deps).length > 20) {
        issues.push({
          severity: "warn",
          message: `High dependency count (${Object.keys(deps).length}). Consider if all are necessary.`,
        });
      }
      if (Object.keys(deps).length > 40) {
        issues.push({
          severity: "error",
          message: `Very high dependency count (${Object.keys(deps).length}). Risk of supply-chain attacks.`,
        });
      }

      if (!devDeps["typescript"] && !devDeps["ts-node"]) {
        issues.push({
          severity: "info",
          message: "No TypeScript detected. Consider adding type safety.",
        });
      }
      if (!devDeps["eslint"]) {
        issues.push({ severity: "info", message: "No ESLint found. Consider adding linting." });
      }
      if (!devDeps["prettier"] && !devDeps["eslint-config-prettier"]) {
        issues.push({
          severity: "info",
          message: "No Prettier found. Consider adding code formatting.",
        });
      }
      if (!devDeps["jest"] && !devDeps["vitest"] && !devDeps["mocha"]) {
        issues.push({ severity: "info", message: "No test framework detected." });
      }
    } catch {
      issues.push({ severity: "error", message: "Invalid JSON — could not parse package.json." });
    }

    return {
      totalDeps: depList.filter((d) => !d.isDev).length,
      totalDevDeps: depList.filter((d) => d.isDev).length,
      issues,
      depList,
    };
  }, [input]);

  const severityColor = { error: "text-red-500", warn: "text-yellow", info: "text-blue-400" };
  const severityIcon = { error: "!", warn: "!", info: "i" };

  return (
    <ToolLayout id="package-json-checker">
      <div>
        <label className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Paste package.json
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          rows={16}
          className="w-full resize-y rounded-md border-2 border-line bg-input-bg p-3 font-mono text-sm text-input-text outline-none focus:border-accent"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-line bg-paper-dim p-3 text-center">
          <div className="text-2xl font-bold text-foreground">{analysis.totalDeps}</div>
          <div className="text-xs text-muted">Dependencies</div>
        </div>
        <div className="rounded-md border border-line bg-paper-dim p-3 text-center">
          <div className="text-2xl font-bold text-foreground">{analysis.totalDevDeps}</div>
          <div className="text-xs text-muted">Dev Dependencies</div>
        </div>
        <div className="rounded-md border border-line bg-paper-dim p-3 text-center">
          <div className="text-2xl font-bold text-foreground">{analysis.issues.length}</div>
          <div className="text-xs text-muted">Issues Found</div>
        </div>
      </div>

      <div className="space-y-2">
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-muted">
          Issues
        </span>
        {analysis.issues.length === 0 ? (
          <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600">
            No issues found — looking good!
          </div>
        ) : (
          analysis.issues.map((issue, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 rounded-md border border-line p-2.5 text-sm ${severityColor[issue.severity]}`}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-current/10 text-xs font-bold">
                {severityIcon[issue.severity]}
              </span>
              {issue.message}
            </div>
          ))
        )}
      </div>

      {analysis.depList.length > 0 && (
        <div>
          <span className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted">
            All Packages
          </span>
          <div className="max-h-64 space-y-1 overflow-auto rounded-md border border-line p-2">
            {analysis.depList
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((dep) => (
                <div
                  key={dep.name}
                  className="flex items-center justify-between rounded px-2 py-1 text-xs font-mono"
                >
                  <span
                    className={
                      deprecated.includes(dep.name)
                        ? "text-red-500 line-through"
                        : "text-foreground"
                    }
                  >
                    {dep.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted">{dep.version}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] ${dep.isDev ? "bg-blue-500/10 text-blue-500" : "bg-green-500/10 text-green-500"}`}
                    >
                      {dep.isDev ? "dev" : "prod"}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
