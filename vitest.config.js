import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // Alias `@/...` → raíz del repo (igual que tsconfig paths), para que los
  // tests de unidad importen `@/lib/*`. Regex `^@/` para NO pisar paquetes
  // con scope como `@vercel/analytics`.
  resolve: {
    alias: [{ find: /^@\//, replacement: root + '/' }],
  },
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.{js,mjs}'],
    setupFiles: ['./tests/helpers/setup.js'],
    globals: false,
    reporters: ['default']
  }
});
