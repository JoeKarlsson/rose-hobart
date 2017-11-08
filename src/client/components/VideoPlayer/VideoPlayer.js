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
import StaticBlurMap from './helper/StaticBlurMap';
import SplitColor from './helper/SplitColor';
import { Video, videoMP4 } from './Video';
import FloatSlider from './helper/FloatSlider';

// We must use a <Bus> if we don't want the <video> element to be duplicated
// per Blur pass.. Also since we can dynamically change the number of passes,
// it changes the tree level, (e.g. Blur1D>Blur1D>video becomes Blur1D>video)
// and React always destroys and recreates the instance during reconcialition.
class VideoPlayer extends Component {
	constructor() {
		super();
		this.state = {
			contrast: 1,
			saturation: 1,
			brightness: 1,
			factor: 2,
			passes: 4,
			map: StaticBlurMap.images[0],
		};

		this.onChange = this.onChange.bind(this);
		this.onStaticBlurMapChange = this.onStaticBlurMapChange.bind(this);
	}

	onChange(newState) {
		this.setState(newState);
	}

	onStaticBlurMapChange(img) {
		this.setState({
			map: img,
		});
	}

	render() {
		const {
			factor,
			passes,
			contrast,
			saturation,
			brightness,
			map,
		} = this.state;


		return (
			<div>
				<Surface width={880} height={1000} pixelRatio={1}>
					<Bus ref="vid">
						<Saturate
							contrast={contrast}
							saturation={saturation}
							brightness={brightness}
						>
							<SplitColor>
								{redraw => (
									<Video onFrame={redraw} autoPlay loop>
										<source type="video/mp4" src={videoMP4} />
									</Video>
								)}
							</SplitColor>
						</Saturate>
					</Bus>
					<BlurV map={map} passes={passes} factor={factor}>
						{// as a texture, we give a function that resolve the video ref
							() => this.refs.vid}
					</BlurV>

				</Surface>
				<FloatSlider
					title="contrast"
					min={0}
					max={2}
					step={0.05}
					handleChange={this.onChange}
					value={contrast}
				/>
				<FloatSlider
					title="saturation"
					min={0}
					max={2}
					step={0.05}
					handleChange={this.onChange}
					value={saturation}
				/>
				<FloatSlider
					title="brightness"
					min={0}
					max={2}
					step={0.05}
					handleChange={this.onChange}
					value={brightness}
				/>
				<FloatSlider
					title="factor"
					min={0}
					max={8}
					step={0.2}
					handleChange={this.onChange}
					value={factor}
				/>
				<FloatSlider
					title="passes"
					min={1}
					max={8}
					step={1}
					handleChange={this.onChange}
					value={passes}
				/>
				<StaticBlurMap handleChange={this.onStaticBlurMapChange} />
			</div>
		);
	}
}

VideoPlayer.propTypes = {};

VideoPlayer.defaultProps = {};

export default VideoPlayer;
