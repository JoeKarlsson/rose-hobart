import React from 'react';
import VideoPlayer from '../../VideoPlayer/VideoPlayer';
import ErrorBoundary from '../../shared/ErrorBoundary/ErrorBoundary';

const Home = () => {
	return (
		<div className="Home">
			<ErrorBoundary>
				<VideoPlayer />
			</ErrorBoundary>
		</div>
	);
};

export default Home;
