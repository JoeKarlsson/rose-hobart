import { track } from '../scripts/analytics';
import {
	EFFECTS,
	PRESETS,
	applyPreset,
	flickerGain,
	formatEffect,
	formatSpeed,
	gelColor,
	hexToRgb,
	initialSettings,
	nextTearDelay,
	snapSpeed,
	type EffectKey,
	type Settings,
} from './effects';
import { FilmRenderer, type FrameUniforms } from './renderer';
import { Soundtrack } from './soundtrack';
import { SILENCE_ID } from './tracks';

const PROJECTED_FPS = 16;
const IDLE_MS = 3000;
const SEEK_SECONDS = 10;
const MAX_PIXEL_RATIO = 2;

function byId<T extends HTMLElement>(id: string): T {
	const element = document.getElementById(id);
	if (!element) throw new Error(`Missing #${id}`);
	return element as T;
}

const root = document.documentElement;
const stage = byId<HTMLDivElement>('stage');
const video = byId<HTMLVideoElement>('film');
const canvas = byId<HTMLCanvasElement>('projection');
const playButton = byId<HTMLButtonElement>('play');
const scrub = byId<HTMLInputElement>('scrub');
const timeOutput = byId<HTMLOutputElement>('time');
const theaterButton = byId<HTMLButtonElement>('theater');
const fullscreenButton = byId<HTMLButtonElement>('fullscreen');
const controlsToggle = byId<HTMLButtonElement>('controls-toggle');
const speedInput = byId<HTMLInputElement>('speed');
const speedOutput = byId<HTMLOutputElement>('speed-value');
const customGel = byId<HTMLInputElement>('gel-custom');
const volumeInput = byId<HTMLInputElement>('volume');
const volumeOutput = byId<HTMLOutputElement>('volume-value');
const nowPlaying = byId<HTMLParagraphElement>('now-playing');
const effectsNote = byId<HTMLParagraphElement>('effects-note');
const help = byId<HTMLDialogElement>('help');

// Swatch colors come from the gel table, set through the CSSOM (the CSP blocks style attributes)
for (const button of document.querySelectorAll<HTMLButtonElement>('[data-gel]')) {
	const swatch = button.querySelector<HTMLElement>('.gel-swatch');
	if (swatch && button.dataset.color) swatch.style.backgroundColor = button.dataset.color;
}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let settings: Settings = initialSettings();

// ---- Picture -------------------------------------------------------------

const poster = new Image();
poster.src = video.poster;

// The poster on the <video> is the first paint. The projector (shader compile and all)
// starts on the viewer's first touch of the page, so none of it blocks loading.
let renderer: FilmRenderer | null = null;
let projectorStarted = false;
let canvasSize: [number, number] = [0, 0];

function startProjector(): void {
	if (projectorStarted) return;
	projectorStarted = true;
	try {
		renderer = new FilmRenderer(canvas);
		renderer.resize(...canvasSize);
		requestFrame();
	} catch (error) {
		showNoWebgl(error as Error);
	}
}

for (const type of ['pointerdown', 'keydown', 'focusin'] as const) {
	document.addEventListener(type, startProjector, { once: true, capture: true });
}

function showNoWebgl(error: Error): void {
	// Without WebGL2 the plain film still plays with the browser's own controls
	stage.classList.add('no-webgl');
	video.controls = true;
	effectsNote.hidden = false;
	effectsNote.textContent = `This browser can't run the projector effects (${error.message}), so the film plays as circulated. Speed and music still work.`;
	for (const input of document.querySelectorAll<HTMLInputElement>('[data-effect], #gel-custom')) input.disabled = true;
	for (const button of document.querySelectorAll<HTMLButtonElement>('[data-gel], [data-preset]')) button.disabled = true;
}

new ResizeObserver(([entry]) => {
	const box = entry.devicePixelContentBoxSize?.[0];
	const ratio = Math.min(devicePixelRatio, MAX_PIXEL_RATIO);
	const width = box ? box.inlineSize : entry.contentRect.width * devicePixelRatio;
	const height = box ? box.blockSize : entry.contentRect.height * devicePixelRatio;
	const scale = ratio / devicePixelRatio;
	canvasSize = [Math.max(1, Math.round(width * scale)), Math.max(1, Math.round(height * scale))];
	renderer?.resize(...canvasSize);
	requestFrame();
}).observe(canvas);

