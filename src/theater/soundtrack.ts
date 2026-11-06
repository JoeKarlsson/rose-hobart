import { FILM_TRACK_ID, findTrack, nextRecord, type Track } from './tracks';

/**
 * Plays either the film's own soundtrack (the video's audio, in sync) or a record.
 * A record follows the projector: it plays while the film runs and stops when it pauses.
 */
export class Soundtrack {
	private record = new Audio();
	private muted = false;
	current: Track = findTrack(FILM_TRACK_ID);

	constructor(
		private video: HTMLVideoElement,
		private onChange: (track: Track) => void,
		private onError: (message: string) => void,
	) {
		this.record.preload = 'none';
		this.record.addEventListener('ended', () => this.select(nextRecord(this.current.id).id));
		this.record.addEventListener('error', () => this.onError(`${this.current.title} could not be loaded`));
		video.addEventListener('play', () => this.playRecord());
		video.addEventListener('pause', () => this.record.pause());
	}

	select(id: string): void {
		const track = findTrack(id);
		this.current = track;
		this.video.muted = this.muted || track.id !== FILM_TRACK_ID;
		if (track.src === null) {
			this.record.pause();
			this.record.removeAttribute('src');
		} else {
			this.record.src = track.src;
			this.playRecord();
		}
		this.onChange(track);
	}

	setVolume(volume: number): void {
		this.video.volume = volume;
		this.record.volume = volume;
	}

	/** Returns whether sound is now muted */
	toggleMute(): boolean {
		this.muted = !this.muted;
		this.record.muted = this.muted;
		this.video.muted = this.muted || this.current.id !== FILM_TRACK_ID;
		return this.muted;
	}

	private playRecord(): void {
		if (this.current.src === null || this.video.paused) return;
		this.record.play().catch((error: Error) => this.onError(`${this.current.title} did not play: ${error.message}`));
	}
}
