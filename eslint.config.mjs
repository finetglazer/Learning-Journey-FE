import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
    plugins: ["unused-imports"],
    "rules": {
      "@typescript-eslint/no-empty-object-type": "off",
      // Disables errors for using the 'any' type
      "@typescript-eslint/no-explicit-any": "off",
      // Enable the unused-imports rule for auto-fixing
      "unused-imports/no-unused-imports": "error",
      // Disables warnings about missing dependencies in React Hooks
      "react-hooks/exhaustive-deps": "off",
      // Disables warnings for unused variables
      "@typescript-eslint/no-unused-vars": "warn", // Or "off" to completely disable
      // Disables errors for passing children as a prop
      "react/no-children-prop": "off"
    },
  })
];

export default eslintConfig;
