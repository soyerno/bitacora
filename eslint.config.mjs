import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

// Setup canónico de Next.js 16 (node_modules/next/dist/docs/.../03-eslint.md).
// Reemplaza al `next lint` removido en Next 16.
const eslintConfig = defineConfig([
  ...nextVitals,
  // coaching-app/ es una app independiente (deploy propio en Vercel) con su
  // propio tooling; el lint/typecheck de la bitácora no la cubre.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "coaching-app/**"]),
]);

export default eslintConfig;
