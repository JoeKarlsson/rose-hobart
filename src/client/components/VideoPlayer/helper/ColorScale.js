import React from 'react';
import PropTypes from 'prop-types';
import { Shaders, Node, GLSL } from 'gl-react';
import colorScales from './colorScales';

export { colorScales };

const shaders = Shaders.create({
	colorify: {
		frag: GLSL`
		precision highp float;
		varying vec2 uv;
		uniform sampler2D children, colorScale;
		float greyscale (vec3 c) { return 0.2125 * c.r + 0.7154 * c.g + 0.0721 * c.b; }
		void main() {
		  vec4 original = texture2D(children, uv);
		  vec4 newcolor = texture2D(colorScale, vec2(greyscale(original.rgb), 0.5));
		  gl_FragColor = vec4(newcolor.rgb, original.a * newcolor.a);
		}`,
	},
});

const Colorify = ({ children, colorScale, interpolation }) => (
	<Node
		shader={shaders.colorify}
		uniformsOptions={{ colorScale: { interpolation } }}
		uniforms={{ colorScale, children }}
	/>
);

Colorify.propTypes = {
	interpolation: PropTypes.string, // eslint-disable-line react/forbid-prop-types
	colorScale: PropTypes.object, // eslint-disable-line react/forbid-prop-types
	children: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
};

Colorify.defaultProps = {
	interpolation: 'nearest',
	colorScale: Object.keys(colorScales)[0],
};


export default Colorify;
