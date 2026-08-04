import React, { useState, useRef, useCallback, useEffect } from 'react';
import './Home.scss';

import videoMP4 from '../../../assets/video/video.mp4';
import { TRACKS, useAudio } from '../../../context/AudioContext';

const TINT_PRESETS = [
	{ name: 'None',      color: '#000000', opacity: 0    },
	{ name: 'Prussian',  color: '#003153', opacity: 0.50 },
	{ name: 'Violet',    color: '#7B2FBE', opacity: 0.40 },
	{ name: 'Rose',      color: '#E75480', opacity: 0.35 },
	{ name: 'Amber',     color: '#FFBF00', opacity: 0.35 },
	{ name: 'Jade',      color: '#00A550', opacity: 0.35 },
	{ name: 'Crimson',   color: '#DC143C', opacity: 0.35 },
];

const BLEND_MODES = ['multiply', 'color', 'screen', 'overlay'];

const EFFECTS = [
	{ key: 'brightness', label: 'Brightness', min: 0, max: 2,   step: 0.1, fmt: v => v.toFixed(2) },
	{ key: 'contrast',   label: 'Contrast',   min: 0, max: 2,   step: 0.1, fmt: v => v.toFixed(2) },
	{ key: 'saturation', label: 'Saturation', min: 0, max: 2,   step: 0.1, fmt: v => v.toFixed(2) },
	{ key: 'hue',        label: 'Hue',        min: 0, max: 360, step: 1,   fmt: v => `${v}°` },
	{ key: 'sepia',      label: 'Sepia',      min: 0, max: 1,   step: 0.1, fmt: v => v.toFixed(2) },
	{ key: 'invert',     label: 'Invert',     min: 0, max: 1,   step: 1,   fmt: v => v ? 'On' : 'Off' },
];

