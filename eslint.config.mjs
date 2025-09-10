import { defineConfig } from "eslint-define-config";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";
import globals from "globals";

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
  recommendedConfig: js.configs.recommended,
});

export default defineConfig([
  // Ignore patterns (tương đương ignorePatterns trong config cũ)
  {
    ignores: [
      "src/**/*.test.{ts,tsx}",
      "**/*.{scss,css}",
      "build/**",
      "node_modules/**",
      "public/**",
      "dist/**",
    ],
  },

  // Base ESLint recommended (tương đương "eslint:recommended")
  js.configs.recommended,

  // Sử dụng compat để convert configs cũ sang flat config
  ...compat.extends(
    "plugin:react/recommended",
    "plugin:import/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react-hooks/recommended"
  ),

  // TypeScript recommended (tương đương "plugin:@typescript-eslint/recommended")
  ...tseslint.configs.recommended,

  // Global configuration
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.node,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        node: {
          paths: ["src"],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  },

  // Custom rules từ config cũ
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Rules từ config cũ
      "no-console": "warn",
      "no-debugger": "error",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-no-target-blank": "off",
      "react/prop-types": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "import/no-unresolved": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "no-unused-vars": "off",
    },
  },

  // Override cho TypeScript files (tương đương overrides trong config cũ)
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-undef": "off", // TypeScript handles this
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: {
          paths: ["src"],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  },

  // Prettier config (tương đương "eslint-config-prettier") - phải đặt cuối cùng
  ...compat.extends("eslint-config-prettier"),
]);
