import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.js',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  timeout: 45000,
  expect: { timeout: 12000 },
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 10000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // --- Dev server (frontend only) -------------------------------------------
  // Playwright starts the Vite dev server for us. With reuseExistingServer,
  // if you have already run `npm run dev` yourself it is reused (no duplicate).
  // NOTE: This only covers the FRONTEND. The Laravel API backend (:8000) and
  // MariaDB are NOT started here and MUST be running separately, e.g.:
  //     cd ../backend && php artisan migrate --seed
  //     php artisan serve --host=127.0.0.1 --port=8000
  // Vite proxies /api, /sanctum, /admin/* to that backend in dev, so the E2E
  // specs that hit /api/* will work once the backend is up and seeded.
  //
  // This config lives in the frontend project, so the webServer command runs
  // from here: use a plain `npm run dev` (NOT `npm --prefix frontend`, which
  // would resolve to frontend/frontend and ENOENT, leaving the server down and
  // every /api request timing out).
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
