import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.{js,mjs}'],
    setupFiles: ['./tests/helpers/setup.js'],
    globals: false,
    reporters: ['default']
  }
});
