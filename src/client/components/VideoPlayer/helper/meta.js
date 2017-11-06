import React from 'react';
import FloatSlider from './makeFloatSlider';
import StaticBlurMap from './staticBlurMap';

const toolbox = [
	{
		prop: 'contrast',
		title: 'Contrast',
		Editor: <FloatSlider
			min={0}
			max={2}
			step={0.05}
		/>,
	}, {
		prop: 'map',
		title: 'Blur Texture Map',
		Editor: StaticBlurMap,
	},
];

export default toolbox;
