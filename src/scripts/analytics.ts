// Plausible (self-hosted), skipped for bots and test browsers. Also reports the first
// uncaught error on a page, so breakage on the live site shows up there.

declare global {
	interface Window {
		plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
	}
}

const isBot =
	navigator.webdriver ||
	/bot|crawl|spider|scrape|headless|lighthouse/i.test(navigator.userAgent) ||
	!navigator.languages?.length;

if (!isBot) {
	const script = document.createElement('script');
	script.defer = true;
	script.dataset.domain = 'rosehobart.joekarlsson.com';
	script.src = 'https://plausible.joekarlsson.io/js/script.tagged-events.outbound-links.js';
	document.head.appendChild(script);

	let reported = false;
	const report = (message: unknown, source: string) => {
		if (reported || typeof window.plausible !== 'function') return;
		reported = true;
		window.plausible('JS Error', { props: { message: String(message).slice(0, 200), source, path: location.pathname } });
	};
	addEventListener('error', (e) => report(e.message, `${e.filename}:${e.lineno}`));
	addEventListener('unhandledrejection', (e) => report(e.reason, 'promise'));
}

/** Send a custom event; does nothing when Plausible isn't loaded */
export function track(event: string, props?: Record<string, string>): void {
	window.plausible?.(event, props ? { props } : undefined);
}
