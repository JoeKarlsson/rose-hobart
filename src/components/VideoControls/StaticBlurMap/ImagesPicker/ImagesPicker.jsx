/*
  eslint
	react/forbid-prop-types: 0
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImagePickable from './ImagePickable/ImagePickable';

class ImagesPicker extends Component {
	constructor() {
		super();
		this.imageNodeBuilder = this.imageNodeBuilder.bind(this);
	}

	imageNodeBuilder(src) {
		const {
			value,
			handleChange,
			imageStyle,
		} = this.props;

		return (
			<ImagePickable
				key={src}
				onChange={handleChange}
				src={src}
				selected={src === value}
				style={imageStyle}
			/>
		);
	}


	render() {
		const {
			images,
			style,
		} = this.props;

		const imageNode = images.map(this.imageNodeBuilder);


		return (
			<div style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-around',
				flexWrap: 'wrap',
				...style,
			}}
			>
				{imageNode}
			</div>
		);
	}
}

ImagesPicker.propTypes = {
	imageStyle: PropTypes.any,
	style: PropTypes.any,
	value: PropTypes.string,
	images: PropTypes.array,
	handleChange: PropTypes.func.isRequired,
};

ImagesPicker.defaultProps = {
	imageStyle: '',
	style: '',
	value: '',
	images: [''],
};

export default ImagesPicker;
