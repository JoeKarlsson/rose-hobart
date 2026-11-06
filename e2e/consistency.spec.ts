import { expect, test } from '@playwright/test';

// Every page shares one header: same marquee size, same nav position, same rule under it
const PAGES = ['/', '/about', '/no-such-reel'];

test('every page has the same header and nav position', async ({ page }) => {
	const measures = [];
	for (const path of PAGES) {
		await page.goto(path);
		measures.push(
			await page.evaluate(() => {
				const box = (selector: string) => {
					const r = document.querySelector(selector)!.getBoundingClientRect();
					return [Math.round(r.top), Math.round(r.left), Math.round(r.width), Math.round(r.height)];
				};
				return {
					header: box('.site-header'),
					nav: box('.site-header nav'),
					marqueeSize: getComputedStyle(document.querySelector('.marquee-title')!).fontSize,
				};
			}),
		);
	}
	for (const measure of measures.slice(1)) expect(measure).toEqual(measures[0]);
});
