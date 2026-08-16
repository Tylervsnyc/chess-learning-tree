import nextConfig from "eslint-config-next";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextConfig,

  {
    ignores: ["ios/**", "capacitor-shell/**", "data/**"],
  },

  // Project-wide rule overrides — carried over from Chess Path so the extracted
  // code lints the same way it did there.
  {
    rules: {
      // react-hooks v7 (bundled with eslint-config-next 16) adds React Compiler
      // rules that flag pre-existing patterns throughout the run code. Keep the
      // two rules the code was actually written against.
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

      "react/no-unescaped-entities": "off",
      "react/jsx-no-comment-textnodes": "warn",
      "import/no-anonymous-default-export": "off",

      // False positive: flags local variables named "module" in data files
      "@next/next/no-assign-module-variable": "off",
    },
  },
];
