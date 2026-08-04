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
import { videoMP4 } from '../Video/Video.jsx';
// import VideoControls from '../VideoControls/VideoControls.jsx'; // requires gl-react
import './VideoPlayer.scss';

// We must use a <Bus> if we don't want the <video> element to be duplicated
// per Blur pass.. Also since we can dynamically change the number of passes,
// it changes the tree level, (e.g. Blur1D>Blur1D>video becomes Blur1D>video)
// and React always destroys and recreates the instance during reconcialition.
const VideoPlayer = () => {
	const [showOriginalVid, setShowOriginalVid] = useState(false);
	const videoRef = useRef(null);

	const handleClick = useCallback((method) => {
		const video = videoRef.current;
		if (!video) return;

		switch (method) {
		case 'pause':
			video.pause();
			break;
		case 'play':
			video.play();
			break;
		case 'mute':
			video.muted = true;
			break;
		case 'unmute':
			video.muted = false;
			break;
		case 'slow':
			video.playbackRate -= 0.1;
			break;
		case 'fast':
			video.playbackRate += 0.1;
			break;
		case 'original':
			setShowOriginalVid(true);
			break;
		default:
			break;
		}
	}, []);

	return (
		<div className="VideoPlayer">
			{showOriginalVid ? (
				<iframe
					title="Rose Hobart"
					width="560"
					height="315"
					src="https://www.youtube.com/embed/pQxtZlQlTDA?rel=0"
					frameBorder="0"
					allow="encrypted-media"
					allowFullScreen
				/>
			) : (
				<video
					ref={videoRef}
					width="880"
					height="500"
					autoPlay
					loop
					controls
					style={{ width: '100%', height: 'auto' }}
				>
					<source type="video/mp4" src={videoMP4} />
					Your browser does not support the video tag.
				</video>
			)}
		</div>
	);
};

export default VideoPlayer;
