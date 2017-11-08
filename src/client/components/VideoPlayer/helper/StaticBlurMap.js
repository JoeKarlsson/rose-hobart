/*
  eslint
	react/prefer-stateless-function: 0
*/

import React, { Component } from 'react';
import ImagesPicker from './ImagesPicker';

const imgurify = (slugs) => {
	return slugs.split(',').map(id => `https://i.imgur.com/${id}.png`);
};

const images = imgurify('SzbbUvX,0PkQEk1,z2CQHpg,k9Eview,wh0On3P');

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

StaticBlurMap.images = images;

export default StaticBlurMap;
