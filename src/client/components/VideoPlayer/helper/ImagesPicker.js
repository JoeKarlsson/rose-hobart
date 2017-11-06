/*
  eslint
	react/forbid-prop-types: 0
*/

import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';

class ImagePickable extends PureComponent {

	onClick() {
		this.props.onChange(this.props.src);
	}

	render() {
		const { src, selected, style } = this.props;
		return (
			<img
				alt=""
				src={src}
				onClick={this.onClick}
				style={{
					borderWidth: 2,
					borderColor: selected ? '#F00' : 'transparent',
					borderStyle: 'solid',
					...style,
				}}
			/>
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

class ImagesPicker extends Component {

	static imageNodewBuilder(src) {
		const {
			value,
			onChange,
			imageStyle,
		} = this.props;

		console.log(this.props);

		return (
			<ImagePickable
				key={src}
				onChange={onChange}
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

		const imageNode = images.map(ImagesPicker.imageNodewBuilder);


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
	onChange: PropTypes.any,
};

ImagesPicker.defaultProps = {
	imageStyle: '',
	style: '',
	value: '',
	images: [''],
	onChange: () => '',
};

export default ImagesPicker;
