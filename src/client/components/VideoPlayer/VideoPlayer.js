/*
  eslint
	jsx-a11y/media-has-caption: 0
	react/no-string-refs: 0
*/

import React, { Component } from 'react';
import { Bus } from 'gl-react';
import { Surface } from 'gl-react-dom';
import { BlurV } from './helper/blurMap';
import Saturate from './helper/Saturate';
import Colorify from './helper/ColorScale';
import colorScales from './helper/colorScales';
import { Video, videoMP4 } from '../Video/Video';
import VideoControls from '../VideoControls/VideoControls';
import images from '../../helper/images';
import './VideoPlayer.scss';

// We must use a <Bus> if we don't want the <video> element to be duplicated
// per Blur pass.. Also since we can dynamically change the number of passes,
// it changes the tree level, (e.g. Blur1D>Blur1D>video becomes Blur1D>video)
// and React always destroys and recreates the instance during reconcialition.
class VideoPlayer extends Component {
	constructor() {
		super();
		this.state = {
			color: Object.keys(colorScales)[0],
			contrast: 1,
			saturation: 1,
			brightness: 1,
			factor: 2,
			passes: 4,
			map: images[0],
		};

		this.controls = ['play', 'pause', 'mute'];

		this.onChange = this.onChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.onStaticBlurMapChange = this.onStaticBlurMapChange.bind(this);
		this.handleColorChange = this.handleColorChange.bind(this);
	}

	onChange(newState) {
		this.setState(newState);
	}

	onStaticBlurMapChange(img) {
		this.setState({
			map: img,
		});
	}

	handleColorChange(color) {
		this.setState({
			color,
		});
	}

	handleClick(method) {
		// https://codepen.io/OddlyTimbot/pen/DvGst
		const { video } = this.video.refs;
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
		default:
			break;
		}
	}

	render() {
		const {
			color,
			factor,
			passes,
			contrast,
			saturation,
			brightness,
			map,
		} = this.state;


		return (
			<div className="VideoPlayer">
				<Surface width={880} height={500} pixelRatio={1}>
					<Bus ref="vid">
						<Saturate
							contrast={contrast}
							saturation={saturation}
							brightness={brightness}
						>
							<Colorify
								colorScale={colorScales[color]}
							>
								{redraw => (
									<Video
										onFrame={redraw}
										autoPlay
										loop
										ref={(input) => { this.video = input; }}
									>
										<source type="video/mp4" src={videoMP4} />
									</Video>
								)}
							</Colorify>

						</Saturate>
					</Bus>
					<BlurV map={map} passes={passes} factor={factor}>
						{// as a texture, we give a function that resolve the video ref
							() => this.refs.vid}
					</BlurV>
				</Surface>

				<VideoControls
					color={color}
					factor={factor}
					passes={passes}
					contrast={contrast}
					saturation={saturation}
					brightness={brightness}
					onStaticBlurMapChange={this.onStaticBlurMapChange}
					handleColorChange={this.handleColorChange}
					handleClick={this.handleClick}
					onChange={this.onChange}
				/>

			</div>
		);
	}
}

VideoPlayer.propTypes = {};

VideoPlayer.defaultProps = {};

export default VideoPlayer;
