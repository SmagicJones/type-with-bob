import { defineConfig } from "vitest/config";

// Kept separate from vite.config.ts: the React Router plugin is for the app
// build and dev server, not for running tests in jsdom.
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    include: ["app/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    restoreMocks: true,
    coverage: {
      provider: "v8",
      include: ["app/**/*.{ts,tsx}"],
      exclude: [
        "app/**/*.test.{ts,tsx}",
        "app/**/test-utils/**",
        // Framework wiring, exercised by the Playwright suite instead.
        "app/root.tsx",
        "app/routes.ts",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
        "app/features/typing-engine/**": { lines: 90, functions: 90 },
        "app/features/stats/**": { lines: 90, functions: 90 },
        "app/features/progress/**": { lines: 90, functions: 90 },
      },
    },
  },
});
