import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import WebGLVideoPlayer from '../../WebGLVideoPlayer/WebGLVideoPlayer';

// Use direct path reference for video
const videoMP4 = './assets/video-Bk2zJxfg.mp4';

// Debug video path resolution
console.log('🎬 Video Debug Info:');
console.log('📍 Video path:', videoMP4);
console.log('🌐 Current location:', window.location.href);
console.log('📁 Base URL:', window.location.origin);
console.log('🔗 Full video URL:', new URL(videoMP4, window.location.href).href);

// Test if video file exists
const testVideoExists = async () => {
	try {
		const response = await fetch(videoMP4, { method: 'HEAD' });
		console.log('🔍 Video file check:', response.status, response.statusText);
		if (response.ok) {
			console.log('✅ Video file exists and is accessible');
			console.log('📊 Content-Type:', response.headers.get('content-type'));
			console.log('📏 Content-Length:', response.headers.get('content-length'));
		} else {
			console.error('❌ Video file not accessible:', response.status, response.statusText);
		}
	} catch (error) {
		console.error('❌ Error checking video file:', error);
	}
};

// Run the test
testVideoExists();

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

	const colorPresets = useMemo(() => ({
		'Normal': { brightness: 1, contrast: 1, saturation: 1, hue: 0, sepia: 0, invert: 0 },
		'Vintage': { brightness: 0.9, contrast: 1.2, saturation: 0.8, hue: 0, sepia: 0.3, invert: 0 },
		'High Contrast': { brightness: 1.1, contrast: 1.5, saturation: 1.2, hue: 0, sepia: 0, invert: 0 },
		'Black & White': { brightness: 1, contrast: 1.2, saturation: 0, hue: 0, sepia: 0, invert: 0 },
		'Inverted': { brightness: 1, contrast: 1, saturation: 1, hue: 0, sepia: 0, invert: 1 },
		'Blue Tint': { brightness: 1, contrast: 1, saturation: 1.1, hue: 200, sepia: 0, invert: 0 }
	}), []);

	const handleVideoControl = useCallback((action) => {
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
	}, []);

	const handleSliderChange = useCallback((property, value) => {
		const newValue = parseFloat(value);
		setVideoSettings(prev => ({ ...prev, [property]: newValue }));
		applyFilters({ ...videoSettings, [property]: newValue });
	}, [videoSettings]);

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
			`.replace(/\s+/g, ' ').trim();
			video.style.filter = filterString;
		}
	}, []);

	// Video event handlers for debugging
	const handleVideoLoad = useCallback(() => {
		console.log('✅ Video loaded successfully');
		console.log('📊 Video duration:', videoRef.current?.duration);
		console.log('📏 Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
	}, []);

	const handleVideoError = useCallback((e) => {
		console.error('❌ Video loading error:', e);
		console.error('🎬 Video error details:', {
			error: videoRef.current?.error,
			networkState: videoRef.current?.networkState,
			readyState: videoRef.current?.readyState,
			src: videoRef.current?.src,
			currentSrc: videoRef.current?.currentSrc
		});
	}, []);

	const handleVideoCanPlay = useCallback(() => {
		console.log('🎵 Video can play');
	}, []);

	const handleVideoLoadStart = useCallback(() => {
		console.log('🚀 Video load started');
	}, []);

	const handleVideoProgress = useCallback(() => {
		if (videoRef.current?.buffered.length > 0) {
			const buffered = videoRef.current.buffered.end(0);
			const duration = videoRef.current.duration;
			console.log('📈 Video progress:', Math.round((buffered / duration) * 100) + '%');
		}
	}, []);

	const applyPreset = useCallback((presetName) => {
		const preset = colorPresets[presetName];
		setVideoSettings(preset);
		applyFilters(preset);
	}, [colorPresets, applyFilters]);

	// Debug useEffect hooks
	useEffect(() => {
		console.log('🏠 Home component mounted');
		console.log('🎬 Video ref:', videoRef.current);
	}, []);

	useEffect(() => {
		if (videoRef.current) {
			console.log('🎥 Video ref updated:', videoRef.current);
			console.log('📊 Video readyState:', videoRef.current.readyState);
			console.log('🎬 Video src:', videoRef.current.src);
			console.log('🔗 Video currentSrc:', videoRef.current.currentSrc);
		}
	}, [videoRef.current]);

	return (
		<div className="Home">
			<div className="container">

				{/* CSS Video Player */}
				{activeTab === 'css' && (
					<div style={{ margin: '20px 0', textAlign: 'center' }}>
						<video
							ref={videoRef}
							width="800"
							height="450"
							controls
							style={{
								maxWidth: '100%',
								height: 'auto'
							}}
							onLoad={handleVideoLoad}
							onError={handleVideoError}
							onCanPlay={handleVideoCanPlay}
							onLoadStart={handleVideoLoadStart}
							onProgress={handleVideoProgress}
						>
							<source type="video/mp4" src={videoMP4} />
							<source type="video/mp4" src="https://www.w3schools.com/html/mov_bbb.mp4" />
							<source type="video/mp4" src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" />
							Your browser does not support the video tag.
						</video>

						{/* Video Controls */}
						<div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#000000', border: '1px solid #333333', borderRadius: '8px' }}>
							<h4 style={{ color: '#cccccc' }}>Video Controls</h4>
							<div style={{ margin: '10px 0' }}>
								<button onClick={() => handleVideoControl('play')} style={{ margin: '5px', padding: '8px 16px', backgroundColor: '#333333', color: '#ffffff', border: '1px solid #555555', borderRadius: '4px', cursor: 'pointer' }}>▶️ Play</button>
								<button onClick={() => handleVideoControl('pause')} style={{ margin: '5px', padding: '8px 16px', backgroundColor: '#333333', color: '#ffffff', border: '1px solid #555555', borderRadius: '4px', cursor: 'pointer' }}>⏸️ Pause</button>
								<button onClick={() => handleVideoControl('mute')} style={{ margin: '5px', padding: '8px 16px', backgroundColor: '#333333', color: '#ffffff', border: '1px solid #555555', borderRadius: '4px', cursor: 'pointer' }}>🔇 Mute</button>
								<button onClick={() => handleVideoControl('slow')} style={{ margin: '5px', padding: '8px 16px', backgroundColor: '#333333', color: '#ffffff', border: '1px solid #555555', borderRadius: '4px', cursor: 'pointer' }}>🐌 Slow</button>
								<button onClick={() => handleVideoControl('fast')} style={{ margin: '5px', padding: '8px 16px', backgroundColor: '#333333', color: '#ffffff', border: '1px solid #555555', borderRadius: '4px', cursor: 'pointer' }}>🚀 Fast</button>
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

						{/* Debug Panel */}
						<div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#1a1a1a', border: '1px solid #333333', borderRadius: '8px' }}>
							<h4 style={{ color: '#cccccc' }}>🐛 Video Debug Panel</h4>
							<div style={{ color: '#cccccc', fontSize: '12px', fontFamily: 'monospace' }}>
								<div>📍 Video Path: {videoMP4}</div>
								<div>🌐 Current URL: {window.location.href}</div>
								<div>🔗 Full Video URL: {new URL(videoMP4, window.location.href).href}</div>
								<div>📊 Video Status: {videoRef.current?.readyState || 'Not loaded'}</div>
								<div>🎬 Video Error: {videoRef.current?.error ? videoRef.current.error.message : 'None'}</div>
								<div>📏 Video Dimensions: {videoRef.current?.videoWidth || 'N/A'} x {videoRef.current?.videoHeight || 'N/A'}</div>
								<div>⏱️ Video Duration: {videoRef.current?.duration || 'N/A'} seconds</div>
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