/*
  eslint
	jsx-a11y/media-has-caption: 0
	react/no-string-refs: 0
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Shaders, GLSL, Node } from 'gl-react';
import { Surface } from 'gl-react-dom';
import raf from 'raf';
import videoMP4 from '../../assets/video/video.mp4';

export { videoMP4 };

// We implement a component <Video> that is like <video>
// but provides a onFrame hook so we can efficiently only render
// if when it effectively changes.
export class Video extends Component {
	componentDidMount() {
		const loop = () => {
			this._raf = raf(loop);
			const { video } = this.refs;
			if (!video) return;
			const { currentTime } = video;
			// Optimization that only call onFrame if time changes
			if (currentTime !== this.currentTime) {
				this.currentTime = currentTime;
				this.props.onFrame(currentTime);
			}
		};
		this._raf = raf(loop);
	}
	componentWillUnmount() {
		raf.cancel(this._raf);
	}
	render() {
		const { onFrame, ...rest } = this.props;
		return <video {...rest} ref="video" />;
	}
}

Video.propTypes = {
	onFrame: PropTypes.func.isRequired, // eslint-disable-line react/forbid-prop-types
};

// Our example will simply split R G B channels of the video.
const shaders = Shaders.create({
	SplitColor: {
		frag: GLSL`
		precision highp float;
		varying vec2 uv;
		uniform sampler2D children;
		void main () {
		  float y = uv.y * 3.0;
		  vec4 c = texture2D(children, vec2(uv.x, mod(y, 1.0)));
		  gl_FragColor = vec4(
		    c.r * step(2.0, y) * step(y, 3.0),
		    c.g * step(1.0, y) * step(y, 2.0),
		    c.b * step(0.0, y) * step(y, 1.0),
		    1.0);
		}`,
	},
// ^NB perf: in fragment shader paradigm, we want to avoid code branch (if / for)
// and prefer use of built-in functions and just giving the GPU some computating.
// step(a,b) is an alternative to do if(): returns 1.0 if a<b, 0.0 otherwise.
});

const SplitColor = ({ children }) => (
	<Node shader={shaders.SplitColor} uniforms={{ children }} />
);

SplitColor.propTypes = {
	children: PropTypes.node.isRequired, // eslint-disable-line react/forbid-prop-types
};

// We now uses <Video> in our GL graph.
// The texture we give to <SplitColor> is a (redraw)=><Video> function.
// redraw is passed to Video onFrame event and Node gets redraw each video frame.
export default () => {
	return (
		<Surface width={280} height={630} pixelRatio={1}>
			<SplitColor>
				{redraw => (
					<Video onFrame={redraw} autoPlay loop>
						<source type="video/mp4" src={videoMP4} />
					</Video>
				)}
			</SplitColor>
		</Surface>
	);
};
