// Every control on the projection panel is defined here once. The panel markup,
// the presets, the master dials and the shader uniforms all read from this table.

/** Which booth tab an effect lives on; gel density sits with the gels on the Projector tab */
export type EffectGroup = 'gel' | 'print' | 'film' | 'glitch';

interface EffectDefinition {
	key: string;
	label: string;
	group: EffectGroup;
	min: number;
	max: number;
	step: number;
	initial: number;
	/** Moves or changes over time; zeroed when the viewer prefers reduced motion */
	motion: boolean;
}

export const EFFECTS = [
	{ key: 'printColor', label: 'Print color', group: 'print', min: 0, max: 1, step: 0.01, initial: 1, motion: false },
	{ key: 'gelDensity', label: 'Gel density', group: 'gel', min: 0, max: 1, step: 0.01, initial: 0.6, motion: false },
	{ key: 'brightness', label: 'Brightness', group: 'print', min: 0.4, max: 1.8, step: 0.01, initial: 1, motion: false },
	{ key: 'contrast', label: 'Contrast', group: 'print', min: 0.5, max: 1.8, step: 0.01, initial: 1, motion: false },
	{ key: 'soft', label: 'Soft focus', group: 'film', min: 0, max: 1, step: 0.01, initial: 0, motion: false },
	{ key: 'grain', label: 'Grain', group: 'film', min: 0, max: 1, step: 0.01, initial: 0, motion: true },
	{ key: 'flicker', label: 'Flicker', group: 'film', min: 0, max: 1, step: 0.01, initial: 0, motion: true },
	{ key: 'weave', label: 'Gate weave', group: 'film', min: 0, max: 1, step: 0.01, initial: 0, motion: true },
	{ key: 'dust', label: 'Dust and scratches', group: 'film', min: 0, max: 1, step: 0.01, initial: 0, motion: true },
	{ key: 'vignette', label: 'Vignette', group: 'film', min: 0, max: 1, step: 0.01, initial: 0, motion: false },
	{ key: 'rgbSplit', label: 'Color split', group: 'glitch', min: 0, max: 1, step: 0.01, initial: 0, motion: false },
	{ key: 'tear', label: 'Signal tear', group: 'glitch', min: 0, max: 1, step: 0.01, initial: 0, motion: true },
	{ key: 'blocks', label: 'Block corruption', group: 'glitch', min: 0, max: 1, step: 0.01, initial: 0, motion: true },
	{ key: 'trails', label: 'Trails', group: 'glitch', min: 0, max: 0.95, step: 0.01, initial: 0, motion: false },
	{ key: 'posterize', label: 'Posterize', group: 'glitch', min: 0, max: 1, step: 0.01, initial: 0, motion: false },
	{ key: 'invert', label: 'Negative', group: 'glitch', min: 0, max: 1, step: 0.01, initial: 0, motion: false },
] as const satisfies readonly EffectDefinition[];

export type Effect = (typeof EFFECTS)[number];
export type EffectKey = Effect['key'];

/** The booth tabs after Projector, each holding one group's sliders */
export const DETAIL_TABS = [
	{ group: 'print', label: 'Print' },
	{ group: 'film', label: 'Film' },
	{ group: 'glitch', label: 'Glitch' },
] as const satisfies readonly { group: EffectGroup; label: string }[];

// ---- Master dials -----------------------------------------------------------
// Age and Glitch each drive a set of effects together. At a full turn every effect
// reaches its weight; moving a master overwrites what those sliders were set to.

export interface Master {
	id: 'age' | 'glitch';
	label: string;
	mix: readonly (readonly [EffectKey, number])[];
	/** Words for the dial's position, from off to full */
	stops: readonly string[];
}

export const MASTERS: Master[] = [
	{
		id: 'age',
		label: 'Age',
		mix: [['soft', 0.25], ['grain', 0.6], ['flicker', 0.5], ['weave', 0.4], ['dust', 0.85], ['vignette', 0.6]],
		stops: ['Fresh print', 'Second run', 'Worn reel', 'Nitrate rot'],
	},
	{
		id: 'glitch',
		label: 'Glitch',
		mix: [['rgbSplit', 0.6], ['tear', 0.5], ['blocks', 0.7], ['trails', 0.6]],
		stops: ['Clean', 'Dropouts', 'Corrupt', 'Datamoshed'],
	},
];

export function applyMaster(settings: Settings, master: Master, amount: number): Settings {
	const next = { ...settings };
	for (const [key, weight] of master.mix) next[key] = Math.round(amount * weight * 100) / 100;
	return next;
}

/** Where the dial sits for the current settings: the average of each effect against its weight */
export function masterLevel(settings: Settings, master: Master): number {
	const total = master.mix.reduce((sum, [key, weight]) => sum + Math.min(1, settings[key] / weight), 0);
	return Math.round((total / master.mix.length) * 100) / 100;
}

/** The first stop means off; the rest split the dial's travel evenly */
export function masterWord(master: Master, level: number): string {
	if (level <= 0) return master.stops[0];
	const steps = master.stops.length - 1;
	return master.stops[1 + Math.min(steps - 1, Math.floor(level * steps))];
}

export interface Gel {
	id: string;
	label: string;
	color: string;
}

