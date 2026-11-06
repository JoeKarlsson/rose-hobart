// Plausible (self-hosted), skipped for bots and test browsers. Also reports the first
// uncaught error on a page, so breakage on the live site shows up there.
// This is Plausible's install snippet moved into a file, since the CSP allows no inline scripts.

type Plausible = ((event: string, options?: { props?: Record<string, string> }) => void) & {
	q?: unknown[];
	o?: object;
	init?: (options?: object) => void;
};

declare global {
	interface Window {
		plausible?: Plausible;
	}
}

const isBot =
	navigator.webdriver ||
	/bot|crawl|spider|scrape|headless|lighthouse/i.test(navigator.userAgent) ||
	!navigator.languages?.length;

if (!isBot) {
	// Queue calls made before the script arrives; the script replays them
	const plausible: Plausible =
		window.plausible ||
		function (...args) {
			(plausible.q = plausible.q || []).push(args);
		};
	plausible.init =
		plausible.init ||
		function (options) {
			plausible.o = options || {};
		};
	window.plausible = plausible;
	plausible.init();

	const script = document.createElement('script');
	script.async = true;
	script.src = 'https://plausible.joekarlsson.io/js/pa-np9XlHPacHLxCEXjnVN_s.js';
	document.head.appendChild(script);

	let reported = false;
	const report = (message: unknown, source: string) => {
		if (reported) return;
		reported = true;
		plausible('JS Error', { props: { message: String(message).slice(0, 200), source, path: location.pathname } });
	};
	addEventListener('error', (e) => report(e.message, `${e.filename}:${e.lineno}`));
	addEventListener('unhandledrejection', (e) => report(e.reason, 'promise'));
}

/** Send a custom event; does nothing for bots and test browsers */
export function track(event: string, props?: Record<string, string>): void {
	window.plausible?.(event, props ? { props } : undefined);
}
