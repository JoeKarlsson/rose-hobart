import { readdirSync, readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// A link checker over the built HTML: every internal link and asset must load, and every
// external link must answer. Share intents are skipped (they send you to a login page).
const dist = new URL('../dist/', import.meta.url);
const html = readdirSync(dist)
	.filter((f) => f.endsWith('.html'))
	.map((f) => readFileSync(new URL(f, dist), 'utf8'))
	.join('\n');
const urls = [...new Set([...html.matchAll(/(?:href|src|srcset|poster)="([^"]+)"/g)].flatMap((m) => m[1].split(', ').map((u) => u.split(' ')[0])))];
const SHARE_INTENTS = /bsky\.app\/intent|threads\.net\/intent|linkedin\.com\/sharing|reddit\.com\/submit|ycombinator\.com\/submitlink|x\.com\/intent/;

test.describe('links', () => {
	test('every internal link and asset loads', async ({ request }) => {
		const internal = urls.filter((u) => u.startsWith('/') && !u.startsWith('//'));
		expect(internal.length).toBeGreaterThan(10);
		for (const url of internal) {
			const response = await request.get(url);
			expect(response.status(), url).toBe(200);
		}
	});

	test('every external link answers', async ({ request }) => {
		test.setTimeout(120_000);
		const external = urls.filter((u) => u.startsWith('https://') && !SHARE_INTENTS.test(u) && !u.includes('rosehobart.joekarlsson.com'));
		const broken: string[] = [];
		for (const url of external) {
			const response = await request.get(url, { timeout: 20_000, maxRedirects: 5 }).catch((error: Error) => error);
			if (response instanceof Error) broken.push(`${url}: ${response.message.split('\n')[0]}`);
			else if (response.status() >= 400) broken.push(`${url}: ${response.status()}`);
		}
		expect(broken).toEqual([]);
	});
});
