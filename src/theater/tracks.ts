// What plays with the picture. "film" is the video's own soundtrack, the Nestor Amaral
// records Cornell paired with the film in the 1960s; it stays in sync with the picture.
// The 78s are US recordings released in 1925 or earlier, which are public domain
// (Music Modernization Act), transferred by the Internet Archive's Great 78 Project.

export interface Track {
	id: string;
	title: string;
	artist: string;
	year?: number;
	/** Path under public/, or null for the film's own soundtrack */
	src: string | null;
	/** Where the recording came from, for the credits */
	source?: string;
}

export const FILM_TRACK_ID = 'film';
export const SILENCE_ID = 'silence';

export const TRACKS: Track[] = [
	{ id: FILM_TRACK_ID, title: 'Holiday in Brazil (film soundtrack)', artist: 'Nestor Amaral and His Continentals', year: 1957, src: null },
	{ id: 'song-of-india', title: 'Song of India', artist: 'Eugene Ormandy, Capitol Theatre Orchestra', year: 1923, src: '/media/music/song-of-india.mp3', source: 'https://archive.org/details/78_song-of-india_eugene-ormandy-capitol-theatre-orchestra-william-axt-rimsky-korsako_gbia3003767b' },
	{ id: 'la-paloma', title: 'La Paloma', artist: 'Marimba La Centro Americana', year: 1924, src: '/media/music/la-paloma-marimba.mp3', source: 'https://archive.org/details/78_la-paloma_marimba-la-centro-americana-yradier_gbia3020063b' },
	{ id: 'drowsy-waters', title: 'Wailana (Drowsy Waters)', artist: 'Ferera and Franchini', year: 1919, src: '/media/music/drowsy-waters.mp3', source: 'https://archive.org/details/78_wailana-drowsy-waters_ferera-franchini_gbia0054607a' },
	{ id: 'la-copa', title: 'La Copa del Olvido', artist: "Max Dolin's Orchestra", year: 1922, src: '/media/music/la-copa-del-olvido.mp3', source: 'https://archive.org/details/78_the-cup-of-forgiveness-la-copa-del-olvido_max-dolins-orchestra-enrique-delfino_gbia0304802a' },
	{ id: 'havana', title: 'Havana', artist: 'San Jose Orchestra', year: 1923, src: '/media/music/havana-tango.mp3', source: 'https://archive.org/details/78_havana_san-jose-orchestra-schonberger-and-lyman_gbia0466659a' },
	{ id: 'la-golondrina', title: 'La Golondrina', artist: 'The Castillians', year: 1923, src: '/media/music/la-golondrina.mp3', source: 'https://archive.org/details/78_la-golondrina-the-swallow_the-castillians-serradell_gbia0448420a' },
	{ id: 'over-the-waves', title: 'Over the Waves', artist: 'Peerless Orchestra', year: 1920, src: '/media/music/over-the-waves.mp3', source: 'https://archive.org/details/78_over-the-waves-waltz_peerless-orchestra-juventino-rosas_gbia0178673a' },
	{ id: 'hawaiian-lullaby', title: 'Hawaiian Lullaby', artist: 'Honolulu Hawaiian Orchestra', year: 1924, src: '/media/music/hawaiian-lullaby.mp3', source: 'https://archive.org/details/78_hawaiian-lullaby_honolulu-hawaiian-orchestra-ferriss-bridges_gbia0476666a' },
	{ id: 'soon', title: 'Soon', artist: 'My Bloody Valentine', year: 1990, src: '/media/music/mbv-soon.mp3' },
	{ id: SILENCE_ID, title: 'Silence', artist: 'No accompaniment', src: null },
];

/** The record changer: after a 78 ends, the next 78 in the list plays */
export function nextRecord(currentId: string): Track {
	const records = TRACKS.filter((t) => t.src !== null);
	const index = records.findIndex((t) => t.id === currentId);
	if (index === -1) throw new Error(`Not a record: ${currentId}`);
	return records[(index + 1) % records.length];
}

export function findTrack(id: string): Track {
	const track = TRACKS.find((t) => t.id === id);
	if (!track) throw new Error(`Unknown track: ${id}`);
	return track;
}
