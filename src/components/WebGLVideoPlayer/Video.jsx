import React, { useRef, useEffect, forwardRef } from 'react';
import videoMP4 from '../../assets/video/video.mp4';

export { videoMP4 };

export const Video = forwardRef(({ onFrame, ...rest }, ref) => {
	const videoRef = useRef(null);
	const rafRef = useRef(null);
	const currentTimeRef = useRef(0);

	useEffect(() => {
		const loop = () => {
			rafRef.current = requestAnimationFrame(loop);
			const video = videoRef.current;
			if (!video) return;
			const { currentTime } = video;
			// Optimization that only call onFrame if time changes
			if (currentTime !== currentTimeRef.current) {
				currentTimeRef.current = currentTime;
				onFrame(currentTime);
			}
		};
		rafRef.current = requestAnimationFrame(loop);

		return () => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, [onFrame]);

	// Expose video element through ref for parent components
	React.useImperativeHandle(ref, () => ({
		refs: {
			video: videoRef.current
		}
	}));

	return (
		<video
			className="video"
			ref={videoRef}
			{...rest}
		/>
	);
});

// PropTypes removed for production optimization

Video.displayName = 'Video';

export default Video;
