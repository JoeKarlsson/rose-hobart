import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PORT ?? 4323);

// Tests run against the built site, so the CSP meta and bundled assets are what ships
export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? 'github' : 'list',
	snapshotPathTemplate: '{testDir}/__screenshots__/{arg}-{projectName}{ext}',
	expect: {
		toHaveScreenshot: { animations: 'disabled', maxDiffPixelRatio: 0.01 },
	},
	use: {
		baseURL: `http://localhost:${port}`,
		trace: 'on-first-retry',
	},
	projects: [
		{ name: 'desktop', use: { ...devices['Desktop Chrome'] } },
		// The metadata checks and the link crawl read files, so they only need to run once
		{ name: 'iphone', use: { ...devices['iPhone 15'] }, testIgnore: /metadata|links/ },
		{ name: 'pixel', use: { ...devices['Pixel 7'] }, testIgnore: /metadata|links/ },
	],
	webServer: {
		// --ignore-lock keeps it in the foreground: Astro 7 backgrounds the server when it detects a coding agent
		command: `npm run build && npx astro preview --port ${port} --ignore-lock`,
		url: `http://localhost:${port}`,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});
