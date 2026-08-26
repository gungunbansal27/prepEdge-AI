import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.js"],
  },
  resolve: {
    alias: {
      "@prepedge/shared": path.resolve(__dirname, "../../packages/shared/src/index.js"),
    },
  },
});

