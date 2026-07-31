import nextConfig from "eslint-config-next";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextConfig,

  // Ignore directories that are not part of the main app
  {
    ignores: [
      "_archive/**",
      "lesson-animation-assets/**",
      "lesson-animations/**",
      "lesson-complete-animations/**",
      "wrong-answer-animations/**",
      "animated-logo-assets/**",
      "ads/**",
      "social-media/**",
      ".claude/worktrees/**",
      ".worktree-*/**",
      "public/mediapipe/**", // emscripten glue copied from node_modules, not our code
    ],
  },

  // Project-wide rule overrides
  {
    rules: {
      // --- React Hooks: match the old next lint behavior ---
      // The old next lint used react-hooks v4 which only had these two rules.
      // react-hooks v7 (bundled with eslint-config-next 16) adds many new
      // React Compiler rules that flag pre-existing patterns. Disable them.
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/static-components": "off",
      "react-hooks/use-memo": "off",
      "react-hooks/component-hook-factories": "off",
      "react-hooks/incompatible-library": "off",
      "react-hooks/globals": "off",
      "react-hooks/refs": "off",
      "react-hooks/error-boundaries": "off",
      "react-hooks/set-state-in-render": "off",
      "react-hooks/unsupported-syntax": "off",
      "react-hooks/config": "off",
      "react-hooks/gating": "off",

      // --- Relaxed rules (same as old next lint defaults) ---
      "react/no-unescaped-entities": "off",
      "react/jsx-no-comment-textnodes": "warn",
      "import/no-anonymous-default-export": "off",

      // False positive: flags local variables named "module" in data files
      "@next/next/no-assign-module-variable": "off",
    },
  },
];
