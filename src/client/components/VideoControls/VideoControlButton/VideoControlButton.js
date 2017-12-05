import React, { Component } from 'react';
import PropTypes from 'prop-types';

class VideoControlButton extends Component {

	constructor() {
		super();
		this._onClick = this._onClick.bind(this);
	}

	_onClick(e) {
		e.preventDefault();
		this.props.onItemClick(this.props.control);
	}

	render() {
		let icon;

		switch (this.props.control) {
		case ('play'):
			icon = 'play_circle_outline';
			break;
		case ('pause'):
			icon = 'pause_circle_outline';
			break;
		case ('mute'):
			icon = 'volume_off';
			break;
		case ('unmute'):
			icon = 'volume_up';
			break;
		case ('slow'):
			icon = 'trending_down';
			break;
		case ('fast'):
			icon = 'trending_up';
			break;
		default:
			icon = 'view_headline';

		}
		return (
			<button onClick={this._onClick} className="waves-effect waves-light btn">
				<i className="material-icons left">
					{icon}
				</i>
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
