import { expect, test } from '@playwright/test';

test('share links carry the page URL and title', async ({ page }) => {
	await page.goto('/about');
	const share = page.locator('.share');
	for (const name of ['Bluesky', 'Threads', 'LinkedIn', 'Reddit', 'Hacker News', 'X']) {
		const href = await share.getByRole('link', { name, exact: true }).getAttribute('href');
		expect(href, name).toContain(encodeURIComponent('https://rosehobart.joekarlsson.com/about'));
	}
});

test('copy link puts the canonical URL on the clipboard', async ({ page, context }, testInfo) => {
	test.skip(testInfo.project.name === 'iphone', 'WebKit in Playwright does not grant clipboard access');
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	await page.goto('/');
	await page.getByRole('button', { name: 'Copy link' }).click();
	await expect(page.locator('.share-status')).toHaveText('Link copied.');
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('https://rosehobart.joekarlsson.com/');
});

test('the 404 page has no share links', async ({ page }) => {
	await page.goto('/no-such-reel');
	await expect(page.locator('.share')).toHaveCount(0);
});
