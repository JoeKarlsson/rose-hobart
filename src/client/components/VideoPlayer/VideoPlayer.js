import React from 'react';
import { Surface } from 'gl-react-dom';
import SplitColor from './helper/splitColor';
import Video from './Video';
import videoMP4 from '../../assets/video/video.mp4';
import poster from '../../assets/images/poster.png';

export { videoMP4 };

// We now uses <Video> in our GL graph.
// The texture we give to <SplitColor> is a (redraw)=><Video> function.
// redraw is passed to Video onFrame event and Node gets redraw each video frame.
export default () => {
	return (
		<Surface width={400} height={1000} pixelRatio={1}>
			<SplitColor>
				{redraw => (
					<Video onFrame={redraw} autoPlay loop poster={poster} controls>
						<source type="video/mp4" src={videoMP4} />
					</Video>
				)}
				<div>TEST</div>
			</SplitColor>
		</Surface>
	);
};
