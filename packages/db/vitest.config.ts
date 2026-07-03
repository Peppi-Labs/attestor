import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Load packages/db/.env (DATABASE_URL + APP_DATABASE_URL) before tests.
    setupFiles: ["dotenv/config"],
    // RLS tests share one Postgres — run serially to avoid cross-test interference.
    fileParallelism: false,
    hookTimeout: 20000,
  },
});
