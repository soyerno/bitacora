import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: [{ find: /^@\//, replacement: root + "/" }],
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.{js,mjs}"],
    globals: false,
  },
});
