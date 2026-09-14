import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],

    languageOptions: {
      globals: globals.node,
    },

    rules: {
      "constructor-super": ["error"],
      "no-dupe-args": ["error"],
      "require-await": ["error"],
      "no-invalid-regexp": ["error"],
      indent: ["error", 2],
      "no-self-assign": ["error"],
      "no-self-compare": ["error"],
      "no-this-before-super": ["error"],
      "no-undef": ["error"],
      "no-unreachable": ["error"],
      "no-unused-vars": ["warn"],
      camelcase: ["error"],
      "capitalized-comments": ["error"],
      eqeqeq: ["error"],
      "no-console": ["warn"],
      "no-empty-function": ["error"],
      "no-eq-null": ["error"],
      "no-useless-catch": ["error"],
      "no-useless-call": ["error"],
      "no-useless-constructor": ["error"],
      "no-useless-return": ["error"],
      "no-invalid-this": ["error"],
      "no-lonely-if": ["error"],
      "no-var": ["error"],
      "prefer-const": ["error"],
    },
  },

  {
    files: ["**/*.{ts,tsx}"],

    extends: [tseslint.configs.recommended],

    languageOptions: {
      globals: globals.node,
    },

    rules: {
      indent: ["error", 2],
      "no-console": ["warn"],
      camelcase: ["error"],
      "capitalized-comments": ["error"],
      eqeqeq: ["error"],
      "no-var": ["error"],
      "prefer-const": ["error"],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn"],
    },
  },

  {
    files: ["**/*.js"],

    languageOptions: {
      sourceType: "commonjs",
    },
  },
]);
