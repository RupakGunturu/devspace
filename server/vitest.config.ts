import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    fileParallelism: false,
    testTimeout: 30000,
    hookTimeout: 30000,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: ["src/**"],
      exclude: ["src/index.ts"],
    },
  },
});
