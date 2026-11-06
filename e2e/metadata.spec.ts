import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// Reads the built HTML directly, so it covers every page, not a sample
const dist = new URL('../dist/', import.meta.url);
const pages = readdirSync(dist)
	.filter((f) => f.endsWith('.html'))
	.map((file) => ({ file, html: readFileSync(new URL(file, dist), 'utf8') }));

const meta = (html: string, attr: string, name: string) =>
	html.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`))?.[1];

test.describe('metadata', () => {
	for (const { file, html } of pages) {
		test(`${file} has complete head metadata`, () => {
			expect(html).toMatch(/<title>[^<]+<\/title>/);
			const description = meta(html, 'name', 'description');
			expect(description?.length ?? 0).toBeGreaterThan(40);
			expect(description!.length).toBeLessThanOrEqual(160);
			expect(meta(html, 'name', 'color-scheme')).toBe('only dark');
			expect(html).toContain('<meta name="darkreader-lock">');
			expect(html).toContain('http-equiv="Content-Security-Policy"');
			expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
			const image = meta(html, 'property', 'og:image')!;
			expect(existsSync(new URL(new URL(image).pathname.slice(1), dist))).toBe(true);
			if (file === '404.html') expect(html).toContain('<meta name="robots" content="noindex">');
			else expect(html).toMatch(/<link rel="canonical" href="https:\/\/rosehobart\.joekarlsson\.com/);
		});
	}

	test('titles and descriptions are unique across indexable pages', () => {
		const indexable = pages.filter((p) => !p.html.includes('noindex'));
		const titles = indexable.map((p) => p.html.match(/<title>([^<]+)/)![1]);
		const descriptions = indexable.map((p) => meta(p.html, 'name', 'description'));
		expect(new Set(titles).size).toBe(titles.length);
		expect(new Set(descriptions).size).toBe(descriptions.length);
	});

	test('the sitemap lists exactly the indexable pages', () => {
		const sitemap = readFileSync(new URL('sitemap-0.xml', dist), 'utf8');
		const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
		const canonicals = pages
			.filter((p) => !p.html.includes('noindex'))
			.map((p) => p.html.match(/<link rel="canonical" href="([^"]+)"/)![1])
			.sort();
		expect(listed).toEqual(canonicals);
	});

	test('security.txt has not expired', () => {
		const text = readFileSync(new URL('.well-known/security.txt', dist), 'utf8');
		const expires = new Date(text.match(/^Expires: (.+)$/m)![1]);
		expect(expires.getTime()).toBeGreaterThan(Date.now() + 30 * 24 * 3600 * 1000);
	});
});