// Motion state the shader can't keep itself: flicker, gate weave and tears
let nextTearAt = 0;
let tearUntil = 0;
let tear: [number, number, number] = [0, 0, 0];
let smoothNoise = 0;

function uniforms(now: number): FrameUniforms {
	const s = settings;
	const t = now / 1000;
	const filmFrame = Math.floor(video.currentTime * PROJECTED_FPS);
	const seed = (filmFrame % 997) + (video.paused ? 0 : (Math.floor(t * PROJECTED_FPS) % 7) * 0.1);

	smoothNoise = smoothNoise * 0.6 + (Math.random() * 2 - 1) * 0.4;
	const weave: [number, number] = [
		s.weave * (0.0025 * Math.sin(t * 2.3) + 0.0012 * (Math.random() - 0.5)),
		s.weave * (0.004 * Math.sin(t * 1.7 + 1) + 0.002 * (Math.random() - 0.5)),
	];

	if (s.tear > 0 && t >= nextTearAt) {
		tear = [Math.random(), 0.03 + Math.random() * 0.06, s.tear];
		tearUntil = t + 0.12;
		nextTearAt = t + nextTearDelay(s.tear, Math.random());
	}
	if (t > tearUntil) tear = [0, 0.01, 0];

	return {
		seed,
		time: t,
		printColor: s.printColor,
		gel: hexToRgb(gelColor(s.gel)),
		gelDensity: s.gel === 'none' ? 0 : s.gelDensity,
		brightness: s.brightness,
		contrast: s.contrast,
		soft: s.soft,
		grain: s.grain,
		flickerGain: flickerGain(smoothNoise, s.flicker),
		weaveOffset: weave,
		dust: s.dust,
		vignette: s.vignette,
		rgbSplit: s.rgbSplit,
		tear,
		blocks: s.blocks,
		trails: s.trails,
		posterize: s.posterize,
		invert: s.invert,
	};
}

let frameRequested = false;
let filmHasFrame = false;

function drawFrame(now: number): void {
	frameRequested = false;
	if (!renderer) return;
	const videoReady = video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;
	if (videoReady) filmHasFrame = true;
	// The poster stands in only before the film's first frame. While a seek buffers,
	// the canvas keeps the last frame rather than flashing back to the poster.
	const source = videoReady ? video : filmHasFrame ? null : poster.complete ? poster : null;
	if (source && renderer.draw(source, uniforms(now))) stage.classList.add('is-projecting');
	if (!video.paused) requestFrame();
}

function requestFrame(): void {
	if (frameRequested || !renderer) return;
	frameRequested = true;
	requestAnimationFrame(drawFrame);
}

poster.addEventListener('load', requestFrame);
poster.addEventListener('error', () => {
	effectsNote.hidden = false;
	effectsNote.textContent = 'The poster frame did not load. Press play to start the film.';
});
video.addEventListener('loadeddata', requestFrame);
video.addEventListener('seeked', requestFrame);

// ---- Transport -----------------------------------------------------------

