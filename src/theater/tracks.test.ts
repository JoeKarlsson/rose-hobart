import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { TRACKS, findTrack, nextRecord, stepTrack } from './tracks';

describe('tracks', () => {
	it('every record file exists in public/', () => {
		for (const track of TRACKS.filter((t) => t.src)) {
			expect(existsSync(new URL(`../../public${track.src}`, import.meta.url)), track.src!).toBe(true);
		}
	});

	it('every 78 is public domain in the US: released in 1925 or earlier', () => {
		for (const track of TRACKS.filter((t) => t.source)) expect(track.year, track.id).toBeLessThanOrEqual(1925);
	});

	it('the record changer moves to the next record and wraps around', () => {
		const records = TRACKS.filter((t) => t.src);
		expect(nextRecord(records[0].id)).toBe(records[1]);
		expect(nextRecord(records.at(-1)!.id)).toBe(records[0]);
	});

	it('previous and next step through every choice and wrap', () => {
		expect(stepTrack(TRACKS[0].id, 1)).toBe(TRACKS[1]);
		expect(stepTrack(TRACKS[0].id, -1)).toBe(TRACKS.at(-1));
		expect(() => stepTrack('nope', 1)).toThrow('Unknown track');
	});

	it('refuses tracks that are not records', () => {
		expect(() => nextRecord('film')).toThrow('Not a record');
		expect(() => findTrack('nope')).toThrow('Unknown track');
	});
});
