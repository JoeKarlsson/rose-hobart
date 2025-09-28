import React, { useState, useRef } from 'react';
import videoMP4 from '../../../assets/video/video.mp4';
import WebGLVideoPlayer from '../../WebGLVideoPlayer/WebGLVideoPlayer';

const Home = () => {
	console.log('Home component rendering...');
	const videoRef = useRef(null);
	const [activeTab, setActiveTab] = useState('css'); // 'css' or 'webgl'
	const [videoSettings, setVideoSettings] = useState({
		brightness: 1,
		contrast: 1,
		saturation: 1,
		playbackRate: 1,
		hue: 0,
		sepia: 0,
		invert: 0
	});

	const colorPresets = {
		'Normal': { brightness: 1, contrast: 1, saturation: 1, hue: 0, sepia: 0, invert: 0 },
		'Vintage': { brightness: 0.9, contrast: 1.2, saturation: 0.8, hue: 0, sepia: 0.3, invert: 0 },
		'High Contrast': { brightness: 1.1, contrast: 1.5, saturation: 1.2, hue: 0, sepia: 0, invert: 0 },
		'Black & White': { brightness: 1, contrast: 1.2, saturation: 0, hue: 0, sepia: 0, invert: 0 },
		'Inverted': { brightness: 1, contrast: 1, saturation: 1, hue: 0, sepia: 0, invert: 1 },
		'Blue Tint': { brightness: 1, contrast: 1, saturation: 1.1, hue: 200, sepia: 0, invert: 0 }
	};

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
				setVideoSettings(prev => ({ ...prev, playbackRate: video.playbackRate }));
				break;
			case 'fast':
				video.playbackRate = Math.min(3, video.playbackRate + 0.1);
				setVideoSettings(prev => ({ ...prev, playbackRate: video.playbackRate }));
				break;
			default:
				break;
		}
	};

	const handleSliderChange = (property, value) => {
		const newValue = parseFloat(value);
		setVideoSettings(prev => ({ ...prev, [property]: newValue }));
		applyFilters({ ...videoSettings, [property]: newValue });
	};

	const applyFilters = (settings) => {
		const video = videoRef.current;
		if (video) {
			const filterString = `
				brightness(${settings.brightness}) 
				contrast(${settings.contrast}) 
				saturate(${settings.saturation}) 
				hue-rotate(${settings.hue}deg) 
				sepia(${settings.sepia}) 
				invert(${settings.invert})
			`.replace(/\s+/g, ' ').trim();
			video.style.filter = filterString;
		}
	};

	const applyPreset = (presetName) => {
		const preset = colorPresets[presetName];
		setVideoSettings(preset);
		applyFilters(preset);
	};

	return (
		<div className="Home">
			<div className="container">
				<h1 className="center-align">Rose Hobart - Digital Humanities Project</h1>
				<p className="center-align flow-text">
					An interactive exploration of Joseph Cornell's short film with real-time video filters and effects.
				</p>
				
				{/* Tab Navigation */}
				<div style={{ margin: '20px 0', textAlign: 'center' }}>
					<div style={{ display: 'inline-block', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
						<button
							onClick={() => setActiveTab('css')}
							style={{
								padding: '12px 24px',
								border: 'none',
								backgroundColor: activeTab === 'css' ? '#4ecdc4' : '#f5f5f5',
								color: activeTab === 'css' ? 'white' : 'black',
								cursor: 'pointer',
								fontSize: '16px'
							}}
						>
							🎨 CSS Effects
						</button>
						<button
							onClick={() => setActiveTab('webgl')}
							style={{
								padding: '12px 24px',
								border: 'none',
								backgroundColor: activeTab === 'webgl' ? '#4ecdc4' : '#f5f5f5',
								color: activeTab === 'webgl' ? 'white' : 'black',
								cursor: 'pointer',
								fontSize: '16px'
							}}
						>
							🚀 WebGL Shaders
						</button>
					</div>
				</div>

				{/* CSS Video Player */}
				{activeTab === 'css' && (
					<div style={{ margin: '20px 0', textAlign: 'center' }}>
						<h3>CSS Effects Video Player</h3>
					<video
						ref={videoRef}
						width="800"
						height="450"
						controls
						style={{ 
							maxWidth: '100%', 
							height: 'auto'
						}}
					>
						<source type="video/mp4" src={videoMP4} />
						<source type="video/mp4" src="https://www.w3schools.com/html/mov_bbb.mp4" />
						Your browser does not support the video tag.
					</video>
					
					{/* Video Controls */}
					<div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
						<h4>Video Controls</h4>
						<div style={{ margin: '10px 0' }}>
							<button onClick={() => handleVideoControl('play')} style={{ margin: '5px' }}>▶️ Play</button>
							<button onClick={() => handleVideoControl('pause')} style={{ margin: '5px' }}>⏸️ Pause</button>
							<button onClick={() => handleVideoControl('mute')} style={{ margin: '5px' }}>🔇 Mute</button>
							<button onClick={() => handleVideoControl('slow')} style={{ margin: '5px' }}>🐌 Slow</button>
							<button onClick={() => handleVideoControl('fast')} style={{ margin: '5px' }}>🚀 Fast</button>
						</div>
						
						{/* Color Presets */}
						<div style={{ margin: '20px 0' }}>
							<h5>Color Presets</h5>
							<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '10px 0' }}>
								{Object.keys(colorPresets).map(preset => (
									<button
										key={preset}
										onClick={() => applyPreset(preset)}
										style={{
											padding: '8px 16px',
											border: '1px solid #ccc',
											borderRadius: '4px',
											backgroundColor: '#fff',
											cursor: 'pointer'
										}}
									>
										{preset}
									</button>
								))}
							</div>
						</div>
						
						{/* Video Effects */}
						<div style={{ margin: '20px 0' }}>
							<h5>Video Effects</h5>
							<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
								<div>
									<label>Brightness: {videoSettings.brightness.toFixed(2)}</label>
									<input
										type="range"
										min="0"
										max="2"
										step="0.1"
										value={videoSettings.brightness}
										onChange={(e) => handleSliderChange('brightness', e.target.value)}
										style={{ width: '100%', margin: '5px 0' }}
									/>
								</div>
								<div>
									<label>Contrast: {videoSettings.contrast.toFixed(2)}</label>
									<input
										type="range"
										min="0"
										max="2"
										step="0.1"
										value={videoSettings.contrast}
										onChange={(e) => handleSliderChange('contrast', e.target.value)}
										style={{ width: '100%', margin: '5px 0' }}
									/>
								</div>
								<div>
									<label>Saturation: {videoSettings.saturation.toFixed(2)}</label>
									<input
										type="range"
										min="0"
										max="2"
										step="0.1"
										value={videoSettings.saturation}
										onChange={(e) => handleSliderChange('saturation', e.target.value)}
										style={{ width: '100%', margin: '5px 0' }}
									/>
								</div>
								<div>
									<label>Hue: {videoSettings.hue}°</label>
									<input
										type="range"
										min="0"
										max="360"
										step="1"
										value={videoSettings.hue}
										onChange={(e) => handleSliderChange('hue', e.target.value)}
										style={{ width: '100%', margin: '5px 0' }}
									/>
								</div>
								<div>
									<label>Sepia: {videoSettings.sepia.toFixed(2)}</label>
									<input
										type="range"
										min="0"
										max="1"
										step="0.1"
										value={videoSettings.sepia}
										onChange={(e) => handleSliderChange('sepia', e.target.value)}
										style={{ width: '100%', margin: '5px 0' }}
									/>
								</div>
								<div>
									<label>Invert: {videoSettings.invert ? 'On' : 'Off'}</label>
									<input
										type="range"
										min="0"
										max="1"
										step="1"
										value={videoSettings.invert}
										onChange={(e) => handleSliderChange('invert', e.target.value)}
										style={{ width: '100%', margin: '5px 0' }}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				)}

				{/* WebGL Video Player */}
				{activeTab === 'webgl' && (
					<WebGLVideoPlayer />
				)}
			</div>
		</div>
	);
};

export default Home;
