import React from 'react';
import PropTypes from 'prop-types';
import { Shaders, Node, GLSL } from 'gl-react';

const shaders = Shaders.create({
	Saturate: {
		frag: GLSL`
		precision highp float;
		varying vec2 uv;
		uniform sampler2D t;
		uniform float contrast, saturation, brightness;
		const vec3 L = vec3(0.2125, 0.7154, 0.0721);
		void main() {
		  vec4 c = texture2D(t, uv);
			vec3 brt = c.rgb * brightness;
			gl_FragColor = vec4(mix(
		    vec3(0.5),
		    mix(vec3(dot(brt, L)), brt, saturation),
		    contrast), c.a);
		}`,
	},
});

const Saturate = (
	{
		contrast,
		saturation,
		brightness,
		children,
	},
) => (
	<Node
		shader={shaders.Saturate}
		uniforms={{
			contrast,
			saturation,
			brightness,
			t: children,
		}}
	/>
);

Saturate.propTypes = {
	contrast: PropTypes.number.isRequired,
	saturation: PropTypes.number.isRequired,
	brightness: PropTypes.number.isRequired,
	children: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

Saturate.defaultProps = {};

export default Saturate;
