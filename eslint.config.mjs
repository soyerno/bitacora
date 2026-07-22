import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

// Setup canónico de Next.js 16 (node_modules/next/dist/docs/.../03-eslint.md).
// Reemplaza al `next lint` removido en Next 16.
const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
