/*
  eslint
	jsx-a11y/label-has-for: 0
*/

// https://codepen.io/bennettfeely/pen/kmhBI?depth=everything&order=popularity&page=9&q=video&show_forks=false

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StaticBlurMap from './StaticBlurMap/StaticBlurMap';
import FloatSlider from './FloatSlider/FloatSlider';
import VideoControlButton from './VideoControlButton/VideoControlButton';
import hash from '../../helper/hash';
import './VideoControls.scss';

// We must use a <Bus> if we don't want the <video> element to be duplicated
// per Blur pass.. Also since we can dynamically change the number of passes,
// it changes the tree level, (e.g. Blur1D>Blur1D>video becomes Blur1D>video)
// and React always destroys and recreates the instance during reconcialition.
class VideoControls extends Component {
	constructor() {
		super();
		this.state = {};

		this.controls = ['play', 'pause', 'mute'];
	}

	render() {
		const {
			factor,
			passes,
			contrast,
			saturation,
			brightness,
			onStaticBlurMapChange,
			handleClick,
			onChange,
		} = this.props;

		return (
			<div className="VideoControls row">
				<form className="col s12">
					<div className="row">
						{this.controls.map(control => (
							<VideoControlButton
								key={hash(control)}
								control={control}
								onItemClick={handleClick}
							/>
						))}
						<div>
							<label>
								<strong>Blur Factor</strong>
							</label>
							<FloatSlider
								title="factor"
								min={0}
								max={8}
								step={0.2}
								handleChange={onChange}
								value={factor}
							/>
						</div>
						<div>
							<label><strong>Blur Passes</strong></label>
							<FloatSlider
								title="passes"
								min={1}
								max={8}
								step={1}
								handleChange={onChange}
								value={passes}
							/>
						</div>
						<div>
							<label><strong>Saturation</strong></label>
							<FloatSlider
								title="saturation"
								min={0}
								max={2}
								step={0.05}
								handleChange={onChange}
								value={saturation}
							/>
						</div>
						<div>
							<label><strong>Brightness</strong></label>
							<FloatSlider
								title="brightness"
								min={0}
								max={2}
								step={0.05}
								handleChange={onChange}
								value={brightness}
							/>
						</div>
						<div>
							<label><strong>Contrast</strong></label>
							<FloatSlider
								title="contrast"
								min={0}
								max={2}
								step={0.05}
								handleChange={onChange}
								value={contrast}
							/>
						</div>

						<StaticBlurMap handleChange={onStaticBlurMapChange} />

					</div>
				</form>
			</div>
		);
	}
}

VideoControls.propTypes = {
	factor: PropTypes.number.isRequired,
	passes: PropTypes.number.isRequired,
	contrast: PropTypes.number.isRequired,
	saturation: PropTypes.number.isRequired,
	brightness: PropTypes.number.isRequired,
	onStaticBlurMapChange: PropTypes.func.isRequired,
	handleClick: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
};

VideoControls.defaultProps = {};

export default VideoControls;
