import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FILM_TRACK_ID, nextRecord } from './tracks';

// Stand-ins for <video> and new Audio(): just the parts the soundtrack touches
class FakeMedia extends EventTarget {
	paused = true;
	muted = false;
	volume = 1;
	preload = '';
	src = '';
	play = vi.fn(async () => {
		this.paused = false;
		this.dispatchEvent(new Event('play'));
	});
	pause = vi.fn(() => {
		this.paused = true;
		this.dispatchEvent(new Event('pause'));
	});
	removeAttribute(name: string) {
		if (name === 'src') this.src = '';
	}
}

let record: FakeMedia;
vi.stubGlobal(
	'Audio',
	class {
		constructor() {
			record = new FakeMedia();
			return record;
		}
	},
);
const { Soundtrack } = await import('./soundtrack');

describe('Soundtrack', () => {
	let video: FakeMedia;
	let soundtrack: InstanceType<typeof Soundtrack>;
	let shown: string[];

	beforeEach(() => {
		video = new FakeMedia();
		shown = [];
		soundtrack = new Soundtrack(video as unknown as HTMLVideoElement, (t) => shown.push(t.id), () => {});
	});

	it('a record mutes the film and waits for the projector', () => {
		soundtrack.select('song-of-india');
		expect(video.muted).toBe(true);
		expect(record.src).toBe('/media/music/song-of-india.mp3');
		expect(record.play).not.toHaveBeenCalled();
	});

	it('records start and stop with the film', async () => {
		soundtrack.select('song-of-india');
		await video.play();
		expect(record.play).toHaveBeenCalled();
		video.pause();
		expect(record.pause).toHaveBeenCalled();
	});

	it('the record changer plays the next record when one ends', async () => {
		soundtrack.select('song-of-india');
		await video.play();
		record.dispatchEvent(new Event('ended'));
		expect(soundtrack.current.id).toBe(nextRecord('song-of-india').id);
		expect(shown.at(-1)).toBe(nextRecord('song-of-india').id);
	});

	it('the film soundtrack unmutes the film and stops the record', () => {
		soundtrack.select('song-of-india');
		soundtrack.select(FILM_TRACK_ID);
		expect(video.muted).toBe(false);
		expect(record.src).toBe('');
	});

	it('mute silences both, and unmuting restores only the chosen one', () => {
		soundtrack.select('song-of-india');
		expect(soundtrack.toggleMute()).toBe(true);
		expect(record.muted).toBe(true);
		expect(soundtrack.toggleMute()).toBe(false);
		expect(record.muted).toBe(false);
		expect(video.muted).toBe(true);
	});
});