const Home = () => {
	const videoRef = useRef(null);
	const { activeTrack, musicPlaying, musicVolume, handleTrackSelect, handleVolumeChange, autoStartMusic } = useAudio();

	const [tintColor,     setTintColor]     = useState('#000000');
	const [tintOpacity,   setTintOpacity]   = useState(0);
	const [tintBlendMode, setTintBlendMode] = useState('multiply');
	const [activeTint,    setActiveTint]    = useState('None');

	const [videoSettings, setVideoSettings] = useState({
		brightness: 1, contrast: 1, saturation: 1,
		hue: 0, sepia: 0, invert: 0,
	});

	// Auto-start Rose Hobart (1936) the first time the video plays
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;
		const onFirstPlay = () => autoStartMusic();
		video.addEventListener('play', onFirstPlay);
		return () => video.removeEventListener('play', onFirstPlay);
	}, [autoStartMusic]);

	const applyFilters = useCallback((settings) => {
		const video = videoRef.current;
		if (!video) return;
		video.style.filter = `brightness(${settings.brightness}) contrast(${settings.contrast}) saturate(${settings.saturation}) hue-rotate(${settings.hue}deg) sepia(${settings.sepia}) invert(${settings.invert})`;
	}, []);

	const handleSliderChange = useCallback((property, value) => {
		setVideoSettings(prev => {
			const next = { ...prev, [property]: parseFloat(value) };
			applyFilters(next);
			return next;
		});
	}, [applyFilters]);

	const applyTintPreset = useCallback((preset) => {
		setActiveTint(preset.name);
		setTintColor(preset.color);
		setTintOpacity(preset.opacity);
	}, []);

	const handleVideoControl = useCallback((action) => {
		const video = videoRef.current;
		if (!video) return;
		switch (action) {
			case 'play':  video.play(); break;
			case 'pause': video.pause(); break;
			case 'mute':  video.muted = !video.muted; break;
			case 'slow':  video.playbackRate = Math.max(0.1, video.playbackRate - 0.1); break;
			case 'fast':  video.playbackRate = Math.min(3,   video.playbackRate + 0.1); break;
			default: break;
		}
	}, []);

	return (
		<div className="Home">
			<div className="container">

				<div className="video-section">
					<div className="video-wrapper">
						<video
							ref={videoRef}
							width="800"
							height="450"
							controls
							preload="metadata"
							muted
							playsInline
						>
							<source type="video/mp4" src={videoMP4} />
							Your browser does not support the video tag.
						</video>
						<div
							className="tint-overlay"
							style={{
								backgroundColor: tintColor,
								opacity: tintOpacity,
								mixBlendMode: tintBlendMode,
							}}
						/>
					</div>
				</div>

				<div className="controls-panel">

					{/* ─── COLOR TINT ─── */}
					<h4 className="controls-title">Color Tint</h4>
					<div className="tint-swatches">
						{TINT_PRESETS.map(preset => (
							<button
								key={preset.name}
								className={`tint-swatch${preset.name === 'None' ? ' tint-swatch--none' : ''}${activeTint === preset.name ? ' active' : ''}`}
								onClick={() => applyTintPreset(preset)}
								title={preset.name}
								style={preset.name !== 'None' ? {
									backgroundColor: preset.color,
									'--swatch-glow': preset.color,
								} : { '--swatch-glow': '#555' }}
							/>
						))}
						<label
							className={`tint-swatch tint-swatch--custom${activeTint === 'custom' ? ' active' : ''}`}
							title="Custom color"
							style={{ '--swatch-glow': tintColor }}
						>
							<input
								type="color"
								className="tint-color-input"
								value={tintColor === '#000000' ? '#6A5ACD' : tintColor}
								onChange={(e) => {
									setTintColor(e.target.value);
									setActiveTint('custom');
									if (tintOpacity === 0) setTintOpacity(0.35);
								}}
							/>
						</label>
					</div>

					<div className="tint-controls">
						<div className="effect-row">
							<label className="effect-label">Intensity: {Math.round(tintOpacity * 100)}%</label>
							<input
								type="range"
								className="art-deco-range"
								min="0" max="0.8" step="0.01"
								value={tintOpacity}
								onChange={(e) => setTintOpacity(parseFloat(e.target.value))}
							/>
						</div>
						<div className="effect-row">
							<label className="effect-label">Blend Mode</label>
							<select
								className="tint-blend-select"
								value={tintBlendMode}
								onChange={(e) => setTintBlendMode(e.target.value)}
							>
								{BLEND_MODES.map(mode => (
									<option key={mode} value={mode}>{mode}</option>
								))}
							</select>
						</div>
					</div>

					{/* ─── MUSIC ─── */}
					<h5 className="controls-subtitle">Music</h5>
					<div className="music-tracks">
						{TRACKS.map((track, i) => (
							<button
								key={track.name}
								className={`art-deco-button small music-track-btn${activeTrack === i ? ' active-track' : ''}`}
								onClick={() => handleTrackSelect(i)}
							>
								<span className="music-icon">{activeTrack === i && musicPlaying ? '⏸' : '▶'}</span>
								{track.name}
							</button>
						))}
					</div>
					<div className="music-volume">
						<label className="effect-label">Volume: {Math.round(musicVolume * 100)}%</label>
						<input
							type="range"
							className="art-deco-range"
							min="0" max="1" step="0.05"
							value={musicVolume}
							onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
						/>
					</div>

					{/* ─── PLAYBACK ─── */}
					<h5 className="controls-subtitle">Playback</h5>
					<div className="controls-buttons">
						{['play', 'pause', 'mute', 'slow', 'fast'].map(action => (
							<button
								key={action}
								className="art-deco-button small"
								onClick={() => handleVideoControl(action)}
							>
								{action.charAt(0).toUpperCase() + action.slice(1)}
							</button>
						))}
					</div>

					{/* ─── VIDEO EFFECTS ─── */}
					<h5 className="controls-subtitle">Video Effects</h5>
					<div className="effects-grid">
						{EFFECTS.map(({ key, label, min, max, step, fmt }) => (
							<div key={key} className="effect-row">
								<label className="effect-label">{label}: {fmt(videoSettings[key])}</label>
								<input
									type="range"
									className="art-deco-range"
									min={min} max={max} step={step}
									value={videoSettings[key]}
									onChange={(e) => handleSliderChange(key, e.target.value)}
								/>
							</div>
						))}
					</div>

				</div>
			</div>
		</div>
	);
};

export default Home;
