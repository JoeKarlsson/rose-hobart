/*
  eslint
	jsx-a11y/media-has-caption: 0
	react/no-string-refs: 0
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import raf from 'raf';

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
			// Optimization that only call onFrame if time cha
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

export default Video;
