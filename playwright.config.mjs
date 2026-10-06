import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 30000,
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4531',
    headless: true,
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium',
      args: ['--no-sandbox'],
    },
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --port 4531 --ignore-lock',
    url: 'http://127.0.0.1:4531',
    reuseExistingServer: false,
    timeout: 30000,
  },
  projects: [{ name: 'chromium' }],
});
