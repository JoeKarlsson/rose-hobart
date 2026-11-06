import { describe, expect, it } from 'vitest';
import {
	EFFECTS,
	GELS,
	MASTERS,
	MAX_FLICKER_SWING,
	MIN_TEAR_GAP,
	PRESETS,
	SPEED,
	applyMaster,
	applyPreset,
	flickerGain,
	formatEffect,
	gelColor,
	hexToRgb,
	initialSettings,
	masterLevel,
	masterWord,
	nextTearDelay,
	snapSpeed,
} from './effects';

describe('presets', () => {
	it('only set known effects, inside each slider range', () => {
		const keys = new Set<string>([...EFFECTS.map((e) => e.key), 'gel', 'speed']);
		for (const preset of PRESETS) {
			for (const [key, value] of Object.entries(preset.settings)) {
				expect(keys.has(key), `${preset.id}.${key}`).toBe(true);
				const effect = EFFECTS.find((e) => e.key === key);
				if (effect) {
					expect(value).toBeGreaterThanOrEqual(effect.min);
					expect(value).toBeLessThanOrEqual(effect.max);
				}
			}
			if (preset.settings.gel) expect(() => gelColor(preset.settings.gel!)).not.toThrow();
		}
	});

	it('start from the initial settings, so a preset switches off what it does not list', () => {
		const broken = applyPreset(PRESETS.find((p) => p.id === 'broken')!, false);
		const digital = applyPreset(PRESETS.find((p) => p.id === 'digital')!, false);
		expect(broken.flicker).toBeGreaterThan(0);
		expect(digital.flicker).toBe(0);
		expect(digital.gel).toBe('none');
	});

	it('zero every moving effect under reduced motion and keep the still ones', () => {
		const broken = applyPreset(PRESETS.find((p) => p.id === 'broken')!, true);
		for (const effect of EFFECTS.filter((e) => e.motion)) expect(broken[effect.key]).toBe(0);
		expect(broken.vignette).toBe(0.5);
	});

	it('"As circulated" is exactly the initial settings', () => {
		expect(applyPreset(PRESETS[0], false)).toEqual(initialSettings());
	});
});

describe('snapSpeed', () => {
	it('clamps to the dial range', () => {
		expect(snapSpeed(0)).toBe(SPEED.min);
		expect(snapSpeed(9)).toBe(SPEED.max);
	});

	it('pulls values near silent and sound speed onto the detent', () => {
		expect(snapSpeed(1.03)).toBe(1);
		expect(snapSpeed(1.47)).toBe(1.5);
	});

	it('leaves other values alone, rounded to hundredths', () => {
		expect(snapSpeed(0.733333)).toBe(0.73);
		expect(snapSpeed(1.2)).toBe(1.2);
	});
});

describe('flash safety', () => {
	it('never swings brightness more than the cap, even with out-of-range noise', () => {
		expect(flickerGain(5, 1)).toBe(1 + MAX_FLICKER_SWING);
		expect(flickerGain(-5, 1)).toBe(1 - MAX_FLICKER_SWING);
		expect(flickerGain(1, 0)).toBe(1);
	});

	it('keeps signal tears at least half a second apart, and off when the slider is at zero', () => {
		for (const amount of [0.01, 0.5, 1]) {
			expect(nextTearDelay(amount, 0)).toBeGreaterThanOrEqual(MIN_TEAR_GAP);
			expect(nextTearDelay(amount, 1)).toBeGreaterThanOrEqual(MIN_TEAR_GAP);
		}
		expect(nextTearDelay(0, 0.5)).toBe(Infinity);
	});
});

describe('master dials', () => {
	const [age, glitch] = MASTERS;

	it('only drive real effects, and never past a slider\'s range', () => {
		for (const master of MASTERS) {
			for (const [key, weight] of master.mix) {
				const effect = EFFECTS.find((e) => e.key === key)!;
				expect(effect, key).toBeDefined();
				expect(weight).toBeLessThanOrEqual(effect.max);
			}
		}
	});

	it('set every effect in the mix to its share, overwriting earlier tweaks', () => {
		const tweaked = { ...initialSettings(), grain: 0.9 };
		const worn = applyMaster(tweaked, age, 0.5);
		expect(worn.grain).toBe(0.3);
		expect(worn.dust).toBe(0.43);
		expect(worn.rgbSplit).toBe(0);
	});

	it('read back the level they were set to', () => {
		expect(masterLevel(applyMaster(initialSettings(), age, 0.7), age)).toBe(0.7);
		expect(masterLevel(initialSettings(), glitch)).toBe(0);
	});

	it('name the dial position', () => {
		expect(masterWord(age, 0)).toBe('Fresh print');
		expect(masterWord(age, 0.1)).toBe('Second run');
		expect(masterWord(age, 0.5)).toBe('Worn reel');
		expect(masterWord(age, 1)).toBe('Nitrate rot');
	});
});

describe('formatEffect', () => {
	it('reads 100% at neutral brightness and the strength for 0-to-1 effects', () => {
		expect(formatEffect(1)).toBe('100%');
		expect(formatEffect(0.25)).toBe('25%');
	});
});

describe('gel colors', () => {
	it('parse every named gel and custom hex colors', () => {
		for (const gel of GELS) expect(hexToRgb(gel.color)).toHaveLength(3);
		expect(hexToRgb('#ff8000')).toEqual([1, 128 / 255, 0]);
		expect(gelColor('#123456')).toBe('#123456');
	});

	it('fail loudly on unknown gels and bad colors', () => {
		expect(() => gelColor('teal')).toThrow('Unknown gel');
		expect(() => hexToRgb('red')).toThrow('Not a #rrggbb color');
	});
});
