import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });
});

test('the projector starts on first touch and paints the poster frame', async ({ page }) => {
	await expect(page.locator('#stage')).not.toHaveClass(/is-projecting/);
	await page.click('[data-preset="pink"]');
	await expect(page.locator('#stage')).toHaveClass(/is-projecting/);
});

test('play runs the film and the curtains part', async ({ page }, testInfo) => {
	test.skip(testInfo.project.name === 'iphone', 'Playwright WebKit builds have no H.264 decoder');
	await page.click('#play');
	await expect(page.locator('#play')).toHaveText('Pause');
	await expect(page.locator('#stage')).toHaveClass(/is-playing/);
	await expect.poll(() => page.locator('#film').evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0.5);
});

test('programs set the panel and mark themselves', async ({ page }) => {
	await page.click('[data-preset="cornell"]');
	await expect(page.locator('[data-preset="cornell"]')).toHaveAttribute('aria-pressed', 'true');
	await expect(page.locator('[data-gel="blue"]')).toHaveAttribute('aria-pressed', 'true');
	await expect(page.locator('#fx-printColor')).toHaveValue('0');
	await page.locator('#fx-grain').fill('0.9');
	await expect(page.locator('[data-preset="cornell"]')).toHaveAttribute('aria-pressed', 'false');
	await page.click('#reset');
	await expect(page.locator('[data-gel="none"]')).toHaveAttribute('aria-pressed', 'true');
});

test('speed detents set the projector rate', async ({ page }) => {
	await page.getByRole('button', { name: 'Sound speed, 24 fps' }).click();
	await expect(page.locator('#speed-value')).toHaveText('1.50×');
	expect(await page.locator('#film').evaluate((v: HTMLVideoElement) => v.playbackRate)).toBe(1.5);
});

test('theater mode fills the window and Escape leaves it', async ({ page }) => {
	await page.click('#theater');
	await expect(page.locator('html')).toHaveClass(/theater/);
	await expect(page.locator('.site-header')).toBeHidden();
	await page.click('#controls-toggle');
	await expect(page.locator('#panel')).toBeVisible();
	await page.click('#controls-close');
	await expect(page.locator('#panel')).toBeHidden();
	await page.keyboard.press('Escape');
	await expect(page.locator('html')).not.toHaveClass(/theater/);
});

test('choosing a record mutes the film soundtrack', async ({ page }) => {
	await page.getByLabel(/Song of India/).check();
	await expect(page.locator('#now-playing')).toContainText('Song of India');
	expect(await page.locator('#film').evaluate((v: HTMLVideoElement) => v.muted)).toBe(true);
});

test('keyboard shortcuts list opens with ?', async ({ page }) => {
	await page.keyboard.press('?');
	await expect(page.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeVisible();
});

test.describe('reduced motion', () => {
	test.use({ reducedMotion: 'reduce' });

	test('programs start with moving effects off and say so', async ({ page }) => {
		await page.click('[data-preset="broken"]');
		await expect(page.locator('#fx-flicker')).toHaveValue('0');
		await expect(page.locator('#fx-vignette')).toHaveValue('0.5');
		await expect(page.locator('#effects-note')).toContainText('reduced motion');
	});
});
