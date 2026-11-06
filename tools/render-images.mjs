// Renders the PNG icons and the share card from public/favicon.svg and a film still.
// Run after changing either: node tools/render-images.mjs
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const publicDir = new URL('../public/', import.meta.url);
const svg = readFileSync(new URL('favicon.svg', publicDir), 'utf8');
const toDataUrl = (file, type) => `data:${type};base64,${readFileSync(new URL(file, publicDir)).toString('base64')}`;

const browser = await chromium.launch();
const page = await browser.newPage();

for (const [name, size] of [['favicon-32x32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
	await page.setViewportSize({ width: size, height: size });
	await page.setContent(`<style>*{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
	await page.screenshot({ path: new URL(name, publicDir).pathname });
}

const font = toDataUrl('fonts/limelight-latin.woff2', 'font/woff2');
const text = toDataUrl('fonts/jost-latin.woff2', 'font/woff2');
const still = toDataUrl('media/poster.webp', 'image/webp');
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(`<style>
	@font-face { font-family: Limelight; src: url(${font}); }
	@font-face { font-family: Jost; src: url(${text}); }
	* { margin: 0; box-sizing: border-box; }
	body { width: 1200px; height: 630px; background: #0b0907; display: flex; color: #dcb75e; }
	img { width: 630px; height: 630px; object-fit: cover; object-position: 40% center; }
	div { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 48px; border-left: 8px double #dcb75e; }
	h1 { font: 92px/1 Limelight; text-transform: uppercase; }
	p { font: 34px/1.3 Jost; color: #f1e8d4; margin-top: 28px; }
</style><img src="${still}"><div><h1>Rose Hobart</h1><p>Joseph Cornell, 1936. Pick the gel, the speed and the record.</p></div>`);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: new URL('og.png', publicDir).pathname });

await browser.close();
console.log('Rendered icons and og.png');