function formatTime(seconds: number): string {
	const whole = Math.floor(seconds);
	return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

function showTime(): void {
	const duration = Number.isFinite(video.duration) ? video.duration : Number(scrub.max);
	scrub.max = String(Math.floor(duration));
	scrub.value = String(Math.floor(video.currentTime));
	timeOutput.textContent = `${formatTime(video.currentTime)} / ${formatTime(duration)}`;
}

function togglePlay(): void {
	if (video.paused) {
		video.play().catch((error: Error) => {
			effectsNote.hidden = false;
			effectsNote.textContent = `The film did not start: ${error.message}`;
		});
	} else {
		video.pause();
	}
}

video.addEventListener('play', () => {
	playButton.textContent = 'Pause';
	stage.classList.add('is-playing');
	track('Play', { program: currentPreset() });
	requestFrame();
});
video.addEventListener('pause', () => {
	playButton.textContent = 'Play';
	stage.classList.remove('is-playing');
});
video.addEventListener('timeupdate', showTime);
video.addEventListener('loadedmetadata', showTime);
video.addEventListener('error', () => {
	effectsNote.hidden = false;
	effectsNote.textContent = 'The film could not be loaded. Check your connection and reload the page.';
});

playButton.addEventListener('click', togglePlay);
canvas.addEventListener('click', togglePlay);
scrub.addEventListener('input', () => {
	video.currentTime = Number(scrub.value);
	showTime();
});

function seekBy(seconds: number): void {
	video.currentTime = Math.max(0, Math.min(video.duration || Infinity, video.currentTime + seconds));
}

// ---- Settings → controls -------------------------------------------------

function setSpeed(value: number): void {
	const speed = snapSpeed(value);
	settings.speed = speed;
	video.playbackRate = speed;
	video.preservesPitch = false; // a projector run slow plays its sound slow too
	speedInput.value = String(speed);
	speedOutput.textContent = formatSpeed(speed);
	for (const button of document.querySelectorAll<HTMLButtonElement>('[data-speed]')) {
		button.setAttribute('aria-pressed', String(Number(button.dataset.speed) === speed));
	}
}

function showSettings(): void {
	for (const effect of EFFECTS) {
		const input = byId<HTMLInputElement>(`fx-${effect.key}`);
		input.value = String(settings[effect.key]);
		byId<HTMLOutputElement>(`fx-${effect.key}-value`).textContent = formatEffect(effect, settings[effect.key]);
	}
	for (const button of document.querySelectorAll<HTMLButtonElement>('[data-gel]')) {
		button.setAttribute('aria-pressed', String(button.dataset.gel === settings.gel));
	}
	customGel.closest('.gel')?.classList.toggle('is-active', settings.gel.startsWith('#'));
	setSpeed(settings.speed);
	requestFrame();
}

function currentPreset(): string {
	return document.querySelector<HTMLButtonElement>('[data-preset][aria-pressed="true"]')?.dataset.preset ?? 'custom';
}

function markPreset(id: string | null): void {
	for (const button of document.querySelectorAll<HTMLButtonElement>('[data-preset]')) {
		button.setAttribute('aria-pressed', String(button.dataset.preset === id));
	}
}

for (const input of document.querySelectorAll<HTMLInputElement>('[data-effect]')) {
	input.addEventListener('input', () => {
		const key = input.dataset.effect as EffectKey;
		settings[key] = Number(input.value);
		markPreset(null);
		showSettings();
	});
}

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-gel]')) {
	button.addEventListener('click', () => {
		settings.gel = button.dataset.gel ?? 'none';
		if (settings.gel !== 'none' && settings.gelDensity === 0) settings.gelDensity = 0.6;
		markPreset(null);
		showSettings();
	});
}

customGel.addEventListener('input', () => {
	settings.gel = customGel.value;
	markPreset(null);
	showSettings();
});

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-preset]')) {
	button.addEventListener('click', () => {
		const preset = PRESETS.find((p) => p.id === button.dataset.preset);
		if (!preset) throw new Error(`Unknown program: ${button.dataset.preset}`);
		settings = applyPreset(preset, reducedMotion.matches);
		markPreset(preset.id);
		showSettings();
		const hasMotion = EFFECTS.some((e) => e.motion && (preset.settings[e.key] ?? 0) > 0);
		if (reducedMotion.matches && hasMotion) {
			effectsNote.hidden = false;
			effectsNote.textContent = 'Your system asks for reduced motion, so grain, flicker, weave and tears start switched off. Turn them up with the sliders if you want them.';
		}
		track('Program', { program: preset.id });
	});
}

speedInput.addEventListener('input', () => {
	setSpeed(Number(speedInput.value));
	markPreset(null);
});
for (const button of document.querySelectorAll<HTMLButtonElement>('[data-speed]')) {
	button.addEventListener('click', () => setSpeed(Number(button.dataset.speed)));
}

function reset(): void {
	settings = initialSettings();
	markPreset('circulated');
	showSettings();
}
byId<HTMLButtonElement>('reset').addEventListener('click', reset);

// ---- Music ---------------------------------------------------------------

const soundtrack = new Soundtrack(
	video,
	(current) => {
		nowPlaying.textContent = current.id === SILENCE_ID
			? 'No music.'
			: `Now playing: ${current.title}, ${current.artist}${current.year ? ` (${current.year})` : ''}.`;
		const radio = document.querySelector<HTMLInputElement>(`input[name="track"][value="${current.id}"]`);
		if (radio) radio.checked = true;
	},
	(message) => {
		nowPlaying.textContent = message;
	},
);

for (const radio of document.querySelectorAll<HTMLInputElement>('input[name="track"]')) {
	radio.addEventListener('change', () => {
		soundtrack.select(radio.value);
		track('Music', { track: radio.value });
	});
}

volumeInput.addEventListener('input', () => {
	const volume = Number(volumeInput.value);
	soundtrack.setVolume(volume);
	volumeOutput.textContent = `${Math.round(volume * 100)}%`;
});
soundtrack.setVolume(Number(volumeInput.value));

