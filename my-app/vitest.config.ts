import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      // `server-only` throws outside a React Server environment.
      "server-only": fileURLToPath(
        new URL("./tests/unit/stubs/server-only.ts", import.meta.url),
      ),
    },
  },
  test: {
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    // Default to Node for lib tests; DOM component tests opt in to jsdom with
    // a `// @vitest-environment jsdom` docblock (see tests/unit/components).
    environment: "node",
    setupFiles: ["./tests/unit/setup.ts"],
    coverage: {
      include: ["lib/**"],
    },
  },
});
