import { track } from './analytics';

// "Copy link" in the footer. Each share network is an ordinary link; Plausible counts
// those as outbound clicks.
for (const button of document.querySelectorAll<HTMLButtonElement>('[data-copy-link]')) {
	const status = button.closest('.share')?.querySelector<HTMLElement>('.share-status');
	button.addEventListener('click', () => {
		navigator.clipboard
			.writeText(button.dataset.copyLink!)
			.then(() => {
				if (status) status.textContent = 'Link copied.';
				track('Share', { network: 'copy link' });
			})
			.catch((error: Error) => {
				if (status) status.textContent = `Couldn't copy the link (${error.message}). Copy it from the address bar instead.`;
			});
	});
}