// ---- Theater mode and full screen -----------------------------------------

let idleTimer = 0;

function wake(): void {
	stage.classList.remove('is-idle');
	clearTimeout(idleTimer);
	if (!root.classList.contains('theater')) return;
	idleTimer = window.setTimeout(() => {
		// Never hide the controls from someone using them with a keyboard
		const keyboardFocus = document.activeElement?.matches(':focus-visible') ?? false;
		if (!video.paused && !keyboardFocus) stage.classList.add('is-idle');
	}, IDLE_MS);
}

function setTheater(on: boolean): void {
	root.classList.toggle('theater', on);
	theaterButton.setAttribute('aria-pressed', String(on));
	if (!on) setControlsOpen(false);
	wake();
}

function setControlsOpen(open: boolean): void {
	stage.classList.toggle('controls-open', open);
	controlsToggle.setAttribute('aria-expanded', String(open));
}

const canFullscreen = typeof stage.requestFullscreen === 'function' && document.fullscreenEnabled;
if (!canFullscreen) {
	// iPhone Safari can only take a bare <video> full screen, which would drop the projection
	fullscreenButton.hidden = true;
}

function toggleFullscreen(): void {
	if (!canFullscreen) {
		setTheater(!root.classList.contains('theater'));
		return;
	}
	if (document.fullscreenElement) {
		document.exitFullscreen();
	} else {
		stage.requestFullscreen().catch((error: Error) => {
			effectsNote.hidden = false;
			effectsNote.textContent = `Full screen was refused: ${error.message}. Theater mode fills the window instead.`;
			setTheater(true);
		});
		track('Full screen');
	}
}

document.addEventListener('fullscreenchange', () => {
	const on = document.fullscreenElement === stage;
	fullscreenButton.textContent = on ? 'Exit full screen' : 'Full screen';
	setTheater(on);
});

theaterButton.addEventListener('click', () => {
	setTheater(!root.classList.contains('theater'));
	if (root.classList.contains('theater')) track('Theater mode');
});
fullscreenButton.addEventListener('click', toggleFullscreen);
controlsToggle.addEventListener('click', () => {
	setControlsOpen(!stage.classList.contains('controls-open'));
	if (stage.classList.contains('controls-open')) byId<HTMLButtonElement>('controls-close').focus();
});
byId<HTMLButtonElement>('controls-close').addEventListener('click', () => {
	setControlsOpen(false);
	controlsToggle.focus();
});

for (const type of ['pointermove', 'pointerdown', 'keydown', 'focusin'] as const) {
	stage.addEventListener(type, wake);
}

// ---- Keyboard ------------------------------------------------------------

byId<HTMLButtonElement>('help-open').addEventListener('click', () => help.showModal());
byId<HTMLButtonElement>('help-close').addEventListener('click', () => help.close());

document.addEventListener('keydown', (event) => {
	if (event.metaKey || event.ctrlKey || event.altKey || help.open) return;
	const target = event.target as HTMLElement;
	const typing = target.matches('input:not([type="range"]):not([type="radio"]), textarea, select');
	if (typing) return;
	const onControl = target.matches('button, input, summary, a');

	switch (event.key) {
		case ' ':
			if (onControl) return; // Space presses the focused control
			event.preventDefault();
			togglePlay();
			break;
		case 'f':
		case 'F':
			toggleFullscreen();
			break;
		case 't':
		case 'T':
			setTheater(!root.classList.contains('theater'));
			break;
		case '[':
			setSpeed(settings.speed - 0.05);
			break;
		case ']':
			setSpeed(settings.speed + 0.05);
			break;
		case 'ArrowLeft':
			if (onControl) return; // arrows move sliders and radios
			seekBy(-SEEK_SECONDS);
			break;
		case 'ArrowRight':
			if (onControl) return;
			seekBy(SEEK_SECONDS);
			break;
		case 'm':
		case 'M':
			nowPlaying.textContent = soundtrack.toggleMute() ? 'Muted.' : 'Sound on.';
			break;
		case 'r':
		case 'R':
			reset();
			break;
		case '?':
			help.showModal();
			break;
		case 'Escape':
			if (stage.classList.contains('controls-open')) {
				setControlsOpen(false);
				controlsToggle.focus();
			} else if (root.classList.contains('theater') && !document.fullscreenElement) {
				setTheater(false);
			}
			break;
		default:
			return;
	}
	wake();
});

showSettings();
showTime();
