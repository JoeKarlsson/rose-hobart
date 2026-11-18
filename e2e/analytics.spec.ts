import { expect, test, type Page } from '@playwright/test';

// Playwright counts as a bot, so analytics.ts never loads Plausible. Record what track() sends instead.
test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => {
		const events: [string, unknown][] = [];
		Object.assign(window, { plausibleEvents: events });
		window.plausible = (name: string, options?: { props?: Record<string, string> }) => events.push([name, options?.props ?? null]);
	});
});
const eventNames = (page: Page) => page.evaluate(() => (window as unknown as { plausibleEvents: [string][] }).plausibleEvents.map(([name]) => name));

test('Full Screen is sent only when the browser grants it', async ({ page }, testInfo) => {
	test.skip(testInfo.project.name !== 'desktop', 'One browser is enough for the event wiring');
	await page.goto('/');
	await page.evaluate(() => {
		document.getElementById('stage')!.requestFullscreen = () => Promise.reject(new TypeError('Permissions check failed'));
	});
	await page.click('#fullscreen');
	await expect(page.locator('html')).toHaveClass(/immersive/);
	expect(await eventNames(page)).not.toContain('Full Screen');

	await page.reload();
	await page.evaluate(() => {
		document.getElementById('stage')!.requestFullscreen = () => Promise.resolve();
	});
	await page.click('#fullscreen');
	await expect.poll(() => eventNames(page)).toContain('Full Screen');
});

test('Watched To End is sent with the program when the film ends', async ({ page }, testInfo) => {
	test.skip(testInfo.project.name !== 'desktop', 'One browser is enough for the event wiring');
	await page.goto('/');
	await page.click('[data-preset="cornell"]');
	await page.locator('#film').dispatchEvent('ended');
	const events = await page.evaluate(() => (window as unknown as { plausibleEvents: unknown[] }).plausibleEvents);
	expect(events).toContainEqual(['Watched To End', { program: 'cornell' }]);
});
