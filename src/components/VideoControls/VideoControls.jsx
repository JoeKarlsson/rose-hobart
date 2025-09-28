/*
  eslint
	jsx-a11y/label-has-for: 0
*/

import React from 'react';
import PropTypes from 'prop-types';
import { NearestCopy } from 'gl-react';
import { Surface } from 'gl-react-dom';
import StaticBlurMap from './StaticBlurMap/StaticBlurMap.jsx';
import FloatSlider from './FloatSlider/FloatSlider';
import VideoControlButton from './VideoControlButton/VideoControlButton';
import Selector from './Selector';
import colorScales from '../VideoPlayer/helper/colorScales';
import hash from '../../helper/hash';
import './VideoControls.scss';

const ToolboxFooter = ({ color }) => (
	<Surface style={{ minWidth: '100%' }} width={400} height={20}>
		<NearestCopy>{colorScales[color]}</NearestCopy>
	</Surface>
);

ToolboxFooter.propTypes = {
	color: PropTypes.string.isRequired,
};

ToolboxFooter.defaultProps = {};

// We must use a <Bus> if we don't want the <video> element to be duplicated
// per Blur pass.. Also since we can dynamically change the number of passes,
// it changes the tree level, (e.g. Blur1D>Blur1D>video becomes Blur1D>video)
// and React always destroys and recreates the instance during reconcialition.
const VideoControls = ({
	color,
	factor,
	passes,
	contrast,
	saturation,
	brightness,
	onStaticBlurMapChange,
	handleColorChange,
	handleClick,
	onChange,
}) => {
	const controls = ['play', 'pause', 'mute', 'unmute', 'slow', 'fast', 'original'];

	const choices = Object.keys(colorScales).map((cs) => {
		return { key: cs, label: cs };
	});

	return (
		<div className="VideoControls row">
			<form className="col s12">
				<div className="row">
					<ToolboxFooter color={color} />

					<Selector choices={choices} onChange={handleColorChange} currColor={color} />
				</div>
				<div className="row">
					{controls.map(control => (
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
};

VideoControls.propTypes = {
	color: PropTypes.string.isRequired,
	factor: PropTypes.number.isRequired,
	passes: PropTypes.number.isRequired,
	contrast: PropTypes.number.isRequired,
	saturation: PropTypes.number.isRequired,
	brightness: PropTypes.number.isRequired,
	onStaticBlurMapChange: PropTypes.func.isRequired,
	handleColorChange: PropTypes.func.isRequired,
	handleClick: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
};

VideoControls.defaultProps = {};

export default VideoControls;
