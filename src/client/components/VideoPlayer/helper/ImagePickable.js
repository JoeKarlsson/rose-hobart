/*
  eslint
	react/forbid-prop-types: 0
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ImagePickable extends PureComponent {
	constructor() {
		super();
		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		this.props.onChange(this.props.src);
	}

	render() {
		const { src, selected, style } = this.props;
		return (
			<button
				onClick={this.onClick}
				onKeyPress={this.onClick}
				tabIndex="0"
			>
				<img
					alt="Blur"
					src={src}
					style={{
						borderWidth: 2,
						borderColor: selected ? '#F00' : 'transparent',
						borderStyle: 'solid',
						...style,
					}}
				/>
			</button>
		);
	}
}

ImagePickable.propTypes = {
	style: PropTypes.any,
	src: PropTypes.string,
	selected: PropTypes.bool,
	onChange: PropTypes.func,
};

ImagePickable.defaultProps = {
	style: '',
	src: '',
	selected: false,
	onChange: () => '',
};

export default ImagePickable;
