/*
  eslint
	react/prefer-stateless-function: 0
*/

import React, { Component } from 'react';
import ImagesPicker from './ImagesPicker/ImagesPicker';
import images from '../../../helper/images';

class StaticBlurMap extends Component {
	render() {
		return (
			<ImagesPicker
				{...this.props}
				imageStyle={{ width: 80 }}
				images={images}
			/>
		);
	}
}

export default StaticBlurMap;
