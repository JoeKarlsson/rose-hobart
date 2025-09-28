import React, { useState, useRef, useCallback } from 'react';

// Import video file using Vite's asset handling
import videoMP4 from '../../assets/video/video.mp4';

const WebGLVideoPlayer = () => {
	const [settings, setSettings] = useState({
		contrast: 1,
		saturation: 1,
		brightness: 1,
		hue: 0,
		sepia: 0,
		invert: 0,
		blur: 0,
		grayscale: 0
	});

	const videoRef = useRef(null);

	const handleSettingChange = (property, value) => {
		const newValue = parseFloat(value);
		setSettings(prev => ({ ...prev, [property]: newValue }));
		applyFilters({ ...settings, [property]: newValue });
	};

	const applyFilters = useCallback((settings) => {
		const video = videoRef.current;
		if (video) {
			const filterString = `
				brightness(${settings.brightness})
				contrast(${settings.contrast})
				saturate(${settings.saturation})
				hue-rotate(${settings.hue}deg)
				sepia(${settings.sepia})
				invert(${settings.invert})
				blur(${settings.blur}px)
				grayscale(${settings.grayscale})
			`.replace(/\s+/g, ' ').trim();
			video.style.filter = filterString;
		}
	}, []);

	const handleVideoControl = (action) => {
		const video = videoRef.current;
		if (!video) return;

		switch (action) {
			case 'play':
				video.play();
				break;
			case 'pause':
				video.pause();
				break;
			case 'mute':
				video.muted = !video.muted;
				break;
			case 'slow':
				video.playbackRate = Math.max(0.1, video.playbackRate - 0.1);
				break;
			case 'fast':
				video.playbackRate = Math.min(3, video.playbackRate + 0.1);
				break;
			default:
				break;
		}
	};

	return (
		<div style={{ margin: '20px 0', textAlign: 'center' }}>
			{/* Video Player */}
			<div style={{ margin: '20px 0' }}>
				<video
					ref={videoRef}
					width="800"
					height="450"
					controls
					preload="metadata"
					muted
					playsInline
					style={{ 
						maxWidth: '100%', 
						height: 'auto',
						borderRadius: '8px',
						boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
					}}
				>
					<source type="video/mp4" src={videoMP4} />
					<source type="video/mp4" src="https://www.w3schools.com/html/mov_bbb.mp4" />
					Your browser does not support the video tag.
				</video>
			</div>

			{/* Video Effects */}
			<div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#000000', border: '1px solid #333333', borderRadius: '8px' }}>
				<h4 style={{ color: '#cccccc' }}>CSS Video Effects</h4>
				
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
					<div>
						<label style={{ color: '#cccccc' }}>Brightness: {settings.brightness.toFixed(2)}</label>
						<input
							type="range"
							min="0"
							max="2"
							step="0.1"
							value={settings.brightness}
							onChange={(e) => handleSettingChange('brightness', e.target.value)}
							style={{ width: '100%', margin: '5px 0' }}
						/>
					</div>
					<div>
						<label style={{ color: '#cccccc' }}>Contrast: {settings.contrast.toFixed(2)}</label>
						<input
							type="range"
							min="0"
							max="2"
							step="0.1"
							value={settings.contrast}
							onChange={(e) => handleSettingChange('contrast', e.target.value)}
							style={{ width: '100%', margin: '5px 0' }}
						/>
					</div>
					<div>
						<label style={{ color: '#cccccc' }}>Saturation: {settings.saturation.toFixed(2)}</label>
						<input
							type="range"
							min="0"
							max="2"
							step="0.1"
							value={settings.saturation}
							onChange={(e) => handleSettingChange('saturation', e.target.value)}
							style={{ width: '100%', margin: '5px 0' }}
						/>
					</div>
					<div>
						<label style={{ color: '#cccccc' }}>Hue: {settings.hue}°</label>
						<input
							type="range"
							min="0"
							max="360"
							step="1"
							value={settings.hue}
							onChange={(e) => handleSettingChange('hue', e.target.value)}
							style={{ width: '100%', margin: '5px 0' }}
						/>
					</div>
					<div>
						<label style={{ color: '#cccccc' }}>Sepia: {settings.sepia.toFixed(2)}</label>
						<input
							type="range"
							min="0"
							max="1"
							step="0.1"
							value={settings.sepia}
							onChange={(e) => handleSettingChange('sepia', e.target.value)}
							style={{ width: '100%', margin: '5px 0' }}
						/>
					</div>
					<div>
						<label style={{ color: '#cccccc' }}>Invert: {settings.invert ? 'On' : 'Off'}</label>
						<input
							type="range"
							min="0"
							max="1"
							step="1"
							value={settings.invert}
							onChange={(e) => handleSettingChange('invert', e.target.value)}
							style={{ width: '100%', margin: '5px 0' }}
						/>
					</div>
					<div>
						<label style={{ color: '#cccccc' }}>Blur: {settings.blur.toFixed(1)}px</label>
						<input
							type="range"
							min="0"
							max="10"
							step="0.5"
							value={settings.blur}
							onChange={(e) => handleSettingChange('blur', e.target.value)}
							style={{ width: '100%', margin: '5px 0' }}
						/>
					</div>
					<div>
						<label style={{ color: '#cccccc' }}>Grayscale: {settings.grayscale.toFixed(2)}</label>
						<input
							type="range"
							min="0"
							max="1"
							step="0.1"
							value={settings.grayscale}
							onChange={(e) => handleSettingChange('grayscale', e.target.value)}
							style={{ width: '100%', margin: '5px 0' }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WebGLVideoPlayer;