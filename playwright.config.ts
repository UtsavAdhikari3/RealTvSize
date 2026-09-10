import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
	testDir: './tests', fullyParallel: true, workers: 3,
	use: { baseURL: 'http://localhost:4321', ...devices['Desktop Chrome'], reducedMotion: 'reduce', trace: 'retain-on-failure' },
	projects: [{ name: 'chromium' }],
});
