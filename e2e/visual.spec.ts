import { expect, test } from '@playwright/test';

// Element screenshots, so one change fails one test. Baselines are Linux renders made in
// Playwright's Docker image (npm run test:visual -- --update-snapshots), matching CI.
test.skip(process.platform !== 'linux', 'Baselines are Linux renders: run `npm run test:visual`');

test.beforeEach(async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('header', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('.site-header')).toHaveScreenshot('header.png');
});

test('footer', async ({ page }) => {
	await page.goto('/about');
	await expect(page.locator('.site-footer')).toHaveScreenshot('footer.png');
});

// The booth is taller than a phone screen; a tall viewport keeps the pinned film from
// sliding across it while the screenshot scrolls
test('booth, Projector tab', async ({ page }) => {
	await page.setViewportSize({ width: page.viewportSize()!.width, height: 2400 });
	await page.goto('/');
	await expect(page.locator('#pane-projector')).toHaveScreenshot('booth-projector.png');
});

test('booth, Film tab', async ({ page }) => {
	await page.setViewportSize({ width: page.viewportSize()!.width, height: 2400 });
	await page.goto('/');
	await page.getByRole('tab', { name: 'Film' }).click();
	await expect(page.locator('#pane-film')).toHaveScreenshot('booth-film.png');
});

test('transport', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('#transport')).toHaveScreenshot('transport.png');
});
