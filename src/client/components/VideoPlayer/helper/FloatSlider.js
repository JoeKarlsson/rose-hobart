import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FloatSlider extends Component {
	constructor() {
		super();

		this.state = {
			value: 0,
		};

		this.onChange = this.onChange.bind(this);
	}

	onChange(e) {
		const val = parseFloat(e.target.value);
		this.setState({
			value: val,
		});

		this.props.handleChange(val);
	}

	render() {

		const {
			min,
			max,
			step,
		} = this.props;

		const {
			value,
		} = this.state;


		return (
			<input
				style={{ flex: 1, width: '100%' }}
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={this.onChange}
			/>
		);
	}
}

FloatSlider.propTypes = {
	min: PropTypes.number,
	max: PropTypes.number,
	step: PropTypes.number,
	handleChange: PropTypes.func.isRequired,
};

FloatSlider.defaultProps = {
	min: 0,
	max: 1,
	step: 1,
};


export default FloatSlider;
