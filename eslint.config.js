import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

// Features expose a public API through index.ts; nothing may reach past it.
const FEATURE_INTERNALS = {
  group: ["~/features/*/*"],
  message: "Import from the feature's index.ts instead.",
};

export default tseslint.config(
  {
    ignores: [
      "build/",
      "coverage/",
      ".react-router/",
      "playwright-report/",
      "test-results/",
    ],
  },
  js.configs.recommended,
  tseslint.configs.strict,
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "no-console": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-expect-error": "allow-with-description", "ts-ignore": true },
      ],
      "no-restricted-imports": ["error", { patterns: [FEATURE_INTERNALS] }],
      // Allow focusable regions, the accessible pattern for scroll containers.
      "jsx-a11y/no-noninteractive-tabindex": [
        "error",
        { tags: [], roles: ["tabpanel", "region"] },
      ],
    },
  },
  {
    // The typing engine stays pure: no DOM, no React, no clocks.
    files: ["app/features/typing-engine/**/*.ts"],
    rules: {
      "no-restricted-globals": [
        "error",
        { name: "window", message: "The typing engine must stay pure." },
        { name: "document", message: "The typing engine must stay pure." },
        { name: "performance", message: "Pass timestamps in instead." },
      ],
      "no-restricted-properties": [
        "error",
        {
          object: "Date",
          property: "now",
          message: "Pass timestamps in instead.",
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "NewExpression[callee.name='Date']",
          message: "Pass timestamps in instead.",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            FEATURE_INTERNALS,
            { group: ["react", "react-*", "react/*", "react-router*"] },
          ],
        },
      ],
    },
  },
  {
    // Non-null assertions are allowed in tests only.
    files: ["**/*.test.{ts,tsx}", "e2e/**"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
);
