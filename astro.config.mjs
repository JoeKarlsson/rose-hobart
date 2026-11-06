// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://rosehobart.joekarlsson.com',
	trailingSlash: 'never',
	build: {
		format: 'file',
		// The CSP meta allows styles and scripts from 'self' only, so nothing may be inlined
		inlineStylesheets: 'never',
	},
	devToolbar: { enabled: false },
	integrations: [sitemap({ filter: (page) => !page.endsWith('/404') })],
	vite: {
		build: { assetsInlineLimit: 0 },
	},
});
