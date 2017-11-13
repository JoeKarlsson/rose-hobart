import React, { Component } from 'react';
import PropTypes from 'prop-types';

class VideoControlButton extends Component {

	constructor() {
		super();
		this._onClick = this._onClick.bind(this);
	}

	_onClick() {
		this.props.onItemClick(this.props.control);
	}

	render() {
		return (
			<button onClick={this._onClick}>
				{this.props.control}
			</button>
		);
	}
}

VideoControlButton.propTypes = {
	onItemClick: PropTypes.func.isRequired,
	control: PropTypes.string.isRequired,
};

VideoControlButton.defaultProps = {

};

export default VideoControlButton;
