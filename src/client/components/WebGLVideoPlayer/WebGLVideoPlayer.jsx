import React, { useState, useRef, useCallback } from 'react';
import { Bus } from 'gl-react';
import { Surface } from 'gl-react-dom';
import { BlurV } from './shaders/BlurShader';
import SaturateShader from './shaders/SaturateShader';
import ColorifyShader from './shaders/ColorifyShader';
import DistortShader from './shaders/DistortShader';
import { Video } from './Video';
import videoMP4 from '../../assets/video/video.mp4';

const WebGLVideoPlayer = () => {
	const [settings, setSettings] = useState({
		showOriginal: false,
		color: 'normal',
		contrast: 1,
		saturation: 1,
		brightness: 1,
		blurFactor: 2,
		blurPasses: 4,
		distortion: 0,
		waveIntensity: 0,
		timeOffset: 0
	});

	// Animation for time-based effects
	React.useEffect(() => {
		const interval = setInterval(() => {
			setSettings(prev => ({
				...prev,
				timeOffset: prev.timeOffset + 0.1
			}));
		}, 100);
		return () => clearInterval(interval);
	}, []);

	const videoRef = useRef(null);
	const busRef = useRef(null);

	const colorScales = {
		normal: null, // No color grading
		heatmap: [1, 0, 0, 1, 0.6, 0, 0.4, 1, 0.4, 0.1, 0.7, 1, 0, 0, 1],
		monochrome: [1, 1, 1, 0.1, 0.2, 0.3],
		vintage: [0.9, 0.7, 0.5, 0.8, 0.6, 0.4, 0.7, 0.5, 0.3],
		blue: [0.2, 0.4, 0.8, 0.1, 0.3, 0.7, 0.0, 0.2, 0.6],
		red: [0.8, 0.2, 0.2, 0.7, 0.1, 0.1, 0.6, 0.0, 0.0]
	};

	const handleSettingChange = (property, value) => {
		setSettings(prev => ({ ...prev, [property]: value }));
	};

	const handleVideoControl = (action) => {
		const video = videoRef.current?.refs?.video;
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
			<h3>WebGL Video Player with Advanced Effects</h3>
			
			{settings.showOriginal ? (
				<video
					ref={videoRef}
					width="800"
					height="450"
					controls
					style={{ maxWidth: '100%', height: 'auto' }}
				>
					<source type="video/mp4" src={videoMP4} />
					Your browser does not support the video tag.
				</video>
			) : (
				<Surface width={800} height={450} pixelRatio={1}>
					<Bus ref={busRef}>
						<DistortShader
							distortion={settings.distortion}
							waveIntensity={settings.waveIntensity}
							timeOffset={settings.timeOffset}
						>
							<SaturateShader
								contrast={settings.contrast}
								saturation={settings.saturation}
								brightness={settings.brightness}
							>
								<ColorifyShader
									colorScale={colorScales[settings.color]}
								>
									{redraw => (
										<Video
											onFrame={redraw}
											autoPlay
											loop
											ref={videoRef}
										>
											<source type="video/mp4" src={videoMP4} />
										</Video>
									)}
								</ColorifyShader>
							</SaturateShader>
						</DistortShader>
					</Bus>
					<BlurV 
						map={null} 
						passes={settings.blurPasses} 
						factor={settings.blurFactor}
					>
						{() => busRef.current}
					</BlurV>
				</Surface>
			)}

			{/* WebGL Controls */}
			<div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
				<h4>WebGL Effects</h4>
				
				{/* Basic Controls */}
				<div style={{ margin: '10px 0' }}>
					<button onClick={() => handleVideoControl('play')} style={{ margin: '5px' }}>▶️ Play</button>
					<button onClick={() => handleVideoControl('pause')} style={{ margin: '5px' }}>⏸️ Pause</button>
					<button onClick={() => handleVideoControl('mute')} style={{ margin: '5px' }}>🔇 Mute</button>
					<button onClick={() => handleVideoControl('slow')} style={{ margin: '5px' }}>🐌 Slow</button>
					<button onClick={() => handleVideoControl('fast')} style={{ margin: '5px' }}>🚀 Fast</button>
					<button 
						onClick={() => handleSettingChange('showOriginal', !settings.showOriginal)}
						style={{ margin: '5px', backgroundColor: settings.showOriginal ? '#ff6b6b' : '#4ecdc4' }}
					>
						{settings.showOriginal ? '🎨 Show Effects' : '📺 Show Original'}
					</button>
				</div>

				{/* Color Grading */}
				<div style={{ margin: '20px 0' }}>
					<h5>Color Grading</h5>
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '10px 0' }}>
						{Object.keys(colorScales).map(color => (
							<button
								key={color}
								onClick={() => handleSettingChange('color', color)}
								style={{
									padding: '8px 16px',
									border: '1px solid #ccc',
									borderRadius: '4px',
									backgroundColor: settings.color === color ? '#4ecdc4' : '#fff',
									cursor: 'pointer'
								}}
							>
								{color.charAt(0).toUpperCase() + color.slice(1)}
							</button>
						))}
					</div>
				</div>

				{/* Effect Controls */}
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
					<div>
						<label>Brightness: {settings.brightness.toFixed(2)}</label>
						<input
							type="range"
							min="0"
							max="2"
							step="0.1"
							value={settings.brightness}
							onChange={(e) => handleSettingChange('brightness', parseFloat(e.target.value))}
							style={{ width: '100%', margin: '5px 0' }}
						/>
					</div>
					<div>
						<label>Contrast: {settings.contrast.toFixed(2)}</label>
						<input
							type="range"
							min="0"
							max="2"
							step="0.1"
							value={settings.contrast}
							onChange={(e) => handleSettingChange('contrast', parseFloat(e.target.value))}
							style={{ width: '100%', margin: '5px 0' }}
						/>
					</div>
					<div>
						<label>Saturation: {settings.saturation.toFixed(2)}</label>
						<input
							type="range"
							min="0"
							max="2"
							step="0.1"
							value={settings.saturation}
							onChange={(e) => handleSettingChange('saturation', parseFloat(e.target.value))}
							style={{ width: '100%', margin: '5px 0' }}
						/>
					</div>
					<div>
						<label>Blur Factor: {settings.blurFactor.toFixed(1)}</label>
						<input
							type="range"
							min="0"
							max="8"
							step="0.2"
							value={settings.blurFactor}
							onChange={(e) => handleSettingChange('blurFactor', parseFloat(e.target.value))}
							style={{ width: '100%', margin: '5px 0' }}
						/>
					</div>
					<div>
						<label>Blur Passes: {settings.blurPasses}</label>
						<input
							type="range"
							min="1"
							max="8"
							step="1"
							value={settings.blurPasses}
							onChange={(e) => handleSettingChange('blurPasses', parseInt(e.target.value))}
							style={{ width: '100%', margin: '5px 0' }}
						/>
					</div>
					<div>
						<label>Distortion: {settings.distortion.toFixed(2)}</label>
						<input
							type="range"
							min="0"
							max="0.1"
							step="0.01"
							value={settings.distortion}
							onChange={(e) => handleSettingChange('distortion', parseFloat(e.target.value))}
							style={{ width: '100%', margin: '5px 0' }}
						/>
					</div>
					<div>
						<label>Wave Intensity: {settings.waveIntensity.toFixed(2)}</label>
						<input
							type="range"
							min="0"
							max="0.5"
							step="0.01"
							value={settings.waveIntensity}
							onChange={(e) => handleSettingChange('waveIntensity', parseFloat(e.target.value))}
							style={{ width: '100%', margin: '5px 0' }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WebGLVideoPlayer;
