/*
  eslint
	jsx-a11y/media-has-caption: 0
*/

import React, { useState, useRef, useCallback } from 'react';
// import { Bus } from 'gl-react';
// import { Surface } from 'gl-react-dom';
// import { BlurV } from './helper/blurMap.jsx';
// import Saturate from './helper/Saturate.jsx';
// import Colorify from './helper/ColorScale.jsx';
// import colorScales from './helper/colorScales';
import { Video, videoMP4 } from '../Video/Video.jsx';
import VideoControls from '../VideoControls/VideoControls.jsx';
import images from '../../helper/images';
import './VideoPlayer.scss';

// We must use a <Bus> if we don't want the <video> element to be duplicated
// per Blur pass.. Also since we can dynamically change the number of passes,
// it changes the tree level, (e.g. Blur1D>Blur1D>video becomes Blur1D>video)
// and React always destroys and recreates the instance during reconcialition.
const VideoPlayer = () => {
	const [state, setState] = useState({
		showOrginalVid: false,
		color: Object.keys(colorScales)[0],
		contrast: 1,
		saturation: 1,
		brightness: 1,
		factor: 2,
		passes: 4,
		map: images[0],
	});

	const videoRef = useRef(null);
	const busRef = useRef(null);

	const controls = ['play', 'pause', 'mute'];

	const onChange = useCallback((newState) => {
		setState(prevState => ({ ...prevState, ...newState }));
	}, []);

	const onStaticBlurMapChange = useCallback((img) => {
		setState(prevState => ({ ...prevState, map: img }));
	}, []);

	const handleColorChange = useCallback((color) => {
		setState(prevState => ({
			...prevState,
			color,
			showOrginalVid: false,
		}));
	}, []);

	const handleClick = useCallback((method) => {
		// https://codepen.io/OddlyTimbot/pen/DvGst
		const video = videoRef.current?.refs?.video;
		if (!video) return;

		switch (method) {
		case ('pause'):
			video.pause();
			break;
		case ('play'):
			video.play();
			break;
		case ('mute'):
			video.muted = true;
			break;
		case ('unmute'):
			video.muted = false;
			break;
		case ('slow'):
			video.playbackRate -= 0.1;
			break;
		case ('fast'):
			video.playbackRate += 0.1;
			break;
		case ('original'):
			setState(prevState => ({ ...prevState, showOrginalVid: true }));
			break;
		default:
			break;
		}
	}, []);

	const {
		showOrginalVid,
		color,
		factor,
		passes,
		contrast,
		saturation,
		brightness,
		map,
	} = state;

	return (
		<div className="VideoPlayer">
			{showOrginalVid ? (
				<iframe
					title="Rose Hobart"
					width="560"
					height="315"
					src="https://www.youtube.com/embed/pQxtZlQlTDA?rel=0"
					frameBorder="0"
					gesture="media"
					allow="encrypted-media"
					allowFullScreen
				/>
			) : (
				<div style={{ width: '880px', height: '500px', border: '2px solid #ccc', margin: '20px 0' }}>
					<h3>Video Player (WebGL temporarily disabled)</h3>
					<video
						ref={videoRef}
						width="880"
						height="500"
						autoPlay
						loop
						controls
						style={{ width: '100%', height: '100%' }}
					>
						<source type="video/mp4" src={videoMP4} />
						<source type="video/mp4" src="https://www.w3schools.com/html/mov_bbb.mp4" />
						Your browser does not support the video tag.
					</video>
					<div style={{ padding: '10px', background: '#f0f0f0' }}>
						<p><strong>Current Settings:</strong></p>
						<p>Color: {color}</p>
						<p>Factor: {factor}</p>
						<p>Passes: {passes}</p>
						<p>Contrast: {contrast}</p>
						<p>Saturation: {saturation}</p>
						<p>Brightness: {brightness}</p>
					</div>
				</div>
			)}

			{/* <VideoControls
				color={color}
				factor={factor}
				passes={passes}
				contrast={contrast}
				saturation={saturation}
				brightness={brightness}
				onStaticBlurMapChange={onStaticBlurMapChange}
				handleColorChange={handleColorChange}
				handleClick={handleClick}
				onChange={onChange}
			/> */}
		</div>
	);
};

VideoPlayer.propTypes = {};

VideoPlayer.defaultProps = {};

export default VideoPlayer;
