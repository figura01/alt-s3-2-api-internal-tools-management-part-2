import { defineConfig, devices } from '@playwright/test';

const database = process.env.E2E_DATABASE_URL;
if (!database || !new URL(database).pathname.endsWith('_e2e')) {
  throw new Error('E2E_DATABASE_URL must name a dedicated database ending in _e2e');
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://localhost:3100', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'npx prisma migrate deploy && node scripts/seed-e2e.cjs && npm run build && node dist/src/main',
      cwd: '../backend',
      url: 'http://localhost:3101/api/docs',
      timeout: 120_000,
      reuseExistingServer: false,
      env: { DATABASE_URL: database, PORT: '3101', FRONTEND_ORIGIN: 'http://localhost:3100', JWT_SECRET: 'e2e-only-secret', JWT_EXPIRES_IN: '15m', NODE_ENV: 'test' },
    },
    {
      command: 'npm run build && npm run start -- --port 3100',
      url: 'http://localhost:3100/login',
      timeout: 180_000,
      reuseExistingServer: false,
      env: { NEXT_PUBLIC_BASE_URL: 'http://localhost:3100', NEXT_PUBLIC_APP_NAME: 'TechCorp', NEXT_PUBLIC_APP_DESCRIPTION: 'Internal tools management', NEXT_PUBLIC_API_URL: 'http://localhost:3101/api', API_URL: 'http://localhost:3101/api', NEXT_TELEMETRY_DISABLED: '1' },
    },
  ],
});
