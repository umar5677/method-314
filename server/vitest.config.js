import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    workspace: [
      "packages/*",
      "tests/*/vitest.config.{e2e,unit}.js",
      {
        test: {
          name: "Server Unit Tests",
          root: "./tests",
          environment: "node",
        },
      },
    ],
  },
});
