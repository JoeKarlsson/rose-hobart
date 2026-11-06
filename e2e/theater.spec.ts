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
	await expect(page.locator('#master-age-value')).not.toHaveText('Fresh print');
	await page.getByRole('tab', { name: 'Film' }).click();
	await page.locator('#fx-grain').fill('0.9');
	await expect(page.locator('[data-preset="cornell"]')).toHaveAttribute('aria-pressed', 'false');
	await page.getByRole('tab', { name: 'Projector' }).click();
	await page.click('#reset');
	await expect(page.locator('[data-gel="none"]')).toHaveAttribute('aria-pressed', 'true');
});

test('speed detents set the projector rate', async ({ page }) => {
	await page.getByRole('button', { name: 'Sound speed, 24 fps' }).click();
	await expect(page.locator('#speed-value')).toHaveText('1.50×');
	expect(await page.locator('#film').evaluate((v: HTMLVideoElement) => v.playbackRate)).toBe(1.5);
});

test('the film stays in view while the controls scroll', async ({ page }) => {
	await page.locator('#volume').scrollIntoViewIfNeeded();
	await expect(page.locator('.screen')).toBeInViewport({ ratio: 0.97 });
	await expect(page.locator('#volume')).toBeInViewport();
});

test('theater mode widens the film and keeps the controls below', async ({ page }, testInfo) => {
	test.skip(testInfo.project.name !== 'desktop', 'Phones already show the film full width');
	const before = (await page.locator('.screen').boundingBox())!.width;
	await page.click('#theater');
	await expect(page.locator('html')).toHaveClass(/theater/);
	await expect(page.locator('.site-header')).toBeVisible();
	await expect(page.locator('#panel')).toBeVisible();
	expect((await page.locator('.screen').boundingBox())!.width).toBeGreaterThan(before);
	await page.keyboard.press('Escape');
	await expect(page.locator('html')).not.toHaveClass(/theater/);
});

test('full screen fills the display with the controls in a drawer', async ({ page }) => {
	await page.click('#fullscreen');
	await expect(page.locator('html')).toHaveClass(/immersive/);
	await expect(page.locator('.site-header')).toBeHidden();
	await expect(page.locator('#panel')).toBeHidden();
	await page.click('#controls-toggle');
	await expect(page.locator('#panel')).toBeVisible();
	await page.click('#controls-close');
	await expect(page.locator('#panel')).toBeHidden();
	await page.click('#fullscreen');
	await expect(page.locator('html')).not.toHaveClass(/immersive/);
});

test('choosing a record mutes the film soundtrack', async ({ page }) => {
	await page.getByLabel('Choose the music').selectOption('song-of-india');
	await expect(page.locator('#now-title')).toHaveText('Song of India');
	expect(await page.locator('#film').evaluate((v: HTMLVideoElement) => v.muted)).toBe(true);
	await page.getByRole('button', { name: 'Next record' }).click();
	await expect(page.locator('#now-title')).toHaveText('La Paloma');
	await expect(page.getByLabel('Choose the music')).toHaveValue('la-paloma');
});

test('picking a gel strips the baked-in blue so the gel shows true', async ({ page }) => {
	await page.getByRole('button', { name: 'Pink', exact: true }).click();
	await expect(page.getByRole('button', { name: 'Pink', exact: true })).toHaveAttribute('aria-pressed', 'true');
	await expect(page.locator('#fx-printColor')).toHaveValue('0');
});

test('the Age dial moves the film sliders together', async ({ page }) => {
	await page.locator('#master-age').fill('1');
	await expect(page.locator('#master-age-value')).toHaveText('Nitrate rot');
	await page.getByRole('tab', { name: 'Film' }).click();
	await expect(page.locator('#fx-grain')).toHaveValue('0.6');
	await expect(page.locator('#fx-dust')).toHaveValue('0.85');
	await expect(page.locator('[data-preset="circulated"]')).toHaveAttribute('aria-pressed', 'false');
});

test('booth tabs follow the arrow keys and show one section at a time', async ({ page }) => {
	await page.getByRole('tab', { name: 'Projector' }).focus();
	await page.keyboard.press('ArrowRight');
	await expect(page.getByRole('tab', { name: 'Print' })).toBeFocused();
	await expect(page.getByRole('tabpanel', { name: 'Print' })).toBeVisible();
	await expect(page.locator('#pane-projector')).toBeHidden();
	await page.keyboard.press('End');
	await expect(page.getByRole('tabpanel', { name: 'Glitch' })).toBeVisible();
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
		await expect(page.locator('#fx-grain')).toHaveValue('0');
		await expect(page.locator('#fx-vignette')).toHaveValue('0.5');
		await expect(page.locator('#effects-note')).toContainText('reduced motion');
	});
});
