import { defineConfig, devices } from "@playwright/test"

// E2E runs against a local portfolio-app on :3010. Point it at any
// vizualgraphics instance with E2E_API_URL (default: local dev on :3000).
const PORT = 3010
const API_URL = process.env.E2E_API_URL ?? "http://localhost:3000"

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "line",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "tablet",
      use: { ...devices["Desktop Chrome"], viewport: { width: 820, height: 1180 } },
    },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `NEXT_PUBLIC_API_URL=${API_URL} pnpm exec next dev -p ${PORT}`,
    url: `http://localhost:${PORT}/portfolio`,
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000,
  },
})
