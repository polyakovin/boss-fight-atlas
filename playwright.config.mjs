import { defineConfig } from '@playwright/test';
const testPort = Number(process.env.ATLAS_TEST_PORT ?? 4173);
if (!Number.isInteger(testPort) || testPort < 1024 || testPort > 65535)
  throw new Error('ATLAS_TEST_PORT must be a valid non-privileged TCP port');
const baseURL = `http://127.0.0.1:${testPort}/boss-fight-atlas/`;
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  use: {
    baseURL,
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : {},
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `PORT=${testPort} node scripts/serve.mjs`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