// Theatrical gel colors, after Roscolux swatches of the kind a 1930s booth would carry
export const GELS: Gel[] = [
	{ id: 'none', label: 'No gel', color: '#ffffff' },
	{ id: 'blue', label: 'Cornell blue', color: '#3048d8' },
	{ id: 'pink', label: 'Pink', color: '#ff6fae' },
	{ id: 'amber', label: 'Amber', color: '#ffb347' },
	{ id: 'green', label: 'Green', color: '#4fb36a' },
	{ id: 'red', label: 'Red', color: '#d0213a' },
];

export type Settings = Record<EffectKey, number> & { gel: string; speed: number };

export const SPEED = { min: 0.25, max: 2, step: 0.01 } as const;

// The circulating print already runs at silent speed (16 fps); 24 fps sound speed is 1.5x that
export const SPEED_DETENTS = [
	{ value: 1, label: 'Silent speed, 16 fps' },
	{ value: 1.5, label: 'Sound speed, 24 fps' },
] as const;

const DETENT_PULL = 0.04;

/** Clamp a speed to the dial's range and pull it onto a detent when it lands close to one */
export function snapSpeed(value: number): number {
	const clamped = Math.min(SPEED.max, Math.max(SPEED.min, value));
	for (const detent of SPEED_DETENTS) {
		if (Math.abs(clamped - detent.value) <= DETENT_PULL) return detent.value;
	}
	return Math.round(clamped * 100) / 100;
}

export function formatSpeed(value: number): string {
	return `${value.toFixed(2)}×`;
}

export function initialSettings(): Settings {
	const settings = { gel: 'none', speed: 1 } as Settings;
	for (const effect of EFFECTS) settings[effect.key] = effect.initial;
	return settings;
}

export interface Preset {
	id: string;
	label: string;
	settings: Partial<Settings>;
}

// Each preset starts from the initial settings, so unlisted effects are switched off
export const PRESETS: Preset[] = [
	{ id: 'circulated', label: 'As circulated', settings: {} },
	{
		id: 'cornell',
		label: 'Cornell 1936',
		settings: { printColor: 0, gel: 'blue', gelDensity: 0.75, grain: 0.25, flicker: 0.2, weave: 0.2, dust: 0.15, vignette: 0.45 },
	},
	{
		id: 'pink',
		label: 'Pink filter',
		settings: { printColor: 0, gel: 'pink', gelDensity: 0.6, grain: 0.2, vignette: 0.35, soft: 0.15 },
	},
	{
		id: 'nitrate',
		label: 'Nitrate decay',
		settings: { printColor: 0.2, gel: 'amber', gelDensity: 0.55, contrast: 1.25, grain: 0.6, flicker: 0.45, weave: 0.35, dust: 0.85, vignette: 0.6, soft: 0.2 },
	},
	{
		id: 'broken',
		label: 'Broken projector',
		settings: { grain: 0.45, flicker: 0.9, weave: 0.9, dust: 1, vignette: 0.5, tear: 0.5 },
	},
	{
		id: 'digital',
		label: 'Digital decay',
		settings: { soft: 0.35, rgbSplit: 0.5, blocks: 0.6, trails: 0.55, posterize: 0.4, tear: 0.3 },
	},
];

export function applyPreset(preset: Preset, reducedMotion: boolean): Settings {
	const settings = { ...initialSettings(), ...preset.settings };
	return reducedMotion ? withoutMotion(settings) : settings;
}

export function withoutMotion(settings: Settings): Settings {
	const still = { ...settings };
	for (const effect of EFFECTS) if (effect.motion) still[effect.key] = 0;
	return still;
}

/** Brightness and contrast read 100% at neutral; the 0-to-1 effects read their strength */
export function formatEffect(value: number): string {
	return `${Math.round(value * 100)}%`;
}

/** Hex color to linear-ish 0..1 RGB for the shader */
export function hexToRgb(hex: string): [number, number, number] {
	const match = /^#([0-9a-f]{6})$/i.exec(hex);
	if (!match) throw new Error(`Not a #rrggbb color: ${hex}`);
	const n = parseInt(match[1], 16);
	return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function gelColor(gel: string): string {
	if (gel.startsWith('#')) return gel;
	const found = GELS.find((g) => g.id === gel);
	if (!found) throw new Error(`Unknown gel: ${gel}`);
	return found.color;
}

// Flicker stays under the WCAG 2.3.1 general flash threshold: brightness swings at most
// 15% of the frame's own light, and the film's frames sit well below 0.6 relative luminance,
// so no pair of changes reaches the 0.1 luminance step that counts as a flash.
export const MAX_FLICKER_SWING = 0.15;

/** Brightness gain for one frame, from smoothed noise in -1..1 */
export function flickerGain(noise: number, amount: number): number {
	const n = Math.max(-1, Math.min(1, noise));
	return 1 + n * amount * MAX_FLICKER_SWING;
}

// Signal tears come at most twice a second, so a strong setting never strobes
export const MIN_TEAR_GAP = 0.5;

/** Seconds until the next tear, from a 0..1 random draw; Infinity when tears are off */
export function nextTearDelay(amount: number, random: number): number {
	if (amount <= 0) return Infinity;
	const longest = 4 - amount * 3;
	return MIN_TEAR_GAP + random * (longest - MIN_TEAR_GAP);
}
