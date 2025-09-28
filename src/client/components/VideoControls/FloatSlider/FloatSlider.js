import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FloatSlider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			value: props.value || 0,
		};

		this.onChange = this.onChange.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.value !== this.props.value) {
			this.setState({ value: this.props.value });
		}
	}

	onChange(e) {
		const val = parseFloat(e.target.value);

		this.setState({
			value: val,
		});

		const obj = {};
		obj[this.props.title] = val;
		this.props.handleChange(obj);
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
	title: PropTypes.string,
	min: PropTypes.number,
	max: PropTypes.number,
	step: PropTypes.number,
	value: PropTypes.number,
	handleChange: PropTypes.func.isRequired,
};

FloatSlider.defaultProps = {
	title: '',
	min: 0,
	max: 1,
	step: 1,
};

export default FloatSlider;
