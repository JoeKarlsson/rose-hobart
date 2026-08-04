import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import mvbSoon from '../assets/audio/My Bloody Valentine - Soon.mp3';
import roseHobartAudio from '../assets/audio/Rose Hobart (1936) by Joseph Cornell.mp3';

export const TRACKS = [
	{ name: 'My Bloody Valentine – Soon', src: mvbSoon },
	{ name: 'Rose Hobart (1936)',         src: roseHobartAudio },
];

// Module-level singleton — lives outside React so navigation never kills it.
const audio = new Audio();
audio.loop = true;

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
	const [activeTrack,  setActiveTrack]  = useState(null);
	const [musicPlaying, setMusicPlaying] = useState(false);
	const [musicVolume,  setMusicVolume]  = useState(0.8);
	const autoStarted = useRef(false);

	const handleTrackSelect = useCallback((trackIndex) => {
		if (activeTrack === trackIndex) {
			if (musicPlaying) {
				audio.pause();
				setMusicPlaying(false);
			} else {
				audio.play().then(() => setMusicPlaying(true)).catch(() => {});
			}
			return;
		}
		audio.pause();
		audio.src = TRACKS[trackIndex].src;
		audio.volume = musicVolume;
		setActiveTrack(trackIndex);
		audio.play().then(() => setMusicPlaying(true)).catch(() => {});
	}, [activeTrack, musicPlaying, musicVolume]);

	const handleVolumeChange = useCallback((v) => {
		setMusicVolume(v);
		audio.volume = v;
	}, []);

	// Called once when the video first plays
	const autoStartMusic = useCallback(() => {
		if (autoStarted.current) return;
		autoStarted.current = true;
		audio.src = TRACKS[1].src; // Rose Hobart (1936)
		audio.volume = musicVolume;
		audio.play().then(() => {
			setActiveTrack(1);
			setMusicPlaying(true);
		}).catch(() => {});
	}, [musicVolume]);

	return (
		<AudioContext.Provider value={{
			activeTrack,
			musicPlaying,
			musicVolume,
			handleTrackSelect,
			handleVolumeChange,
			autoStartMusic,
		}}>
			{children}
		</AudioContext.Provider>
	);
};

export const useAudio = () => useContext(AudioContext);
