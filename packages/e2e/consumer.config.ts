import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  testDir: './consumer-tests',
  webServer: {
    command: 'node scripts/serve.mjs',
    cwd: fileURLToPath(new URL('../../', import.meta.url)),
    env: { PORT: '3101', CSL_SERVE_DIR: 'packages/consumer/dist' },
    url: 'http://127.0.0.1:3101',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: process.env.CSL_CONSUMER_URL ?? 'http://127.0.0.1:3101',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
