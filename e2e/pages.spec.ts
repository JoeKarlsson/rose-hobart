import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const PAGES = [
	{ path: '/', name: 'theater' },
	{ path: '/about', name: 'about' },
	{ path: '/no-such-reel', name: '404' },
];

function collectProblems(page: Page, expectNotFound: boolean): string[] {
	const problems: string[] = [];
	page.on('pageerror', (error) => problems.push(`error: ${error.message}`));
	page.on('console', (message) => {
		// The 404 page is served with a 404 status, which the browser logs
		if (expectNotFound && message.text().includes('status of 404') && message.location().url.endsWith('/no-such-reel')) return;
		if (message.type() === 'error') problems.push(`console: ${message.text()}`);
	});
	page.on('requestfailed', (request) => {
		// Browsers cancel media range requests as they seek; that isn't a failure
		if (request.resourceType() === 'media' && request.failure()?.errorText.match(/ABORTED|cancelled/i)) return;
		problems.push(`request failed: ${request.url()}`);
	});
	return problems;
}

for (const { path, name } of PAGES) {
	test(`${name} loads with no errors, CSP violations or failed requests`, async ({ page }) => {
		const problems = collectProblems(page, name === '404');
		await page.goto(path, { waitUntil: 'networkidle' });
		await expect(page.locator('h1')).toHaveCount(1);
		expect(problems).toEqual([]);
	});

	test(`${name} has no axe violations`, async ({ page }) => {
		await page.goto(path, { waitUntil: 'networkidle' });
		const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
		expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
	});

	for (const width of [390, 320]) {
		test(`${name} has no sideways scroll at ${width}px`, async ({ page }) => {
			await page.setViewportSize({ width, height: 800 });
			await page.goto(path, { waitUntil: 'networkidle' });
			expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
		});
	}
}

test('nav links lead to the pages they name, and the labels match their headings', async ({ page }) => {
	await page.goto('/');
	const nav = page.getByRole('navigation', { name: 'Site' });
	await nav.getByRole('link', { name: 'Supporting statement' }).click();
	await expect(page).toHaveURL(/\/about$/);
	await expect(page.locator('h1')).toHaveText('Supporting statement');
	await nav.getByRole('link', { name: 'The film' }).click();
	await expect(page).toHaveURL(/\/$/);
});
