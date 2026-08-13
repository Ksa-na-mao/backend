import js from "@eslint/js";
import globals from "globals";
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
      "indent": ["error", 2],
      "no-self-assign": ["error"],
      "no-self-compare": ["error"],
      "no-this-before-super": ["error"],
      "no-undef": ["error"],
      "no-unreachable": ["error"],
      "no-unused-vars": ["error"],
      "camelcase": ["error"],
      "capitalized-comments": ["error"],
      "eqeqeq": ["error"],
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
    files: ["**/*.js"],

    languageOptions: {
      sourceType: "commonjs",
    },
  },
]);